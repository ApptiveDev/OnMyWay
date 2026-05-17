import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar20 from "./Sidebar_2.0";
import Loading20 from "./Loading_2.0";

// ── 에셋 (헤더 + 장소 상세 카드용) ──
import imgPlace  from "@/assets/img-place.jpg";
import iconDrink from "@/assets/icon-drink.svg";
import iconFood  from "@/assets/icon-food.svg";
import iconRest  from "@/assets/icon-rest.svg";
import iconShop  from "@/assets/icon-shop.svg";
import iconView  from "@/assets/icon-view.svg";
import iconHeart from "@/assets/icon-heart.svg";
import iconDestPin from "@/assets/icon-destination-pin.svg";

const CAT_ICON = {
  "한 잔": iconDrink,
  "한 입": iconFood,
  "한 숨": iconRest,
  "한 손": iconShop,
  "한 눈": iconView,
};

// 위치 미허용 시 기본 중심점: 부산대학교 정문
const PUSAN_UNIV = { lat: 35.2316, lng: 129.0839 };

// ── 목 데이터 풀 (절대 건드리지 않음) ──
const POOL = [
  { id: 1,  name: "온기 카페",     category: "한 잔", walkMin: 2,  isOpen: true,  closeTime: "22:00", openTime: "09:00", desc: "골목 안 작은 로스터리. 매일 아침 직접 볶은 원두.",  tags: ["#로스팅", "#조용한"] },
  { id: 2,  name: "달달 커피",     category: "한 잔", walkMin: 5,  isOpen: true,  closeTime: "21:00", openTime: "10:00", desc: "달콤한 디저트와 함께하는 감성 카페.",              tags: ["#디저트", "#달콤"] },
  { id: 3,  name: "새벽 커피",     category: "한 잔", walkMin: 7,  isOpen: false, closeTime: "18:00", openTime: "07:00", desc: "새벽부터 여는 핸드드립 전문 카페.",               tags: ["#핸드드립", "#새벽"] },
  { id: 4,  name: "파도 카페",     category: "한 잔", walkMin: 3,  isOpen: true,  closeTime: "20:00", openTime: "11:00", desc: "감성적인 분위기의 골목 카페.",                     tags: ["#감성", "#골목"] },
  { id: 5,  name: "숲속 티하우스", category: "한 잔", walkMin: 10, isOpen: true,  closeTime: "19:00", openTime: "10:00", desc: "다양한 차를 즐길 수 있는 조용한 공간.",            tags: ["#티하우스", "#여유"] },
  { id: 6,  name: "한입 식당",     category: "한 입", walkMin: 4,  isOpen: true,  closeTime: "21:00", openTime: "11:00", desc: "집밥처럼 따뜻한 한식.",                           tags: ["#한식", "#집밥"] },
  { id: 7,  name: "골목 분식",     category: "한 입", walkMin: 6,  isOpen: true,  closeTime: "20:00", openTime: "12:00", desc: "추억의 맛이 살아있는 분식집.",                     tags: ["#분식", "#추억"] },
  { id: 8,  name: "맛집 라면",     category: "한 입", walkMin: 8,  isOpen: false, closeTime: "22:00", openTime: "11:00", desc: "진한 사골 국물의 라면집.",                         tags: ["#라면", "#국물"] },
  { id: 9,  name: "야채 비빔밥",   category: "한 입", walkMin: 3,  isOpen: true,  closeTime: "19:00", openTime: "10:00", desc: "신선한 야채로 만든 건강 비빔밥.",                  tags: ["#비빔밥", "#건강"] },
  { id: 10, name: "밥집 온돌",     category: "한 입", walkMin: 5,  isOpen: true,  closeTime: "20:30", openTime: "11:30", desc: "정성스러운 한 끼 밥상.",                          tags: ["#정식", "#따뜻"] },
  { id: 11, name: "공원 벤치",     category: "한 숨", walkMin: 2,  isOpen: true,  closeTime: null,    openTime: null,    desc: "잠시 앉아 쉬어가는 작은 공원.",                   tags: ["#공원", "#산책"] },
  { id: 12, name: "골목 쉼터",     category: "한 숨", walkMin: 5,  isOpen: true,  closeTime: null,    openTime: null,    desc: "도심 속 조용한 휴식 공간.",                       tags: ["#쉼터", "#조용"] },
  { id: 13, name: "도서관 라운지", category: "한 숨", walkMin: 7,  isOpen: true,  closeTime: "22:00", openTime: "09:00", desc: "책과 함께 조용히 쉴 수 있는 라운지.",              tags: ["#도서관", "#독서"] },
  { id: 14, name: "동네 서점",     category: "한 손", walkMin: 4,  isOpen: true,  closeTime: "20:00", openTime: "10:00", desc: "동네 사람들이 사랑하는 독립서점.",                 tags: ["#서점", "#독립"] },
  { id: 15, name: "편집샵 모아",   category: "한 손", walkMin: 6,  isOpen: false, closeTime: "20:00", openTime: "11:00", desc: "감각적인 물건들이 모인 편집샵.",                   tags: ["#편집샵", "#감성"] },
  { id: 16, name: "핸드메이드 숍", category: "한 손", walkMin: 8,  isOpen: true,  closeTime: "19:00", openTime: "11:00", desc: "직접 만든 공예품과 소품 가게.",                    tags: ["#공예", "#핸드메이드"] },
  { id: 17, name: "전망대",        category: "한 눈", walkMin: 10, isOpen: true,  closeTime: null,    openTime: null,    desc: "동네 전경을 한눈에 볼 수 있는 전망대.",            tags: ["#전망", "#뷰"] },
  { id: 18, name: "벽화 골목",     category: "한 눈", walkMin: 3,  isOpen: true,  closeTime: null,    openTime: null,    desc: "예술가들의 작품이 가득한 벽화 골목.",              tags: ["#벽화", "#예술"] },
  { id: 19, name: "역사 골목",     category: "한 눈", walkMin: 6,  isOpen: true,  closeTime: null,    openTime: null,    desc: "옛 이야기가 담긴 역사 골목.",                      tags: ["#역사", "#문화"] },
];

function assignCoords(places, lat, lng) {
  return places.map(p => ({
    ...p,
    lat: lat + (Math.random() - 0.5) * 0.007,
    lng: lng + (Math.random() - 0.5) * 0.009,
  }));
}

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
}
function pickAll() {
  return [
    ...pickRandom(POOL.filter(p => p.category === "한 잔"), 2),
    ...pickRandom(POOL.filter(p => p.category === "한 입"), 2),
    ...pickRandom(POOL.filter(p => p.category === "한 숨"), 1),
    ...pickRandom(POOL.filter(p => p.category === "한 손"), 1),
    ...pickRandom(POOL.filter(p => p.category === "한 눈"), 1),
  ];
}
function pickCat(cat) {
  return pickRandom(POOL.filter(p => p.category === cat), 7);
}

function HoursLabel({ place }) {
  if (place.isOpen) {
    if (!place.closeTime) return <span className="text-[6.9px] font-light text-[#2b8237]">상시 개방</span>;
    return <span className="text-[6.9px] font-light text-[#2b8237]">영업 중 · {place.closeTime}에 종료</span>;
  }
  if (!place.openTime) return <span className="text-[6.9px] font-light text-[#c82b2b]">영업 종료</span>;
  return <span className="text-[6.9px] font-light text-[#c82b2b]">영업 종료 · {place.openTime}에 시작</span>;
}

export default function Onboard20() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [locStatus, setLocStatus]     = useState("pending");
  const [userCoords, setUserCoords]   = useState(null);
  const [recs, setRecs]               = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [recsState, setRecsState]     = useState("visible");
  const [isOffline, setIsOffline]     = useState(!navigator.onLine);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  useEffect(() => {
    window.__onMarkerClick = (id) => {
      const place = recsRef.current.find(p => p.id === id);
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
        setRecs(assignCoords(pickAll(), coords.lat, coords.lng));
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
      const center = new window.kakao.maps.LatLng(PUSAN_UNIV.lat, PUSAN_UNIV.lng);
      kakaoMapRef.current = new window.kakao.maps.Map(mapContainerRef.current, {
        center,
        level: 4,
      });
      window.kakao.maps.event.addListener(kakaoMapRef.current, "click", () => {
        setSidebarOpen(false);
      });
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
    circleRef.current = new window.kakao.maps.Circle({
      center: pos, radius: 500, strokeWeight: 2, strokeColor: "#c8873a", strokeOpacity: 0.5, fillColor: "#c8873a", fillOpacity: 0.08, map,
    });
    userDotRef.current = new window.kakao.maps.CustomOverlay({
      position: pos, content: `<div style="width:12px;height:12px;border-radius:50%;background:#c8873a;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`, map, yAnchor: 0.5, xAnchor: 0.5,
    });
  }, [locStatus, userCoords]);

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
  }, [recs, recsState, locStatus]);

  const handleCategoryChange = (label) => {
    if (label === activeCategory) return;
    setActiveCategory(label);
    setSelectedPlace(null);
    const base   = label === "전체" ? pickAll() : pickCat(label);
    const center = userCoords ?? PUSAN_UNIV;
    setRecs(assignCoords(base, center.lat, center.lng));
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
        setRecs(assignCoords(pickAll(), coords.lat, coords.lng));
        setRecsState("visible");
        setSelectedPlace(null);
      },
      () => {}
    );
  };

  const [mapReady, setMapReady] = useState(false);
  useEffect(() => {
    const check = setInterval(() => {
      if (kakaoMapRef.current) { setMapReady(true); clearInterval(check); }
    }, 200);
    return () => clearInterval(check);
  }, []);

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