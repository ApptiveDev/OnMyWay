import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Figma 에셋 (유효기간 7일)
const imgMap0  = "https://www.figma.com/api/mcp/asset/55c07589-9dc5-495f-92db-be43e616da40";
const imgMap1  = "https://www.figma.com/api/mcp/asset/899abe8b-6a24-4b10-b1f4-ced3b7f5fbc2";
const imgMap2  = "https://www.figma.com/api/mcp/asset/670d5267-5a6f-4d0a-a622-67a6ffadd7aa";
const imgMap3  = "https://www.figma.com/api/mcp/asset/e899416e-a8d9-4f8c-81ff-3f2c95ed4644";
const imgMap4  = "https://www.figma.com/api/mcp/asset/c565118e-2b94-4871-a9be-0fba75ff85f0";
const imgMap5  = "https://www.figma.com/api/mcp/asset/d16d6f24-24d6-4a33-8f80-d30ccebfb693";
const imgMap6  = "https://www.figma.com/api/mcp/asset/8c55fd35-96bc-4759-b8da-e64bbb556028";
const imgMap7  = "https://www.figma.com/api/mcp/asset/f6be4a03-aac5-4027-b0bd-b9c2eef5116c";
const imgPlace = "https://www.figma.com/api/mcp/asset/b0302e9a-ef09-4fcf-bad7-d3d34952de1f";

const iconMarker     = "https://www.figma.com/api/mcp/asset/a12ffdb1-d0d8-46e0-93ad-6077a48fddb4";
const iconGPS        = "https://www.figma.com/api/mcp/asset/860ffbc8-1f74-4b18-b735-b053f6309dfc";
const iconArrow      = "https://www.figma.com/api/mcp/asset/9f8f86b9-73bd-43e2-96b1-7ce770a7e380";
const iconSearch     = "https://www.figma.com/api/mcp/asset/ef140e3e-cb9c-4f0d-a6d6-0b9c536179b1";
const iconAll        = "https://www.figma.com/api/mcp/asset/0fe1c29b-9364-4bd0-b1a4-32e26ffc7b80";
const iconDrink      = "https://www.figma.com/api/mcp/asset/158e9de0-6b6b-4103-822b-6b7d1ca007e7";
const iconFood       = "https://www.figma.com/api/mcp/asset/b2902803-559d-43fa-aab2-ff71ce0a5d0b";
const iconRest       = "https://www.figma.com/api/mcp/asset/9131ad09-7a1b-4f90-889e-91cacc708072";
const iconShop       = "https://www.figma.com/api/mcp/asset/fabff748-08ef-40e4-94aa-e37533f1fab9";
const iconView       = "https://www.figma.com/api/mcp/asset/fe88fdb5-7a58-444f-9539-394344d9373d";
const iconHeart      = "https://www.figma.com/api/mcp/asset/9a3454bd-1607-429a-b2be-1d462683a222";
const iconLogin      = "https://www.figma.com/api/mcp/asset/348992db-4fea-4d1d-9033-05a3f42ab59e";
const iconMenu       = "https://www.figma.com/api/mcp/asset/5c2a55f2-e5df-4c85-84c9-de1417c24003";

const CATEGORIES = [
  { label: "전체", icon: iconAll },
  { label: "한 잔", icon: iconDrink },
  { label: "한 입", icon: iconFood },
  { label: "한 숨", icon: iconRest },
  { label: "한 손", icon: iconShop },
  { label: "한 눈", icon: iconView },
];

const PLACES = [
  {
    id: 1,
    name: "온기 카페",
    category: "한 잔",
    distance: "내 위치로부터 도보 2분",
    isOpen: true,
    hours: "00:00에 종료",
    desc: "골목 안 작은 로스터리. 매일 아침 직접 볶은 원두가 기다립니다.",
    tags: ["#로스팅", "#조용한"],
  },
  {
    id: 2,
    name: "온기 카페",
    category: "한 잔",
    distance: "내 위치로부터 도보 2분",
    isOpen: false,
    hours: "00:00에 시작",
    desc: "골목 안 작은 로스터리. 매일 아침 직접 볶은 원두가 기다립니다.",
    tags: ["#로스팅", "#조용한"],
  },
  {
    id: 3,
    name: "온기 카페",
    category: "한 잔",
    distance: "경로부터 도보 2분",
    isOpen: true,
    hours: "00:00에 종료",
    desc: "골목 안 작은 로스터리. 매일 아침 직접 볶은 원두가 기다립니다.",
    tags: ["#로스팅", "#조용한"],
  },
  {
    id: 4,
    name: "온기 카페",
    category: "한 잔",
    distance: "경로부터 도보 2분",
    isOpen: true,
    hours: "00:00에 종료",
    desc: "골목 안 작은 로스터리. 매일 아침 직접 볶은 원두가 기다립니다.",
    tags: ["#로스팅", "#조용한"],
  },
];

export default function Onboard20() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("전체");

  return (
    <div
      className="min-h-screen bg-[#faf6f0] text-[#2c2417] overflow-hidden"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      {/* ── 네비게이션 바 ── */}
      <header className="sticky top-0 z-50 bg-[rgba(250,246,240,0.8)] backdrop-blur-sm border-b border-[rgba(44,36,23,0.06)]">
        <div className="max-w-[1101px] mx-auto px-10 h-14 flex items-center justify-between">
          <a href="#" className="text-[#c8873a] font-semibold text-[19.2px] tracking-[1.92px]">
            가는길
          </a>

          <nav className="flex items-center gap-1">
            <a
              href="#"
              className="px-4 py-2 rounded-full bg-[rgba(200,135,58,0.1)] text-[#c8873a] text-sm"
            >
              길찾기
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-full text-[#8b7e6a] text-sm hover:text-[#2c2417] transition-colors"
            >
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

      {/* ── 메인 콘텐츠 ── */}
      <main className="relative h-[calc(100vh-56px)] overflow-hidden">
        {/* 지도 배경 */}
        <div className="absolute inset-0 bg-[#ddd]">
          <div className="grid grid-cols-4 gap-0 h-full">
            {[imgMap6, imgMap0, imgMap1, imgMap7,
              imgMap2, imgMap3, imgMap4, imgMap5].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-full h-full object-cover pointer-events-none"
              />
            ))}
          </div>

          {/* 지도 마커 클러스터 */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/4 -translate-y-1/4">
            <div className="relative w-[141px] h-[141px] bg-[rgba(143,143,143,0.2)] border-[2.66px] border-white rounded-full shadow-[0px_17.625px_52.875px_0px_rgba(0,0,0,0.3)]">
              {[
                { top: "24px", left: "96px" },
                { top: "-7px", left: "107px" },
                { top: "-40px", left: "45px" },
                { top: "-23px", left: "22px" },
                { top: "-19px", left: "102px" },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute w-4 h-4 bg-[#c8873a] border border-white rounded-lg shadow-[0px_2px_6px_0px_rgba(0,0,0,0.3)] flex items-center justify-center"
                >
                  <img src={iconMarker} alt="" className="w-[7.8px] h-[7.8px]" />
                </div>
              ))}
            </div>
          </div>

          {/* GPS 위치 버튼 */}
          <button className="absolute top-[calc(50%-100px)] left-[340px] w-10 h-10 bg-white border border-[#f3f4f6] rounded-full shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] flex items-center justify-center hover:shadow-md transition-shadow">
            <img src={iconGPS} alt="현재 위치" className="w-4 h-4" />
          </button>
        </div>

        {/* ── 사이드 패널 ── */}
        <aside className="absolute top-[10px] left-4 w-[301px] h-[694px] bg-white border border-[#f3f4f6] rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col z-10">

          {/* 출발지 입력 */}
          <div className="px-4 pt-4 pb-0 shrink-0">
            <div className="flex items-center gap-3 bg-[rgba(245,240,232,0.6)] px-3 py-3 rounded-[14px]">
              <img src={iconGPS} alt="" className="w-[15px] h-[15px] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11.2px] font-light text-[#8b7e6a] leading-tight">출발지</p>
                <p className="text-[14px] font-light text-[#2c2417] leading-tight mt-0.5 truncate">현재 위치</p>
              </div>
              <img src={iconArrow} alt="" className="w-[14px] h-[14px] shrink-0" />
            </div>

            {/* 구분선 */}
            <div className="flex items-center gap-3 px-3 my-3">
              <div className="flex-1 h-px bg-[#f3f4f6]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[rgba(200,135,58,0.3)]" />
              <div className="flex-1 h-px bg-[#f3f4f6]" />
            </div>
          </div>

          {/* 목적지 검색 */}
          <div className="px-4 pb-3 shrink-0 relative">
            <div className="bg-[#f5f0e8] px-[44px] py-[14px] rounded-[14px]">
              <p className="text-[15.2px] font-normal text-[rgba(139,126,106,0.5)] leading-normal">
                어디로 가시나요?
              </p>
            </div>
            <img
              src={iconSearch}
              alt=""
              className="absolute left-[30px] top-1/2 -translate-y-1/2 w-[17px] h-[17px]"
            />
          </div>

          {/* 가는길에 들러보세요 */}
          <div className="px-4 pt-1 shrink-0">
            <p className="text-[8.9px] font-light text-[#2c2417]">
              가는길에{" "}
              <span className="font-medium text-[#c8873a]">잠시 들러보세요</span>
            </p>
          </div>

          {/* 카테고리 필터 */}
          <div className="px-[22px] pt-2 pb-2 flex items-center gap-[2px] shrink-0">
            {CATEGORIES.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
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
            {PLACES.map((place) => (
              <div
                key={place.id}
                className="flex gap-[7.4px] items-start bg-white border border-[#f3f4f6] rounded-[9.9px] p-[8px] hover:shadow-sm transition-shadow cursor-pointer"
              >
                {/* 썸네일 */}
                <div className="w-[39.5px] h-[39.5px] rounded-[8.6px] overflow-hidden shrink-0">
                  <img
                    src={imgPlace}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <p className="text-[8.7px] font-medium text-[#2c2417] leading-tight truncate">
                        {place.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        <span className="text-[6.9px] font-light text-[#8b7e6a]">{place.category}</span>
                        <span className="text-[9.9px] text-[rgba(139,126,106,0.3)] leading-none">·</span>
                        <span className="text-[6.9px] font-light text-[#8b7e6a]">{place.distance}</span>
                        <span className="text-[9.9px] text-[rgba(139,126,106,0.3)] leading-none">·</span>
                        <span
                          className={`text-[6.9px] font-light ${
                            place.isOpen ? "text-[#2b8237]" : "text-[#c82b2b]"
                          }`}
                        >
                          {place.isOpen
                            ? `영업 중 (${place.hours}에 종료)`
                            : `영업 종료 (${place.hours})`}
                        </span>
                      </div>
                    </div>
                    <button className="shrink-0 ml-1 w-[17px] h-[17px] flex items-center justify-center">
                      <img src={iconHeart} alt="저장" className="w-[8.6px] h-[8.6px]" />
                    </button>
                  </div>

                  <p className="text-[7.1px] font-light text-[#8b7e6a] mt-1 leading-relaxed line-clamp-1">
                    {place.desc}
                  </p>

                  <div className="flex gap-[2.5px] mt-1.5">
                    {place.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#f5f0e8] text-[#8b7e6a] text-[6.1px] font-normal px-[3.7px] py-[1.2px] rounded-[2.5px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
