import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Sidebar20 from "./Sidebar_2.0";

// ── 에셋 (헤더 + 장소 상세 카드용) ──
import imgPlace  from "@/assets/img-place.jpg";
import iconDrink from "@/assets/icon-drink.svg";
import iconFood  from "@/assets/icon-food.svg";
import iconRest  from "@/assets/icon-rest.svg";
import iconShop  from "@/assets/icon-shop.svg";
import iconView  from "@/assets/icon-view.svg";
import iconHeart from "@/assets/icon-heart.svg";
import iconDestPin from "@/assets/icon-destination-pin.svg";

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
  const [recsState, setRecsState]     = useState("visible");
  const [isOffline, setIsOffline]     = useState(!navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const mapContainerRef = useRef(null);
  const kakaoMapRef     = useRef(null);
  const circleRef       = useRef(null);
  const userDotRef      = useRef(null);
  const overlaysRef     = useRef([]);
  const recsRef         = useRef([]);
  const destMarkerRef   = useRef(null);
  const polylineRef     = useRef(null);
  const routeMarkersRef = useRef([]);

  useEffect(() => { recsRef.current = recs; }, [recs]);
  useEffect(() => { featuredRef.current = featuredRecs; }, [featuredRecs]);

  useEffect(() => {
    window.__onMarkerClick = (id) => {
      const place = featuredRef.current.find(p => p.id === id);
      if (!place) return;
      setSelectedPlace(prev => (prev?.id === id ? null : place));
    };
    return () => { delete window.__onMarkerClick; };
  }, []);

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

  useEffect(() => {
    const on  = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

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
        window.kakao.maps.event.addListener(kakaoMapRef.current, "click", () => {
          setSidebarOpen(false);
        });
        setMapReady(true);
        console.log("카카오맵 초기화 성공");
      } catch (e) {
        console.error("카카오맵 초기화 실패:", e);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map) return;
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
      strokeWeight:   2,
      strokeColor:    "#c8873a",
      strokeOpacity:  0.5,
      fillColor:      "#c8873a",
      fillOpacity:    0.08,
      map,
    });
    userDotRef.current = new window.kakao.maps.CustomOverlay({
      position: pos,
      content:  `<div style="width:15px;height:15px;border-radius:50%;background:#6A8042;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      map,
      yAnchor:  0.5,
      xAnchor:  0.5,
    });
  }, [locStatus, userCoords]);

  // ── 지도 마커 갱신: featured 장소만 표시
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map) return;
    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];
    if (recsState === "hidden" || locStatus !== "granted") return;
    recs.forEach(place => {
      const icon = CAT_ICON[place.category];
      const content = `
        <div onclick="window.__onMarkerClick && window.__onMarkerClick(${place.id})" style="width:28px;height:28px;border-radius:50%;background:#c8873a;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.15s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
          <img src="${icon}" style="width:13px;height:13px;pointer-events:none;" />
        </div>
      `;
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.lat, place.lng), content, map, yAnchor: 1,
      });
      overlaysRef.current.push(overlay);
    });
  }, [featuredRecs, recsState, locStatus, mapReady]);

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

  const clearDestMarker = () => {
    if (destMarkerRef.current) {
      destMarkerRef.current.setMap(null);
      destMarkerRef.current = null;
    }
  };

  const handleDestinationSelect = (place) => {
    const map = kakaoMapRef.current;
    if (!map) return;
    const pos = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
    map.setCenter(pos);
    map.setLevel(3);
    clearDestMarker();
    destMarkerRef.current = new window.kakao.maps.CustomOverlay({
      position: pos,
      content: `
        <div style="width:36px; height:36px; background:#e8c36a; border:3px solid white; border-radius:17px 17px 17px 4px; box-shadow:0px 2px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
          <img src="${iconDestPin}" style="width:15px;height:15px;display:block;" />
        </div>
      `,
      map, yAnchor: 1, xAnchor: 0,
    });
  };

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

  useEffect(() => {
    const check = setInterval(() => {
      if (kakaoMapRef.current) { setMapReady(true); clearInterval(check); }
    }, 200);
    return () => clearInterval(check);
  }, []);
  const granted      = locStatus === "granted";
  const showOverlay  = granted && recsState !== "hidden";
  const overlayFading = recsState === "fading";


  // ── 경로 시각화 로직 ──
  const createMarkerHTML = (type) => {
    let color = "#c8873a"; 
    let label = "";
    if (type === "SP") label = "출발";
    else if (type === "EP") label = "도착";
    else if (type.startsWith("PP")) { color = "#2b8237"; label = "경유"; }
    return `<div style="background:${color}; color:white; padding:4px 8px; border-radius:12px; font-size:10px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.2); margin-bottom:10px;">${label}</div>`;
  };

  const displayRoute = (features) => {
    const map = kakaoMapRef.current;
    if (!map || !features) return;
    if (polylineRef.current) polylineRef.current.setMap(null);
    routeMarkersRef.current.forEach(marker => marker.setMap(null));
    routeMarkersRef.current = [];

    const path = [];
    const newMarkers = [];
    features.forEach((feature) => {
      if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach(coord => {
          path.push(new window.kakao.maps.LatLng(coord[1], coord[0]));
        });
      }
      if (feature.geometry.type === "Point") {
        const { pointType } = feature.properties;
        const coords = feature.geometry.coordinates;
        const pos = new window.kakao.maps.LatLng(coords[1], coords[0]);
        if (pointType === "SP" || pointType === "EP" || pointType.startsWith("PP")) {
          const marker = new window.kakao.maps.CustomOverlay({ position: pos, content: createMarkerHTML(pointType), yAnchor: 1 });
          marker.setMap(map);
          newMarkers.push(marker);
        }
      }
    });

    const polyline = new window.kakao.maps.Polyline({ path, strokeWeight: 5, strokeColor: '#c8873a', strokeOpacity: 0.8 });
    polyline.setMap(map);
    polylineRef.current = polyline;
    routeMarkersRef.current = newMarkers;

    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(pos => bounds.extend(pos));
    map.setBounds(bounds);
  };

  return (
    <div className="bg-[#faf6f0] text-[#2c2417] overflow-hidden" style={{ fontFamily: "'Noto Serif KR', serif" }}>
      <style>{`
        @keyframes fadeOutDown { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(8px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-out { animation: fadeOutDown 0.28s ease forwards; }
        .fade-in  { animation: fadeInUp   0.28s ease forwards; }
        .kakao-map-wrap, .kakao-map-wrap canvas, .kakao-map-wrap img { will-change: transform; transform: translateZ(0); -webkit-backface-visibility: hidden; backface-visibility: hidden; }
        .kakao-map-wrap img { image-rendering: -webkit-optimize-contrast; }
      `}</style>

      <main className="relative h-[calc(100vh-56px)] overflow-hidden">
        <div className="absolute inset-0">
          <div ref={mapContainerRef} className="kakao-map-wrap w-full h-full" style={{ transform: "translateZ(0)", willChange: "transform" }} />
        </div>

        {!mapReady && <div className="absolute inset-0 z-30"><Loading20 /></div>}

        <Sidebar20
          locStatus={locStatus} recs={recs} activeCategory={activeCategory} recsState={recsState} selectedPlace={selectedPlace} sidebarOpen={sidebarOpen}
          onCategoryChange={handleCategoryChange} onPlaceSelect={setSelectedPlace} onSidebarToggle={() => setSidebarOpen(prev => !prev)}
          onRecalibrate={handleRecalibrate} onRecsHide={handleRecsHide} onRecsShow={handleRecsShow} onDestinationSelect={handleDestinationSelect}
          onDestinationClear={clearDestMarker} userCoords={userCoords} onDrawRoute={displayRoute}
        />

        {selectedPlace && (
          <div className="absolute top-[10px] left-[322px] w-[240px] bg-white rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.15)] border border-[#f3f4f6] overflow-hidden z-20 fade-in">
            <div className="relative">
              <img src={imgPlace} alt={selectedPlace.name} className="w-full h-[100px] object-cover" />
              <button onClick={() => setSelectedPlace(null)} className="absolute top-2 right-2 w-5 h-5 bg-[rgba(0,0,0,0.45)] rounded-full flex items-center justify-center text-white text-[9px] hover:bg-[rgba(0,0,0,0.65)] transition-colors">✕</button>
              <span className="absolute top-2 left-2 bg-[#c8873a] text-white text-[7px] font-medium px-2 py-0.5 rounded-full">{selectedPlace.category}</span>
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-[12px] font-medium text-[#2c2417] leading-tight">{selectedPlace.name}</h3>
                <button onClick={e => e.stopPropagation()} className="ml-1 shrink-0"><img src={iconHeart} alt="저장" className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-[9.6px] font-light text-[#8b7e6a] mb-2">내 위치로부터 도보 {selectedPlace.walkMin}분</p>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-[8.4px] font-semibold ${selectedPlace.isOpen ? "text-[#2b8237]" : "text-[#c82b2b]"}`}>{selectedPlace.isOpen ? "영업 중" : "영업 종료"}</span>
                {selectedPlace.isOpen && selectedPlace.closeTime && <span className="text-[8.4px] font-light text-[#8b7e6a]">{selectedPlace.closeTime}에 종료</span>}
                {!selectedPlace.isOpen && selectedPlace.openTime && <span className="text-[8.4px] font-light text-[#8b7e6a]">{selectedPlace.openTime}에 시작</span>}
              </div>
              <p className="text-[8.4px] font-light text-[#8b7e6a] leading-relaxed mb-2">{selectedPlace.desc}</p>
              <div className="flex gap-[3px] flex-wrap">{selectedPlace.tags.map(tag => (<span key={tag} className="bg-[#f5f0e8] text-[#8b7e6a] text-[7px] font-normal px-[4px] py-[1.5px] rounded-[3px]">{tag}</span>))}</div>
            </div>
          </div>
        )}

        {isOffline && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#2c2417] text-white text-[11.2px] font-light px-4 py-2.5 rounded-full shadow-lg z-30 flex items-center gap-2 whitespace-nowrap">
            <span>⚠</span><span>인터넷 연결이 불안정합니다</span>
          </div>
        )}
      </main>
    </div>
  );
}