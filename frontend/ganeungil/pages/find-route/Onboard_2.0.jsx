import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Sidebar20 from "./Sidebar_2.0";
import { useRoute } from "../../hooks/useRoute";

// ── 에셋 (헤더 + 장소 상세 카드용) ──
import imgPlace  from "@/assets/img-place.jpg";
import iconDrink from "@/assets/icon-drink.svg";
import iconFood  from "@/assets/icon-food.svg";
import iconRest  from "@/assets/icon-rest.svg";
import iconShop  from "@/assets/icon-shop.svg";
import iconView  from "@/assets/icon-view.svg";
import iconHeart from "@/assets/icon-heart.svg";

import markerSip   from "@/assets/map/iconsip.svg";
import markerBite  from "@/assets/map/iconbite.svg";
import markerFight from "@/assets/map/iconfight.svg";
import markerMeal  from "@/assets/map/iconmeal.svg";
import markerSee   from "@/assets/map/iconsee.svg";
import markerHansoom from "@/assets/map/icon_한숨.svg";

const MARKER_ICON = {
  "한잔":  markerSip,
  "한입":  markerBite,
  "한판":  markerFight,
  "한끼":  markerMeal,
  "한눈":  markerSee,
  "한숨":  markerHansoom,
};

const CATEGORY_LABEL_TO_ID = {
  "한 잔": 1,
  "한 입": 2,
  "한 숨": 3,
  "한 판": 4,
  "한 눈": 5,
  "한 끼": 6,
};

const CAT_ICON = {
  "한잔": iconDrink,
  "한입": iconFood,
  "한숨": iconRest,
  "한판": iconShop,
  "한눈": iconView,
  "한끼": iconFood,
};

// 위치 미허용 시 기본 중심점: 부산대학교 정문
const PUSAN_UNIV = { lat: 35.2316, lng: 129.0839 };

async function loadRecommendations(lat, lng) {
  const res = await api.get("/places/recommend", { params: { lat, lng } });
  return res.data; // { categories: [ { categoryId, categoryName, places, featured } ] }
}

function toPlaceList(raw, startId = 0) {
  if (!Array.isArray(raw)) return [];
  return raw.map((p, i) => ({
    id: p.id ?? startId + i + 1,
    name: p.name,
    category: p.category,
    walkMin: p.walkingMinutes,
    lat: p.lat,
    lng: p.lng,
    isOpen: p.isOpen ?? p.open ?? true,
    closeTime: p.closeTime ?? null,
    openTime: p.openTime ?? null,
    imageURL: p.imageURL ?? null,
    desc: "",
    tags: [],
  }));
}

// 사이드바용: 카테고리 전체 places
function mapToRecs(categories, categoryLabel) {
  const targetId = CATEGORY_LABEL_TO_ID[categoryLabel];
  const raw =
    categoryLabel === "전체"
      ? categories.flatMap((c) => c.places ?? [])
      : (categories.find((c) => c.categoryId === targetId)?.places ?? []);
  return toPlaceList(raw);
}

// 지도 마커용: featured (없으면 places[0] 폴백)
function mapToFeatured(categories, categoryLabel) {
  const targetId = CATEGORY_LABEL_TO_ID[categoryLabel];
  const raw =
    categoryLabel === "전체"
      ? categories.flatMap((c) => c.featured ?? c.places?.[0] ?? [])
      : (() => {
          const c = categories.find((c) => c.categoryId === targetId);
          return c?.featured ?? c?.places?.[0] ?? [];
        })();
  return toPlaceList(raw);
}

const fmt = (t) => t?.slice(0, 5) ?? null;

function HoursLabel({ place }) {
  if (place.isOpen) {
    if (!place.closeTime) return <span className="text-[6.9px] font-light text-[#2b8237]">영업 중</span>;
    return <span className="text-[6.9px] font-light text-[#2b8237]">영업 중 ({fmt(place.closeTime)}에 종료)</span>;
  }
  if (!place.openTime) return <span className="text-[6.9px] font-light text-[#c82b2b]">영업 종료</span>;
  return <span className="text-[6.9px] font-light text-[#c82b2b]">영업 종료 ({fmt(place.openTime)}에 시작)</span>;
}

export default function Onboard20() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [locStatus, setLocStatus]     = useState("pending"); // pending | granted | denied
  const [userCoords, setUserCoords]   = useState(null);      // { lat, lng }
  const [allCategories, setAllCategories] = useState([]);    // API 전체 응답
  const [recs, setRecs]               = useState([]);        // 사이드바: 전체 places
  const [featuredRecs, setFeaturedRecs] = useState([]);      // 지도 마커: featured만
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [recsState, setRecsState]     = useState("visible"); // visible | fading | hidden
  const [isOffline, setIsOffline]     = useState(!navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // 카카오맵 관련 refs
  const mapContainerRef = useRef(null); // <div> DOM 노드
  const kakaoMapRef     = useRef(null); // kakao.maps.Map 인스턴스
  const circleRef       = useRef(null); // 500m 반경 Circle
  const userDotRef      = useRef(null); // 내 위치 CustomOverlay
  const overlaysRef     = useRef([]);   // 추천 마커 CustomOverlay[]
  const recsRef         = useRef([]);   // recs 최신값 (window 콜백에서 참조)
  const featuredRef     = useRef([]);   // featuredRecs 최신값 (마커 클릭 콜백에서 참조)

  const { handleDestinationSelect, clearDestMarker, displayRoute } = useRoute(kakaoMapRef);

  // ref 동기화
  useEffect(() => { recsRef.current = recs; }, [recs]);
  useEffect(() => { featuredRef.current = featuredRecs; }, [featuredRecs]);

  // ── 지도 마커 클릭 핸들러 (window에 등록 → CustomOverlay HTML에서 호출)
  useEffect(() => {
    window.__onMarkerClick = (id) => {
      const place = featuredRef.current.find(p => p.id === id);
      if (!place) return;
      setSelectedPlace(prev => (prev?.id === id ? null : place));
    };
    return () => { delete window.__onMarkerClick; };
  }, []);

  // ── 위치 권한 요청 (네이티브 UI)
  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocStatus("granted");
        loadRecommendations(coords.lat, coords.lng)
          .then((data) => {
setAllCategories(data.categories);
            setRecs(mapToRecs(data.categories, "전체"));
            setFeaturedRecs(mapToFeatured(data.categories, "전체"));
          })
          .catch(console.error);
      },
      () => setLocStatus("denied")
    );
  }, []);

  // ── 네트워크 상태 감지
  useEffect(() => {
    const on  = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  // ── 카카오맵 초기화 (SDK 로드 대기 후 실행)
  useEffect(() => {
    const init = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) {
        setTimeout(init, 100);
        return;
      }
      if (kakaoMapRef.current) return; // 이미 초기화됨 (StrictMode 이중 실행 방지)
      try {
        const center = new window.kakao.maps.LatLng(PUSAN_UNIV.lat, PUSAN_UNIV.lng);
        kakaoMapRef.current = new window.kakao.maps.Map(mapContainerRef.current, {
          center,
          level: 4,
        });
        setMapReady(true);
        console.log("카카오맵 초기화 성공");
      } catch (e) {
        console.error("카카오맵 초기화 실패:", e);
      }
    };
    init();
  }, []);

  // ── 위치 확정 시 지도 중심 이동 + 반경 원 + 내 위치 마커
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map) return;

    // 기존 원/마커 제거
    if (circleRef.current)  { circleRef.current.setMap(null);  circleRef.current = null; }
    if (userDotRef.current) { userDotRef.current.setMap(null); userDotRef.current = null; }

    if (locStatus === "denied") {
      map.setCenter(new window.kakao.maps.LatLng(PUSAN_UNIV.lat, PUSAN_UNIV.lng));
      return;
    }
    if (locStatus !== "granted" || !userCoords) return;

    const pos = new window.kakao.maps.LatLng(userCoords.lat, userCoords.lng);
    map.setCenter(pos);

    // 250m 반경 원
    circleRef.current = new window.kakao.maps.Circle({
      center:         pos,
      radius:         250,
      strokeWeight:  7,                        
      strokeColor:    "#FFEDA1",
      shadow: "0px 25.5px 63.751px 0px rgba(0,0,0,0.30)",
      map,
    });

    // 내 위치 점
    userDotRef.current = new window.kakao.maps.CustomOverlay({
      position: pos,
      content:  `<div style="width:25px;height:25px;border-radius:20.617px;background:#ED7A13; border:2.577px solid white; box-shadow:0px 2px 8px rgba(0,0,0,0.3);"></div>`,
      map,
      yAnchor:  0.5,
      xAnchor:  0.5,
    });
  }, [locStatus, userCoords]);

  // ── 지도 마커 갱신: featured 장소만 표시
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map) return;

    // 기존 마커 제거
    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];

    if (recsState === "hidden" || locStatus !== "granted") return;

    // 겹치는 마커 분리: 20m(~0.00018°) 이내 좌표는 나선형으로 오프셋
    const SPREAD = 0.00018;
    const spiralOffsets = [
      [0, 0], [SPREAD, 0], [-SPREAD, 0],
      [0, SPREAD], [0, -SPREAD], [SPREAD, SPREAD], [-SPREAD, -SPREAD],
    ];
    const placed = [];

    console.log("[마커] featuredRecs:", featuredRecs.map(p => ({ id: p.id, name: p.name, lat: p.lat, lng: p.lng, category: p.category })));

    featuredRecs.filter(p => p.lat && p.lng).forEach(place => {
      let lat = place.lat;
      let lng = place.lng;
      let offsetIdx = 0;
      while (
        placed.some(p => Math.abs(p.lat - lat) < SPREAD * 0.9 && Math.abs(p.lng - lng) < SPREAD * 0.9) &&
        offsetIdx < spiralOffsets.length - 1
      ) {
        offsetIdx++;
        lat = place.lat + spiralOffsets[offsetIdx][0];
        lng = place.lng + spiralOffsets[offsetIdx][1];
      }
      placed.push({ lat, lng });

      const iconUrl = MARKER_ICON[place.category] || markerSip;
      const content = `
        <div
          onclick="window.__onMarkerClick && window.__onMarkerClick(${place.id})"
          style="
            width:40px;height:40px;
            background-image:url('${iconUrl}');
            background-size:contain;
            background-repeat:no-repeat;
            background-position:center;
            cursor:pointer;transition:transform 0.15s;
          "
          onmouseover="this.style.transform='scale(1.2)'"
          onmouseout="this.style.transform='scale(1)'"
        ></div>
      `;
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(lat, lng),
        content,
        map,
        yAnchor: 1,
      });
      overlaysRef.current.push(overlay);
    });
  }, [featuredRecs, recsState, locStatus, mapReady]);

  // ── 핸들러 ──
  const handleCategoryChange = (label) => {
    if (label === activeCategory) return;
    setActiveCategory(label);
    setSelectedPlace(null);
    setRecs(mapToRecs(allCategories, label));
  };

  const handleRecsHide = () => {
    if (recsState !== "visible") return;
    setRecsState("fading");
    setTimeout(() => setRecsState("hidden"), 280);
  };

  const handleRecsShow = () => {
    setRecsState("visible");
    setSelectedPlace(null);
  };

  // 현재 위치 보정
  const handleRecalibrate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocStatus("granted");
        setRecsState("visible");
        setSelectedPlace(null);
        loadRecommendations(coords.lat, coords.lng)
          .then((data) => {
            setAllCategories(data.categories);
            setRecs(mapToRecs(data.categories, activeCategory));
            setFeaturedRecs(mapToFeatured(data.categories, "전체"));
          })
          .catch(console.error);
      },
      () => {}
    );
  };

  const granted      = locStatus === "granted";
  const showOverlay  = granted && recsState !== "hidden";
  const overlayFading = recsState === "fading";


  return (
    <div
      className="bg-[#faf6f0] text-[#2c2417] overflow-hidden"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      <style>{`
        @keyframes fadeOutDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-out { animation: fadeOutDown 0.28s ease forwards; }
        .fade-in  { animation: fadeInUp   0.28s ease forwards; }

        .kakao-map-wrap,
        .kakao-map-wrap canvas,
        .kakao-map-wrap img {
          will-change: transform;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .kakao-map-wrap img {
          image-rendering: -webkit-optimize-contrast;
        }
      `}</style>

      {/* ── 메인 ── */}
      <main className="absolute w-[1920px] h-[1275px] ">

        {/* ── 카카오맵 컨테이너 (항상 렌더링 → 초기화 가능) ── */}
        <div className="absolute w-[1920px] h-[1155px] top-0 left-0">           
          <div
            ref={mapContainerRef}
            className="w-full h-[1155px] kakao-map-wrap"
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          />
        </div>

        {/* ── 사이드바 ── */}
        <Sidebar20
          locStatus={locStatus}
          recs={recs}
          activeCategory={activeCategory}
          recsState={recsState}
          selectedPlace={selectedPlace}
          sidebarOpen={sidebarOpen}
          onCategoryChange={handleCategoryChange}
          onPlaceSelect={setSelectedPlace}
          onSidebarToggle={() => setSidebarOpen(prev => !prev)}
          onRecalibrate={handleRecalibrate}
          onRecsHide={handleRecsHide}
          onRecsShow={handleRecsShow}
          onDestinationSelect={handleDestinationSelect}
          onDestinationClear={clearDestMarker}
          userCoords={userCoords}
          onDrawRoute={displayRoute}
        />

        {/* ── 장소 상세 카드 ──지도 클릭 시 사라짐 + 사이드바에서 장소 선택 시 나타남 */}  
        {selectedPlace && (
          <div className="absolute top-[50px] left-[400px] w-[240px] bg-white rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.15)] border border-[#f3f4f6] overflow-hidden z-20 fade-in">
            <div className="relative">
              <img src={imgPlace} alt={selectedPlace.name} className="w-full h-[100px] object-cover" />
            
              <span className="absolute top-2 left-2 bg-[#c8873a] text-white text-[7px] font-medium px-2 py-0.5 rounded-full">
                {selectedPlace.category}
              </span>
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-[12px] font-medium text-[#2c2417] leading-tight">{selectedPlace.name}</h3>
                <button onClick={e => e.stopPropagation()} className="ml-1 shrink-0">
                  <img src={iconHeart} alt="저장" className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[9.6px] font-light text-[#8b7e6a] mb-2">
                내 위치로부터 도보 {selectedPlace.walkMin}분
              </p>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-[8.4px] font-semibold ${selectedPlace.isOpen ? "text-[#2b8237]" : "text-[#c82b2b]"}`}>
                  {selectedPlace.isOpen ? "영업 중" : "영업 종료"}
                </span>
                {selectedPlace.isOpen && selectedPlace.closeTime && (
                  <span className="text-[8.4px] font-light text-[#8b7e6a]">{selectedPlace.closeTime}에 종료</span>
                )}
                {!selectedPlace.isOpen && selectedPlace.openTime && (
                  <span className="text-[8.4px] font-light text-[#8b7e6a]">{selectedPlace.openTime}에 시작</span>
                )}
              </div>
              <p className="text-[8.4px] font-light text-[#8b7e6a] leading-relaxed mb-2">
                {selectedPlace.desc}
              </p>
              <div className="flex gap-[3px] flex-wrap">
                {selectedPlace.tags.map(tag => (
                  <span key={tag} className="bg-[#f5f0e8] text-[#8b7e6a] text-[7px] font-normal px-[4px] py-[1.5px] rounded-[3px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        
      </main>
    </div>
  );
}
