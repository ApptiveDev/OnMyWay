import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import IconRail from "./IconRail";
import Sidebar20 from "./Sidebar_2.0";
import Loading20 from "./Loading_2.0";
import { useRoute } from "../../hooks/useRoute";
import { useRouteSearch } from "../../hooks/useRouteSearch";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { useToast } from "../../context/ToastContext";
import { CATEGORIES } from "./categoryIcons";

import markerSip   from "@/assets/map/iconsip.svg";
import markerBite  from "@/assets/map/iconbite.svg";
import markerFight from "@/assets/map/iconfight.svg";
import markerMeal  from "@/assets/map/iconmeal.svg";
import markerSee   from "@/assets/map/iconsee.svg";
import iconGPS     from "@/assets/icon-gps.svg";
import iconArrive2 from "@/assets/iconArrive2.svg?url";


const MARKER_ICON = {
  "한잔":  markerSip,
  "한입":  markerBite,
  "한판":  markerFight,
  "한끼":  markerMeal,
  "한눈":  markerSee,
};

const CATEGORY_LABEL_TO_ID = {
  "한 잔": 1,
  "한 입": 2,
  "한 숨": 3,
  "한 판": 4,
  "한 눈": 5,
  "한 끼": 6,
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

// 한숨(categoryId:3) 장소를 한눈(categoryId:5)으로 병합
function normalizeCategories(categories) {
  const hansoom = categories.find((c) => c.categoryId === 3);
  if (!hansoom) return categories;
  return categories
    .filter((c) => c.categoryId !== 3)
    .map((c) => {
      if (c.categoryId !== 5) return c;
      return {
        ...c,
        places: [
          ...(c.places ?? []).map((p) => ({ ...p, category: "한눈" })),
          ...(hansoom.places ?? []).map((p) => ({ ...p, category: "한눈" })),
        ],
      };
    });
}

// 각 카테고리에서 랜덤으로 1개씩 뽑기
function pickRandom(categories) {
  return categories
    .map((c) => {
      const places = c.places ?? [];
      if (!places.length) return null;
      return places[Math.floor(Math.random() * places.length)];
    })
    .filter(Boolean);
}

// 사이드바용: 카테고리 전체 places
function mapToRecs(categories, categoryLabel) {
  const targetId = CATEGORY_LABEL_TO_ID[categoryLabel];
  const raw = categories.find((c) => c.categoryId === targetId)?.places ?? [];
  return toPlaceList(raw.slice(0, 5));
}

// 지도 마커용: places 상위 5개
function mapToFeatured(categories, categoryLabel) {
  const targetId = CATEGORY_LABEL_TO_ID[categoryLabel];
  const c = categories.find((c) => c.categoryId === targetId);
  const raw = (c?.places ?? []).slice(0, 5);
  return toPlaceList(raw);
}

export default function Onboard20() {
  const navigate = useNavigate();
  const showToast = useToast();
  const isOnline = useOnlineStatus();

  const [activeCategory, setActiveCategory] = useState("전체");
  const [locStatus, setLocStatus]     = useState("pending"); // pending | granted | denied
  const [userCoords, setUserCoords]   = useState(null);      // { lat, lng }
  const [allCategories, setAllCategories] = useState([]);    // API 전체 응답
  const [randomPicks, setRandomPicks]   = useState([]);      // 전체 탭: 카테고리별 랜덤 1개
  const [recs, setRecs]               = useState([]);        // 장소검색: 전체 places
  const [featuredRecs, setFeaturedRecs] = useState([]);      // 지도 마커: featured만
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ── find-route 화면 구성 상태 (flow: 좌측 아이콘 레일 / step: directions 내부 단계) ──
  const [flow, setFlow] = useState("directions"); // directions | search | saved | recent
  const [step, setStep] = useState("input");      // input | searchDest | searchOrigin | routes | nearby | place | pin | edit
  const [placeFrom, setPlaceFrom] = useState("input"); // place 단계에서 뒤로가기로 돌아갈 step
  const [pinCoords, setPinCoords] = useState(null);
  const [pinLabel, setPinLabel]   = useState("");

  // 카카오맵 관련 refs
  const mapContainerRef = useRef(null); // <div> DOM 노드
  const kakaoMapRef     = useRef(null); // kakao.maps.Map 인스턴스
  const circleRef       = useRef(null); // 500m 반경 Circle
  const userDotRef      = useRef(null); // 내 위치 CustomOverlay
  const overlaysRef     = useRef([]);   // 추천 마커 CustomOverlay[]
  const featuredRef     = useRef([]);   // featuredRecs 최신값 (마커 클릭 콜백에서 참조)
  const routeRecsOverlaysRef = useRef([]);   // 경로 추천 마커

  const { handleDestinationSelect, clearDestMarker, clearRoute, displayRoute } = useRoute(kakaoMapRef);

  const handleDestSelect = (place) => {
    handleDestinationSelect(place);
    circleRef.current?.setMap(null);
  };

  const handleDestClear = () => {
    clearDestMarker();
    clearRoute();
    routeRecsOverlaysRef.current.forEach(o => o.setMap(null));
    routeRecsOverlaysRef.current = [];
    if (circleRef.current && kakaoMapRef.current) circleRef.current.setMap(kakaoMapRef.current);
  };

  const handleRouteRecs = (places) => {
    const map = kakaoMapRef.current;
    if (!map) return;
    routeRecsOverlaysRef.current.forEach(o => o.setMap(null));
    routeRecsOverlaysRef.current = [];
    places.filter(p => p.lat && p.lng).forEach(place => {
      const safeUrl = iconArrive2.startsWith('data:image/svg+xml')
        ? iconArrive2.replace(/#/g, '%23')
        : iconArrive2;
      const container = document.createElement('div');
      container.style.width = '40px';
      container.style.height = '40px';
      container.style.backgroundImage = `url("${safeUrl}")`;
      container.style.backgroundSize = 'contain';
      container.style.backgroundRepeat = 'no-repeat';
      container.style.backgroundPosition = 'center';
      container.style.cursor = 'pointer';
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.lat, place.lng),
        content: container,
        map,
        yAnchor: 1,
        zIndex: 3,
      });
      routeRecsOverlaysRef.current.push(overlay);
    });
  };

  // 지도 <div>는 이미 레일·사이드바 폭을 제외한 나머지 영역만 차지하므로,
  // 경로가 그 안에 꽉 차 보이도록 사방에 동일한 여백만 준다.
  const handleDrawRoute = (features, modeId) => {
    // 지도 컨테이너 크기를 카카오맵이 최신 상태로 인식하도록 맞춘 뒤 bounds를 계산한다.
    kakaoMapRef.current?.relayout();
    displayRoute(features, modeId, { top: 40, right: 40, bottom: 40, left: 40 });
  };

  const openPlace = (place, from) => {
    setSelectedPlace(place);
    setPlaceFrom(from);
    setStep("place");
  };

  const routeSearch = useRouteSearch({
    userCoords,
    onDestinationSelect: handleDestinationSelect,
    onDrawRoute: handleDrawRoute,
    onDestinationClear: clearDestMarker,
    onRouteLoadingChange: setIsLoadingRoute,
  });
  

  // ref 동기화
  useEffect(() => { featuredRef.current = featuredRecs; }, [featuredRecs]);

  // ── 지도 마커 클릭 핸들러 (window에 등록 → CustomOverlay HTML에서 호출)
  useEffect(() => {
    window.__onMarkerClick = (id) => {
      const place = featuredRef.current.find(p => p.id === id);
      if (!place) return;
      openPlace(place, "nearby");
    };
    return () => { delete window.__onMarkerClick; };
  }, []);

  // ── 위치 권한 요청 (네이티브 UI)
  useEffect(() => {
    const denied = () => {
      setLocStatus("denied");
      setUserCoords(PUSAN_UNIV);
      loadRecommendations(PUSAN_UNIV.lat, PUSAN_UNIV.lng)
        .then((data) => {
          const cats = normalizeCategories(data.categories);
          const picks = pickRandom(cats);
          setAllCategories(cats);
          setRandomPicks(picks);
          const pickList = toPlaceList(picks);
          setRecs(pickList);
          setFeaturedRecs(pickList);
          setIsInitialLoading(false);
        })
        .catch(console.error);
    };
    if (!navigator.geolocation) { denied(); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocStatus("granted");
        loadRecommendations(coords.lat, coords.lng)
          .then((data) => {
            const cats = normalizeCategories(data.categories);
            const picks = pickRandom(cats);
            setAllCategories(cats);
            setRandomPicks(picks);
            const pickList = toPlaceList(picks);
            setRecs(pickList);
            setFeaturedRecs(pickList);
            setIsInitialLoading(false);
          })
          .catch(console.error);
      },
      denied
    );
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
      } catch (e) {
        console.error("카카오맵 초기화 실패:", e);
      }
    };
    init();
  }, []);

  // ── 사이드바 열림/닫힘, 창 크기 변경 시 지도 relayout (폭이 바뀌므로 회색 타일 방지)
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map) return;
    const relayout = () => map.relayout();
    const t = setTimeout(relayout, 320); // 사이드바 width 트랜지션(300ms) 종료 후
    window.addEventListener("resize", relayout);
    return () => { clearTimeout(t); window.removeEventListener("resize", relayout); };
  }, [sidebarOpen, flow, mapReady]);

  // ── 위치 확정 시 지도 중심 이동 + 반경 원 + 내 위치 마커
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map) return;

    if (circleRef.current)  { circleRef.current.setMap(null);  circleRef.current = null; }
    if (userDotRef.current) { userDotRef.current.setMap(null); userDotRef.current = null; }

    if (!userCoords) return;

    const pos = new window.kakao.maps.LatLng(userCoords.lat, userCoords.lng);
    map.setCenter(pos);

    // 250m 반경 원 — 장소검색 흐름에서만 표시 (길찾기 흐름에서는 숨김)
    if (flow === "search") {
      circleRef.current = new window.kakao.maps.Circle({
        center:         pos,
        radius:         250,
        strokeWeight:  7,
        strokeColor:    "#FFEDA1",
        shadow: "0px 25.5px 63.751px 0px rgba(0,0,0,0.30)",
        map,
      });
    }

    userDotRef.current = new window.kakao.maps.CustomOverlay({
      position: pos,
      content:  `<div style="width:25px;height:25px;border-radius:20.617px;background:#ED7A13; border:2.577px solid white; box-shadow:0px 2px 8px rgba(0,0,0,0.3);"></div>`,
      map,
      yAnchor:  0.5,
      xAnchor:  0.5,
    });
  }, [locStatus, userCoords, flow]);

  // ── 지도 마커 갱신: '장소검색' 흐름에서만 featured 장소 표시
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map) return;

    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];

    if (flow !== "search" || !userCoords) return;

    const SPREAD = 0.00018;
    const spiralOffsets = [
      [0, 0],
      [SPREAD, 0], [-SPREAD, 0], [0, SPREAD], [0, -SPREAD],
      [SPREAD, SPREAD], [-SPREAD, -SPREAD], [SPREAD, -SPREAD], [-SPREAD, SPREAD],
      [SPREAD * 2, 0], [-SPREAD * 2, 0], [0, SPREAD * 2], [0, -SPREAD * 2],
    ];
    const placed = [];

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
      console.log(`[마커 생성 중] ID: ${place.id}, 최종 좌표: ${lat}, ${lng}`);

      const isSelected = step === "place" && selectedPlace?.id === place.id;

      const iconUrl = MARKER_ICON[place.category] || markerSip;
      const safeIconUrl = iconUrl.startsWith('data:image/svg+xml')
        ? iconUrl.replace(/#/g, '%23')
         : iconUrl;
      const container = document.createElement('div');
      container.style.width = '40px';
      container.style.height = '40px';
      container.style.backgroundImage = `url("${safeIconUrl}")`;
      container.style.backgroundSize = '160%';
      container.style.backgroundRepeat = 'no-repeat';
      container.style.backgroundPosition = 'center';
      container.style.cursor = 'pointer';
      container.style.transition = 'transform 0.15s';
      container.style.transform = isSelected ? 'scale(1.4)' : 'scale(1)';
      container.onmouseover = () => { container.style.transform = 'scale(1.4)'; };
      container.onmouseout = () => { container.style.transform = isSelected ? 'scale(1.4)' : 'scale(1)'; };
      container.onclick = () => {
        if (window.__onMarkerClick) {
      window.__onMarkerClick(place.id);
        }
      };
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(lat, lng),
        content: container,
        map,
        yAnchor: 1,
        zIndex: isSelected ? 4 : 3,
      });
      overlaysRef.current.push(overlay);
    });
  }, [featuredRecs, flow, locStatus, mapReady, userCoords, step, selectedPlace]);

  // ── 핀 지정 단계: 지도 중심 이동 시 역지오코딩으로 라벨 갱신
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map || step !== "pin") { setPinLabel(""); setPinCoords(null); return; }
    if (!window.kakao?.maps?.services) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const update = () => {
      const c = map.getCenter();
      const lat = c.getLat(), lng = c.getLng();
      setPinCoords({ lat, lng });
      geocoder.coord2Address(lng, lat, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result[0]) {
          const addr = result[0].road_address?.address_name || result[0].address?.address_name;
          setPinLabel(addr || "주소를 확인할 수 없어요");
        }
      });
    };
    update();
    window.kakao.maps.event.addListener(map, "center_changed", update);
    return () => window.kakao.maps.event.removeListener(map, "center_changed", update);
  }, [step]);

  // ── 핸들러 ──
  const handleCategoryChange = (label) => {
    if (label === activeCategory) return;
    setActiveCategory(label);
    if (label === "전체") {
      const pickList = toPlaceList(randomPicks);
      setRecs(pickList);
      setFeaturedRecs(pickList);
    } else {
      setRecs(mapToRecs(allCategories, label));
      setFeaturedRecs(mapToFeatured(allCategories, label));
    }
  };

  const handleFlowChange = (nextFlow) => {
    setFlow(nextFlow);
    setSelectedPlace(null);
    if (nextFlow === "directions") {
      setStep("input");
      // 장소검색에서 바꿔둔 카테고리 필터가 길찾기 추천 목록에 남지 않도록 초기화
      if (activeCategory !== "전체") handleCategoryChange("전체");
    }
  };

  // 현재 위치 보정
  const handleRecalibrate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocStatus("granted");
        loadRecommendations(coords.lat, coords.lng)
          .then((data) => {
            const cats = normalizeCategories(data.categories);
            const picks = pickRandom(cats);
            setAllCategories(cats);
            setRandomPicks(picks);
            const pickList = toPlaceList(picks);
            if (activeCategory === "전체") {
              setRecs(pickList);
              setFeaturedRecs(pickList);
            } else {
              setRecs(mapToRecs(data.categories, activeCategory));
              setFeaturedRecs(mapToFeatured(data.categories, activeCategory));
            }
            showToast("현재 위치로 이동했어요");
          })
          .catch(console.error);
      },
      () => {}
    );
  };

  const handleConfirmPin = () => {
    if (!pinCoords) return;
    routeSearch.selectManualDestination({ name: pinLabel || "지정한 위치", lat: pinCoords.lat, lng: pinCoords.lng });
    showToast("도착지를 지정했어요");
    setStep("routes");
  };

  return (
    <div
      className="w-full h-full bg-[#FFFBEC] text-[#2c2417] overflow-hidden flex"
      style={{ fontFamily: "Pretendard, system-ui, sans-serif" }}
    >
      <style>{`
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

      {/* ── 오프라인 배너 ── */}
      {!isOnline && (
        <div className="absolute left-0 right-0 top-0 h-[38px] bg-[#3E2722] flex items-center justify-center gap-[9px] z-30">
          <span className="text-[13px] text-[#FFF6D6]" style={{ fontFamily: "Pretendard-Medium" }}>오프라인 · 저장한 장소와 최근 기록은 계속 볼 수 있어요</span>
        </div>
      )}

      {/* ── 아이콘 레일 ── */}
      <IconRail
        flow={flow}
        onFlowChange={handleFlowChange}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(prev => !prev)}
      />

      {/* ── 사이드바 ── */}
      <div
        className="flex flex-col min-h-0 bg-[#FFFBEC] border-r border-[rgba(62,39,34,0.06)] z-[5] overflow-hidden transition-[width] duration-300 ease-out"
        style={{ width: sidebarOpen ? "min(420px, max(320px, 26vw))" : 0 }}
      >
        <Sidebar20
          flow={flow}
          step={step}
          setStep={setStep}
          placeFrom={placeFrom}
          locStatus={locStatus}
          recs={recs}
          selectedPlace={selectedPlace}
          onPlaceSelect={openPlace}
          onRecalibrate={handleRecalibrate}
          userCoords={userCoords}
          pinLabel={pinLabel}
          onConfirmPin={handleConfirmPin}
          {...routeSearch}
        />
      </div>

      {/* ── 지도 ── */}
      <main className="relative flex-1 min-w-0 overflow-hidden">
        <div className="absolute inset-0">
          <div
            ref={mapContainerRef}
            className="w-full h-full kakao-map-wrap"
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          />
        </div>

        {/* 장소검색 흐름: 카테고리 선택 바 (지도 상단) */}
        {flow === "search" && (
          <div className="absolute left-1/2 top-[18px] -translate-x-1/2 flex gap-[8px] max-w-[calc(100%-36px)] overflow-x-auto z-10 py-[2px]">
            {CATEGORIES.map(({ label, icon, iconActive }) => {
              const isActive = activeCategory === label;
              return (
                <button
                  key={label}
                  onClick={() => handleCategoryChange(label)}
                  className="shrink-0 group drop-shadow-[0_3px_8px_rgba(62,39,34,0.2)]"
                >
                  <img src={isActive ? iconActive : icon} alt={label} className={`w-[70.695px] h-[31.813px] ${!isActive ? "group-hover:hidden" : ""}`} />
                  {!isActive && <img src={iconActive} alt={label} className="w-[70.695px] h-[31.813px] hidden group-hover:block" />}
                </button>
              );
            })}
          </div>
        )}

        {/* 핀 지정 오버레이 (지도 중앙 고정 핀) */}
        {step === "pin" && (
          <>
            <div className="absolute left-1/2 top-[22px] -translate-x-1/2 bg-[#3E2722] text-white text-[13.5px] px-[16px] py-[9px] rounded-[20px] shadow-[0_4px_12px_rgba(62,39,34,0.25)] z-[6] whitespace-nowrap" style={{ fontFamily: "Pretendard" }}>
              지도를 움직여 도착지를 맞춰주세요
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center z-[6] pointer-events-none">
              <div className="w-[40px] h-[40px] rounded-[50%_50%_50%_2px] rotate-[-45deg] bg-[#ED7A13] shadow-[0_6px_14px_rgba(62,39,34,0.35)] flex items-center justify-center">
                <div className="rotate-45 w-[10px] h-[10px] rounded-full bg-white" />
              </div>
              <div className="w-[14px] h-[5px] rounded-[50%] bg-[rgba(62,39,34,0.25)] mt-[3px]" />
            </div>
          </>
        )}

        {/* 위치 보정 버튼 */}
        <button
          onClick={handleRecalibrate}
          title="현재 위치 보정"
          className="absolute right-[22px] bottom-[22px] w-[46px] h-[46px] rounded-full bg-white shadow-[0_4px_14px_rgba(62,39,34,0.2)] flex items-center justify-center cursor-pointer transition-transform active:scale-[0.92] hover:shadow-[0_6px_18px_rgba(62,39,34,0.28)] z-10"
        >
          <img src={iconGPS} alt="위치 보정" className="w-[22px] h-[22px]" />
        </button>

        {/* ── 로딩 오버레이 (초기 진입 or 경로 탐색 중) ── */}
        {(isInitialLoading || isLoadingRoute) && (
          <div className="absolute inset-0 z-30">
            <Loading20 />
          </div>
        )}
      </main>
    </div>
  );
}
