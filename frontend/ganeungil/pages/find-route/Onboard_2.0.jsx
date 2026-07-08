import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import Sidebar20 from "./components/Sidebar_2.0";
import IconRail from "./components/IconRail";
import LocationPermissionModal from "./components/LocationPermissionModal";
import { useRoute } from "../../hooks/useRoute";

// ── 에셋 (헤더 + 장소 상세 카드용) ──
import LOGO_ICON  from "@/assets/header-logo.svg";
import iconSearch from "@/assets/header-search.svg";
import iconMenu   from "@/assets/header-menu.svg";
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
import iconArrive2 from "@/assets/iconArrive2.svg";

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

const NAV_ITEMS = [
  { label: "길찾기",  path: "/find-route" },
  { label: "둘러보기", path: "/explore"    },
  { label: "간직하기", path: "/discover"   },
];

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
  const { pathname } = useLocation();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [locStatus, setLocStatus]     = useState("pending"); // pending | granted | denied
  const [userCoords, setUserCoords]   = useState(null);      // { lat, lng }
  const [allCategories, setAllCategories] = useState([]);    // API 전체 응답
  const [recs, setRecs]               = useState([]);        // 사이드바: 전체 places
  const [featuredRecs, setFeaturedRecs] = useState([]);      // 지도 마커: featured만
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sidebarMode, setSidebarMode] = useState("route"); // route | search
  const [isOffline, setIsOffline]     = useState(!navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [pinMode, setPinMode] = useState(false);              // 지도에서 위치 지정 중인지
  const [pinCenter, setPinCenter] = useState(null);            // 현재 지도 중심 좌표 { lat, lng }
  const [pinNeighborhood, setPinNeighborhood] = useState("");  // 지도 중심의 역지오코딩 동네명

  // 카카오맵 관련 refs
  const mapContainerRef = useRef(null); // <div> DOM 노드
  const kakaoMapRef     = useRef(null); // kakao.maps.Map 인스턴스
  const circleRef       = useRef(null); // 500m 반경 Circle
  const userDotRef      = useRef(null); // 내 위치 CustomOverlay
  const overlaysRef     = useRef([]);   // 추천 마커 CustomOverlay[]
  const routeRecsOverlaysRef = useRef([]);  // 경로 추천 마커
  const recsRef         = useRef([]);   // recs 최신값 (window 콜백에서 참조)
  const featuredRef     = useRef([]);   // featuredRecs 최신값 (마커 클릭 콜백에서 참조)

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
      const content = `
        <div style="
          width:40px;height:40px;
          background-image:url('${iconArrive2}');
          background-size:contain;
          background-repeat:no-repeat;
          background-position:center;
          cursor:pointer;
        "></div>
      `;
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.lat, place.lng),
        content,
        map,
        yAnchor: 1,
      });
      routeRecsOverlaysRef.current.push(overlay);
    });
  };

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

    // 250m 반경 원 — 장소검색 탭에서만 표시 (길찾기 탭에서는 숨김)
    if (sidebarMode === "search") {
      circleRef.current = new window.kakao.maps.Circle({
        center:         pos,
        radius:         250,
        strokeWeight:  7,
        strokeColor:    "#FFEDA1",
        shadow: "0px 25.5px 63.751px 0px rgba(0,0,0,0.30)",
        map,
      });
    }

    // 내 위치 점
    userDotRef.current = new window.kakao.maps.CustomOverlay({
      position: pos,
      content:  `<div style="width:25px;height:25px;border-radius:20.617px;background:#ED7A13; border:2.577px solid white; box-shadow:0px 2px 8px rgba(0,0,0,0.3);"></div>`,
      map,
      yAnchor:  0.5,
      xAnchor:  0.5,
    });
  }, [locStatus, userCoords, sidebarMode]);

  // ── 지도 마커 갱신: featured 장소만 표시
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!map) return;

    // 기존 마커 제거
    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];

    if (sidebarMode !== "search" || locStatus !== "granted") return;

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
  }, [featuredRecs, sidebarMode, locStatus, mapReady]);

  // ── 지도에서 위치 지정 모드: 지도 중심이 바뀔 때마다 좌표/동네명 갱신
  useEffect(() => {
    const map = kakaoMapRef.current;
    if (!pinMode || !map) return;

    let debounceTimer;
    const geocodeCenter = () => {
      const center = map.getCenter();
      const lat = center.getLat();
      const lng = center.getLng();
      setPinCenter({ lat, lng });
      if (!window.kakao?.maps?.services?.Geocoder) return;
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.coord2RegionCode(lng, lat, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const region = result.find(r => r.region_type === "H") || result[0];
          if (region) setPinNeighborhood(`${region.region_3depth_name} 일대`);
        }
      });
    };

    geocodeCenter();
    const onCenterChanged = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(geocodeCenter, 400);
    };
    window.kakao.maps.event.addListener(map, "center_changed", onCenterChanged);

    return () => {
      clearTimeout(debounceTimer);
      window.kakao.maps.event.removeListener(map, "center_changed", onCenterChanged);
    };
  }, [pinMode]);

  const enterPinMode = () => setPinMode(true);
  const exitPinMode = () => {
    setPinMode(false);
    setPinCenter(null);
    setPinNeighborhood("");
  };

  // ── 핸들러 ──
  const handleCategoryChange = (label) => {
    if (label === activeCategory) return;
    setActiveCategory(label);
    setSelectedPlace(null);
    setRecs(mapToRecs(allCategories, label));
  };

  // 위치 권한 팝업에서 "현재 위치 허용" 클릭 시 (최초 1회 진입 게이트)
  const requestLocation = () => {
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
  };

  // 현재 위치 보정
  const handleRecalibrate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocStatus("granted");
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

  return (
    <div className="fixed inset-0 flex flex-col bg-[#faf6f0] text-[#2c2417]" style={{ fontFamily: "'Noto Serif KR', serif" }}>
      {/* ── 헤더 (전체 폭에 맞춰 flex로 배치) ── */}
      <header
        className="shrink-0 h-[72px] bg-[#FFFBEC] flex items-center px-[36px] gap-[30px]"
        style={{ boxShadow: "0px 1px 0px 0px rgba(62,39,34,0.06)" }}
      >
        <button onClick={() => navigate("/")} className="w-[140.625px] h-[25px] shrink-0">
          <img src={LOGO_ICON} alt="가는길" className="w-full h-full" />
        </button>

        <nav className="flex items-center gap-[30px] shrink-0">
          {NAV_ITEMS.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="pb-[8px] pt-px border-b-2"
                style={{
                  borderColor: active ? "#3e2722" : "transparent",
                  fontFamily:  active ? "Pretendard-Bold" : "Pretendard-Light",
                }}
              >
                <span className="text-[16px] text-[#3e2722] whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div
          className="flex items-center gap-[7px] px-[11px] py-[6px] rounded-[11px] shrink-0"
          style={{ background: isOffline ? "rgba(201,128,59,.14)" : "rgba(91,168,107,.12)" }}
          title="온라인/오프라인 상태"
        >
          <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: isOffline ? "#C9803B" : "#5BA86B" }} />
          <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: isOffline ? "#9a6a3a" : "#5a7d5f", fontFamily: "Pretendard" }}>
            {isOffline ? "오프라인" : "온라인"}
          </span>
        </div>

        <div className="flex items-center gap-[10px] shrink-0 ml-[26px]">
          <button
            onClick={() => navigate("/login")}
            className="text-[14px] text-[#858585]"
            style={{ fontFamily: "Pretendard-Light" }}
          >
            로그인
          </button>
          <div className="w-px h-[11px] bg-[#cfcac1]" />
          <button
            onClick={() => navigate("/signup")}
            className="text-[14px] text-[#858585]"
            style={{ fontFamily: "Pretendard-Light" }}
          >
            회원가입
          </button>
        </div>

        <button className="w-[20px] h-[18px] shrink-0 ml-[26px]">
          <img src={iconMenu} alt="메뉴" className="w-full h-full" />
        </button>
        <button className="w-[20px] h-[20px] shrink-0 ml-[16px]">
          <img src={iconSearch} alt="검색" className="w-full h-full" />
        </button>
      </header>

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
      <main className="relative w-full flex-1 min-h-0 flex">

        {/* ── 좌측 아이콘 레일 ── */}
        <IconRail
          mode={sidebarMode}
          onSelectRoute={() => setSidebarMode("route")}
          onSelectSearch={() => setSidebarMode("search")}
          onNavigateSaved={() => navigate("/discover")}
        />

        {/* ── 사이드바 ── */}
        <Sidebar20
          mode={sidebarMode}
          locStatus={locStatus}
          recs={recs}
          activeCategory={activeCategory}
          selectedPlace={selectedPlace}
          sidebarOpen={sidebarOpen}
          onCategoryChange={handleCategoryChange}
          onPlaceSelect={setSelectedPlace}
          onDestinationSelect={handleDestSelect}
          onDestinationClear={handleDestClear}
          userCoords={userCoords}
          onDrawRoute={displayRoute}
          onRouteRecs={handleRouteRecs}
          pinMode={pinMode}
          pinCenter={pinCenter}
          pinNeighborhood={pinNeighborhood}
          onEnterPinMode={enterPinMode}
          onExitPinMode={exitPinMode}
        />

        {/* ── 지도 영역 ── */}
        <div className="relative flex-1 h-full min-w-0 overflow-hidden bg-[#eae6dd]">

          {/* ── 카카오맵 컨테이너 (항상 렌더링 → 초기화 가능) ── */}
          <div
            ref={mapContainerRef}
            className="w-full h-full kakao-map-wrap"
            style={{ transform: "translateZ(0)", willChange: "transform" }}
          />

          {/* ── 현재 위치로 이동 버튼 ── */}
          <button
            onClick={handleRecalibrate}
            className="absolute right-[22px] bottom-[22px] w-[46px] h-[46px] rounded-full bg-white shadow-[0_4px_14px_rgba(62,39,34,0.2)] flex items-center justify-center z-10"
            title="현재 위치로 이동"
          >
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4.2" stroke="#ED7A13" strokeWidth="1.9" />
              <path d="M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2" stroke="#ED7A13" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </button>

          {/* ── 지도에서 위치 지정 모드: 중앙 고정 핀 + 안내 툴팁 ── */}
          {pinMode && (
            <>
              <div
                className="absolute top-[24px] left-1/2 -translate-x-1/2 bg-[#3e2722] text-white text-[13.5px] px-[16px] py-[11px] rounded-[20px] shadow-[0_4px_6px_rgba(62,39,34,0.25)] whitespace-nowrap z-10 pointer-events-none"
                style={{ fontFamily: "MaruBuriOTF" }}
              >
                지도를 움직여 도착지를 맞춰주세요
              </div>
              <div
                className="absolute left-1/2 top-1/2 flex flex-col items-center z-10 pointer-events-none"
                style={{ transform: "translate(-50%, calc(-100% + 4px))" }}
              >
                <div className="w-[40px] h-[40px] bg-[#ED7A13] rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[2px] shadow-[0_6px_7px_rgba(62,39,34,0.35)] rotate-45 flex items-center justify-center">
                  <div className="w-[10px] h-[10px] bg-white rounded-full -rotate-45" />
                </div>
                <div className="w-[14px] h-[5px] bg-[rgba(62,39,34,0.25)] rounded-full -mt-[2px]" />
              </div>
            </>
          )}

          {/* ── 위치 권한 동의 팝업 (최초 진입, 권한 결정 전) ── */}
          {locStatus === "pending" && (
            <LocationPermissionModal
              onAllow={requestLocation}
              onManual={() => setLocStatus("denied")}
            />
          )}

          {/* ── 장소 상세 카드 ──지도 클릭 시 사라짐 + 사이드바에서 장소 선택 시 나타남 */}
          {selectedPlace && (
            <div className="absolute top-[20px] left-[20px] w-[240px] bg-white rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.15)] border border-[#f3f4f6] overflow-hidden z-20 fade-in">
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

        </div>
      </main>
    </div>
  );
}
