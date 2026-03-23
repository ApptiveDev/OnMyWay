import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── 에셋 ──
const imgMap0  = "https://www.figma.com/api/mcp/asset/55c07589-9dc5-495f-92db-be43e616da40";
const imgMap1  = "https://www.figma.com/api/mcp/asset/899abe8b-6a24-4b10-b1f4-ced3b7f5fbc2";
const imgMap2  = "https://www.figma.com/api/mcp/asset/670d5267-5a6f-4d0a-a622-67a6ffadd7aa";
const imgMap3  = "https://www.figma.com/api/mcp/asset/e899416e-a8d9-4f8c-81ff-3f2c95ed4644";
const imgMap4  = "https://www.figma.com/api/mcp/asset/c565118e-2b94-4871-a9be-0fba75ff85f0";
const imgMap5  = "https://www.figma.com/api/mcp/asset/d16d6f24-24d6-4a33-8f80-d30ccebfb693";
const imgMap6  = "https://www.figma.com/api/mcp/asset/8c55fd35-96bc-4759-b8da-e64bbb556028";
const imgMap7  = "https://www.figma.com/api/mcp/asset/f6be4a03-aac5-4027-b0bd-b9c2eef5116c";
const imgPlace = "https://www.figma.com/api/mcp/asset/b0302e9a-ef09-4fcf-bad7-d3d34952de1f";

const iconGPS    = "https://www.figma.com/api/mcp/asset/860ffbc8-1f74-4b18-b735-b053f6309dfc";
const iconArrow  = "https://www.figma.com/api/mcp/asset/9f8f86b9-73bd-43e2-96b1-7ce770a7e380";
const iconSearch = "https://www.figma.com/api/mcp/asset/ef140e3e-cb9c-4f0d-a6d6-0b9c536179b1";
const iconAll    = "https://www.figma.com/api/mcp/asset/0fe1c29b-9364-4bd0-b1a4-32e26ffc7b80";
const iconDrink  = "https://www.figma.com/api/mcp/asset/158e9de0-6b6b-4103-822b-6b7d1ca007e7";
const iconFood   = "https://www.figma.com/api/mcp/asset/b2902803-559d-43fa-aab2-ff71ce0a5d0b";
const iconRest   = "https://www.figma.com/api/mcp/asset/9131ad09-7a1b-4f90-889e-91cacc708072";
const iconShop   = "https://www.figma.com/api/mcp/asset/fabff748-08ef-40e4-94aa-e37533f1fab9";
const iconView   = "https://www.figma.com/api/mcp/asset/fe88fdb5-7a58-444f-9539-394344d9373d";
const iconHeart  = "https://www.figma.com/api/mcp/asset/9a3454bd-1607-429a-b2be-1d462683a222";
const iconLogin  = "https://www.figma.com/api/mcp/asset/348992db-4fea-4d1d-9033-05a3f42ab59e";
const iconMenu   = "https://www.figma.com/api/mcp/asset/5c2a55f2-e5df-4c85-84c9-de1417c24003";

const CAT_ICON = {
  "한 잔": iconDrink,
  "한 입": iconFood,
  "한 숨": iconRest,
  "한 손": iconShop,
  "한 눈": iconView,
};

const CATEGORIES = [
  { label: "전체", icon: iconAll },
  { label: "한 잔", icon: iconDrink },
  { label: "한 입", icon: iconFood },
  { label: "한 숨", icon: iconRest },
  { label: "한 손", icon: iconShop },
  { label: "한 눈", icon: iconView },
];

const POOL = [
  { id: 1,  name: "온기 카페",       category: "한 잔", walkMin: 2,  isOpen: true,  closeTime: "22:00", openTime: "09:00", desc: "골목 안 작은 로스터리. 매일 아침 직접 볶은 원두.",     tags: ["#로스팅", "#조용한"] },
  { id: 2,  name: "달달 커피",       category: "한 잔", walkMin: 5,  isOpen: true,  closeTime: "21:00", openTime: "10:00", desc: "달콤한 디저트와 함께하는 감성 카페.",               tags: ["#디저트", "#달콤"] },
  { id: 3,  name: "새벽 커피",       category: "한 잔", walkMin: 7,  isOpen: false, closeTime: "18:00", openTime: "07:00", desc: "새벽부터 여는 핸드드립 전문 카페.",                  tags: ["#핸드드립", "#새벽"] },
  { id: 4,  name: "파도 카페",       category: "한 잔", walkMin: 3,  isOpen: true,  closeTime: "20:00", openTime: "11:00", desc: "감성적인 분위기의 골목 카페.",                      tags: ["#감성", "#골목"] },
  { id: 5,  name: "숲속 티하우스",   category: "한 잔", walkMin: 10, isOpen: true,  closeTime: "19:00", openTime: "10:00", desc: "다양한 차를 즐길 수 있는 조용한 공간.",              tags: ["#티하우스", "#여유"] },
  { id: 6,  name: "한입 식당",       category: "한 입", walkMin: 4,  isOpen: true,  closeTime: "21:00", openTime: "11:00", desc: "집밥처럼 따뜻한 한식.",                            tags: ["#한식", "#집밥"] },
  { id: 7,  name: "골목 분식",       category: "한 입", walkMin: 6,  isOpen: true,  closeTime: "20:00", openTime: "12:00", desc: "추억의 맛이 살아있는 분식집.",                      tags: ["#분식", "#추억"] },
  { id: 8,  name: "맛집 라면",       category: "한 입", walkMin: 8,  isOpen: false, closeTime: "22:00", openTime: "11:00", desc: "진한 사골 국물의 라면집.",                          tags: ["#라면", "#국물"] },
  { id: 9,  name: "야채 비빔밥",     category: "한 입", walkMin: 3,  isOpen: true,  closeTime: "19:00", openTime: "10:00", desc: "신선한 야채로 만든 건강 비빔밥.",                   tags: ["#비빔밥", "#건강"] },
  { id: 10, name: "밥집 온돌",       category: "한 입", walkMin: 5,  isOpen: true,  closeTime: "20:30", openTime: "11:30", desc: "정성스러운 한 끼 밥상.",                           tags: ["#정식", "#따뜻"] },
  { id: 11, name: "공원 벤치",       category: "한 숨", walkMin: 2,  isOpen: true,  closeTime: null,    openTime: null,    desc: "잠시 앉아 쉬어가는 작은 공원.",                    tags: ["#공원", "#산책"] },
  { id: 12, name: "골목 쉼터",       category: "한 숨", walkMin: 5,  isOpen: true,  closeTime: null,    openTime: null,    desc: "도심 속 조용한 휴식 공간.",                        tags: ["#쉼터", "#조용"] },
  { id: 13, name: "도서관 라운지",   category: "한 숨", walkMin: 7,  isOpen: true,  closeTime: "22:00", openTime: "09:00", desc: "책과 함께 조용히 쉴 수 있는 라운지.",               tags: ["#도서관", "#독서"] },
  { id: 14, name: "동네 서점",       category: "한 손", walkMin: 4,  isOpen: true,  closeTime: "20:00", openTime: "10:00", desc: "동네 사람들이 사랑하는 독립서점.",                  tags: ["#서점", "#독립"] },
  { id: 15, name: "편집샵 모아",     category: "한 손", walkMin: 6,  isOpen: false, closeTime: "20:00", openTime: "11:00", desc: "감각적인 물건들이 모인 편집샵.",                    tags: ["#편집샵", "#감성"] },
  { id: 16, name: "핸드메이드 숍",   category: "한 손", walkMin: 8,  isOpen: true,  closeTime: "19:00", openTime: "11:00", desc: "직접 만든 공예품과 소품 가게.",                     tags: ["#공예", "#핸드메이드"] },
  { id: 17, name: "전망대",          category: "한 눈", walkMin: 10, isOpen: true,  closeTime: null,    openTime: null,    desc: "동네 전경을 한눈에 볼 수 있는 전망대.",             tags: ["#전망", "#뷰"] },
  { id: 18, name: "벽화 골목",       category: "한 눈", walkMin: 3,  isOpen: true,  closeTime: null,    openTime: null,    desc: "예술가들의 작품이 가득한 벽화 골목.",               tags: ["#벽화", "#예술"] },
  { id: 19, name: "역사 골목",       category: "한 눈", walkMin: 6,  isOpen: true,  closeTime: null,    openTime: null,    desc: "옛 이야기가 담긴 역사 골목.",                       tags: ["#역사", "#문화"] },
];

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

// 지도 위 마커 위치 (사이드 패널 오른쪽 영역)
const MARKER_POS = [
  { top: "20%", left: "56%" },
  { top: "36%", left: "68%" },
  { top: "26%", left: "76%" },
  { top: "50%", left: "61%" },
  { top: "44%", left: "82%" },
  { top: "16%", left: "73%" },
  { top: "60%", left: "71%" },
];

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
  // pending | granted | denied
  const [locStatus, setLocStatus] = useState("pending");
  const [recs, setRecs] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  // visible | fading | hidden
  const [recsState, setRecsState] = useState("visible");
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  // 위치 권한 요청 (네이티브 UI)
  useEffect(() => {
    if (!navigator.geolocation) { setLocStatus("denied"); return; }
    navigator.geolocation.getCurrentPosition(
      () => { setLocStatus("granted"); setRecs(pickAll()); },
      () => { setLocStatus("denied"); }
    );
  }, []);

  // 네트워크 상태 감지
  useEffect(() => {
    const onOnline  = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online",  onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online",  onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const handleCategoryChange = (label) => {
    if (label === activeCategory) return;
    setActiveCategory(label);
    setSelectedPlace(null);
    setRecs(label === "전체" ? pickAll() : pickCat(label));
  };

  // 검색 컨테이너 클릭 → 추천 목록·범위·마커 페이드아웃
  const handleSearchClick = () => {
    if (recsState !== "visible") return;
    setRecsState("fading");
    setTimeout(() => setRecsState("hidden"), 280);
  };

  // 현재 위치 보정
  const handleRecalibrate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => { setLocStatus("granted"); setRecs(pickAll()); setRecsState("visible"); setSelectedPlace(null); },
      () => {}
    );
  };

  const granted        = locStatus === "granted";
  const showOverlay    = granted && recsState !== "hidden";
  const overlayFading  = recsState === "fading";

  return (
    <div
      className="min-h-screen bg-[#faf6f0] text-[#2c2417] overflow-hidden"
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
      `}</style>

      {/* ── 네비게이션 바 ── */}
      <header className="sticky top-0 z-50 bg-[rgba(250,246,240,0.8)] backdrop-blur-sm border-b border-[rgba(44,36,23,0.06)]">
        <div className="max-w-[1101px] mx-auto px-10 h-14 flex items-center justify-between">
          <a href="#" className="text-[#c8873a] font-semibold text-[19.2px] tracking-[1.92px]">
            가는길
          </a>

          {/* 길찾기 탭 강조 (2.0 진입 시 기본값) */}
          <nav className="flex items-center gap-1">
            <a href="#" className="px-4 py-2 rounded-full bg-[rgba(200,135,58,0.1)] text-[#c8873a] text-sm font-medium">
              길찾기
            </a>
            <a href="#" className="px-4 py-2 rounded-full text-[#8b7e6a] text-sm hover:text-[#2c2417] transition-colors">
              둘러보기
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[#8b7e6a] text-[13.6px] hover:text-[#2c2417] transition-colors"
            >
              <img src={iconLogin} alt="" className="w-[15px] h-[15px]" />
              로그인
            </button>
            <button className="w-10 h-10 rounded-full bg-[rgba(240,232,218,0.5)] flex items-center justify-center hover:bg-[rgba(240,232,218,0.8)] transition-colors">
              <img src={iconMenu} alt="메뉴" className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── 메인 ── */}
      <main className="relative h-[calc(100vh-56px)] overflow-hidden">

        {/* ── 지도 배경 ── */}
        <div className="absolute inset-0">
          <div className="grid h-full grid-cols-4 gap-0">
            {[imgMap6, imgMap0, imgMap1, imgMap7,
              imgMap2, imgMap3, imgMap4, imgMap5].map((src, i) => (
              <img key={i} src={src} alt="" className="object-cover w-full h-full pointer-events-none" />
            ))}
          </div>

          {/* 500m 반경 표시 (위치 허용 + 추천 표시 중) */}
          {showOverlay && (
            <div
              className={`absolute top-[38%] left-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none ${overlayFading ? "fade-out" : ""}`}
            >
              <div className="relative w-[160px] h-[160px] bg-[rgba(200,135,58,0.08)] border-2 border-[rgba(200,135,58,0.35)] rounded-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#c8873a] border-2 border-white shadow" />
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] text-[rgba(200,135,58,0.7)] font-light whitespace-nowrap">
                  500m
                </span>
              </div>
            </div>
          )}

          {/* 내 위치 비활성화 (위치 거부 시) */}
          {locStatus === "denied" && (
            <div className="absolute top-[38%] left-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-[rgba(139,126,106,0.3)] border-2 border-[rgba(139,126,106,0.5)]" />
            </div>
          )}

          {/* 지도 마커 (카테고리별 아이콘) */}
          {showOverlay && recs.map((place, i) => (
            <button
              key={place.id}
              style={{
                top: MARKER_POS[i % 7].top,
                left: MARKER_POS[i % 7].left,
                animation: overlayFading ? `fadeOutDown 0.28s ease forwards ${i * 0.025}s` : undefined,
              }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              onClick={() => setSelectedPlace(selectedPlace?.id === place.id ? null : place)}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md transition-all duration-150 ${
                selectedPlace?.id === place.id
                  ? "bg-[#2c2417] scale-110"
                  : "bg-[#c8873a] hover:scale-110"
              }`}>
                <img src={CAT_ICON[place.category]} alt="" className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}

          {/* 현재 위치 보정 버튼 (좌측 컨테이너 바로 옆 상단) */}
          <button
            onClick={handleRecalibrate}
            className="absolute top-[10px] left-[320px] w-8 h-8 bg-white rounded-full border border-[#f3f4f6] shadow flex items-center justify-center hover:shadow-md transition-shadow z-20"
            title="현재 위치 보정"
          >
            <img src={iconGPS} alt="위치 보정" className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── 사이드 패널 ── */}
        <aside className="absolute top-[10px] left-4 w-[301px] h-[694px] bg-white border border-[#f3f4f6] rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col z-10">

          {/* 출발지 */}
          <div className="px-4 pt-4 pb-0 shrink-0">
            <button
              className="w-full flex items-center gap-3 bg-[rgba(245,240,232,0.6)] px-3 py-3 rounded-[14px] text-left"
              onClick={handleSearchClick}
            >
              <img
                src={iconGPS}
                alt=""
                className={`w-[15px] h-[15px] shrink-0 transition-opacity ${!granted ? "opacity-30" : ""}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11.2px] font-light text-[#8b7e6a] leading-tight">출발지</p>
                <p className={`text-[14px] leading-tight mt-0.5 truncate ${
                  granted ? "font-medium text-[#c8873a]" : "font-light text-[rgba(44,36,23,0.35)]"
                }`}>
                  {granted ? "현재 위치" : locStatus === "pending" ? "위치 확인 중…" : "위치 정보 없음"}
                </p>
              </div>
              <img src={iconArrow} alt="" className="w-[14px] h-[14px] shrink-0" />
            </button>

            <div className="flex items-center gap-3 px-3 my-3">
              <div className="flex-1 h-px bg-[#f3f4f6]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[rgba(200,135,58,0.3)]" />
              <div className="flex-1 h-px bg-[#f3f4f6]" />
            </div>
          </div>

          {/* 목적지 검색 */}
          <div className="relative px-4 pb-3 shrink-0">
            <div
              className="bg-[#f5f0e8] px-[44px] py-[14px] rounded-[14px] cursor-pointer"
              onClick={handleSearchClick}
            >
              <p className="text-[15.2px] font-normal text-[rgba(139,126,106,0.5)] leading-normal">
                어디로 가시나요?
              </p>
            </div>
            <img
              src={iconSearch}
              alt=""
              className="absolute left-[30px] top-1/2 -translate-y-1/2 w-[17px] h-[17px] pointer-events-none"
            />
            {/* 검색 포커스 상태일 때 취소 버튼 */}
            {granted && recsState === "hidden" && (
              <button
                onClick={() => { setRecsState("visible"); setSelectedPlace(null); }}
                className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[10px] text-[#8b7e6a] hover:text-[#2c2417] transition-colors"
              >
                취소
              </button>
            )}
          </div>

          {/* ── 추천 섹션 (위치 허용 시) ── */}
          {granted && showOverlay && (
            <div
              className={`flex flex-col flex-1 overflow-hidden ${overlayFading ? "fade-out" : "fade-in"}`}
            >
              <div className="px-4 pt-1 shrink-0">
                <p className="text-[8.9px] font-light text-[#2c2417]">
                  가는길에{" "}
                  <span className="font-medium text-[#c8873a]">잠시 들러보세요</span>
                </p>
              </div>

              {/* 카테고리 필터 (하나만 활성화) */}
              <div className="px-[22px] pt-2 pb-2 flex items-center gap-[2px] shrink-0">
                {CATEGORIES.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => handleCategoryChange(label)}
                    className={`flex items-center gap-[4px] px-[8px] py-[5px] rounded-full text-[6.6px] font-medium transition-colors whitespace-nowrap ${
                      activeCategory === label
                        ? "bg-[#c8873a] text-white shadow-sm"
                        : "bg-white border border-[rgba(44,36,23,0.1)] text-[#8b7e6a] hover:bg-[#faf6f0]"
                    }`}
                  >
                    <img src={icon} alt="" className="w-[7.8px] h-[7.8px]" />
                    {label}
                  </button>
                ))}
              </div>

              {/* 장소 목록 */}
              <div className="flex-1 overflow-y-auto px-[14px] pb-3 flex flex-col gap-2">
                {recs.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(selectedPlace?.id === place.id ? null : place)}
                    className={`flex gap-[7.4px] items-start border rounded-[9.9px] p-[8px] cursor-pointer transition-all ${
                      selectedPlace?.id === place.id
                        ? "bg-[rgba(200,135,58,0.05)] border-[rgba(200,135,58,0.3)] shadow-sm"
                        : "bg-white border-[#f3f4f6] hover:shadow-sm"
                    }`}
                  >
                    <div className="w-[39.5px] h-[39.5px] rounded-[8.6px] overflow-hidden shrink-0">
                      <img src={imgPlace} alt={place.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="text-[8.7px] font-medium text-[#2c2417] leading-tight truncate">
                            {place.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                            <span className="text-[6.9px] font-light text-[#8b7e6a]">{place.category}</span>
                            <span className="text-[9.9px] text-[rgba(139,126,106,0.3)] leading-none">·</span>
                            <span className="text-[6.9px] font-light text-[#8b7e6a]">도보 {place.walkMin}분</span>
                            <span className="text-[9.9px] text-[rgba(139,126,106,0.3)] leading-none">·</span>
                            <HoursLabel place={place} />
                          </div>
                        </div>
                        <button
                          className="shrink-0 ml-1 w-[17px] h-[17px] flex items-center justify-center"
                          onClick={e => e.stopPropagation()}
                        >
                          <img src={iconHeart} alt="저장" className="w-[8.6px] h-[8.6px]" />
                        </button>
                      </div>
                      <p className="text-[7.1px] font-light text-[#8b7e6a] mt-1 leading-relaxed line-clamp-1">
                        {place.desc}
                      </p>
                      <div className="flex gap-[2.5px] mt-1.5">
                        {place.tags.map(tag => (
                          <span key={tag} className="bg-[#f5f0e8] text-[#8b7e6a] text-[6.1px] font-normal px-[3.7px] py-[1.2px] rounded-[2.5px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 위치 거부 상태 */}
          {locStatus === "denied" && (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[rgba(139,126,106,0.08)] flex items-center justify-center">
                <img src={iconGPS} alt="" className="w-4 h-4 opacity-30" />
              </div>
              <p className="text-[11.2px] font-light text-[#8b7e6a] leading-relaxed">
                위치 정보를 허용하면<br />주변 추천 장소를 볼 수 있어요
              </p>
              <button
                onClick={handleRecalibrate}
                className="text-[10.8px] text-[#c8873a] border border-[rgba(200,135,58,0.3)] px-4 py-1.5 rounded-full hover:bg-[rgba(200,135,58,0.05)] transition-colors"
              >
                위치 허용하기
              </button>
            </div>
          )}
        </aside>

        {/* ── 장소 상세 카드 ── */}
        {selectedPlace && (
          <div className="absolute top-[10px] left-[322px] w-[240px] bg-white rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.15)] border border-[#f3f4f6] overflow-hidden z-20 fade-in">
            {/* 사진 */}
            <div className="relative">
              <img src={imgPlace} alt={selectedPlace.name} className="w-full h-[100px] object-cover" />
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-2 right-2 w-5 h-5 bg-[rgba(0,0,0,0.45)] rounded-full flex items-center justify-center text-white text-[9px] hover:bg-[rgba(0,0,0,0.65)] transition-colors"
              >
                ✕
              </button>
              <span className="absolute top-2 left-2 bg-[#c8873a] text-white text-[7px] font-medium px-2 py-0.5 rounded-full">
                {selectedPlace.category}
              </span>
            </div>

            <div className="p-3">
              {/* 이름 + 하트 */}
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-[12px] font-medium text-[#2c2417] leading-tight">{selectedPlace.name}</h3>
                <button onClick={e => e.stopPropagation()} className="ml-1 shrink-0">
                  <img src={iconHeart} alt="저장" className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 도보 거리 */}
              <p className="text-[9.6px] font-light text-[#8b7e6a] mb-2">
                내 위치로부터 도보 {selectedPlace.walkMin}분
              </p>

              {/* 영업 상태 */}
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

              {/* 한줄 소개 */}
              <p className="text-[8.4px] font-light text-[#8b7e6a] leading-relaxed mb-2">
                {selectedPlace.desc}
              </p>

              {/* 태그 */}
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

        {/* ── 인터넷 불안정 오류 ── */}
        {isOffline && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#2c2417] text-white text-[11.2px] font-light px-4 py-2.5 rounded-full shadow-lg z-30 flex items-center gap-2 whitespace-nowrap">
            <span>⚠</span>
            <span>인터넷 연결이 불안정합니다</span>
          </div>
        )}
      </main>
    </div>
  );
}
