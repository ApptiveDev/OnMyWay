import { useNavigate, useLocation } from "react-router-dom";
import LOGO_ICON  from "@/assets/header-logo.svg";
import iconSearch from "@/assets/header-search.svg";
import iconMenu   from "@/assets/header-menu.svg";

const NAV_ITEMS = [
  { label: "길찾기",  path: "/find-route" },
  { label: "둘러보기", path: "/explore"    },
  { label: "간직하기", path: "/discover"   },
];

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="w-[1440px] mx-auto">
      {/* ── 헤더 (Figma node 1412:7236 기준, 1440px 프레임과 1:1이라 scale 불필요) ── */}
      <header
        className="relative w-full h-[72px] bg-[#FFFBEC]"
        style={{ boxShadow: "0px 1px 0px 0px rgba(62,39,34,0.06)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="absolute left-[36px] top-1/2 -translate-y-1/2 w-[140.625px] h-[25px]"
        >
          <img src={LOGO_ICON} alt="가는길" className="w-full h-full" />
        </button>

        <nav className="absolute left-[224.63px] top-[23px] flex items-center gap-[30px]">
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

        <div className="absolute left-[1177px] top-1/2 -translate-y-1/2 flex items-center gap-[10px]">
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

        <button className="absolute left-[1326px] top-[27px] w-[20px] h-[18px]">
          <img src={iconMenu} alt="메뉴" className="w-full h-full" />
        </button>
        <button className="absolute left-[1384px] top-1/2 -translate-y-1/2 w-[20px] h-[20px]">
          <img src={iconSearch} alt="검색" className="w-full h-full" />
        </button>
      </header>

      <main className="max-w-[1101px] mx-auto px-14 py-10">
        {/* 탐색하기 페이지 내용 */}
      </main>
    </div>
  );
}
