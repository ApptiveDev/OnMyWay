import { useNavigate, useLocation } from "react-router-dom";
import iconSearch from "@/assets/Button_dialog.svg";
import iconMenu   from "@/assets/header_search.svg";

// Figma 로고 아이콘 (7일 후 만료 → 로컬 파일로 교체 필요)
import LOGO_ICON from "@/assets/Frame 16.svg";

const NAV_ITEMS = [
  { label: "길찾기",  path: "/find-route" },
  { label: "탐색하기", path: "/discover"   },
  { label: "둘러보기", path: "/explore"    },
];

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-[#FFFBEC]">
      {/* 상단 바: 로그인 | 회원가입 */}
      <div className="flex justify-end mr-[200px] pt-[10px] pb-0 ">
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => navigate("/login")}
            className="text-[#858585] text-[10px] font-medium tracking-[-0.28px] hover:text-[#3e2722] transition-colors"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            로그인
          </button>
          <div className="w-px h-[10px] bg-[#858585]" />
          <button
            onClick={() => navigate("/signup")}
            className="text-[#858585] text-[10px] font-medium tracking-[-0.28px] hover:text-[#3e2722] transition-colors"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            회원가입
          </button>
        </div>
      </div>

      {/* 메인 헤더 행 */}
      <div className="max-w-[1101px] mx-auto px-14 h-[45px] flex items-center gap-[150px] border-b border-[rgba(44,36,23,0.06)]">
        {/* 로고 */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 shrink-0"
>
          <img src={LOGO_ICON} className="h-[24px] w-auto ml-[200px]" />
        
        </button>

        {/* 내비게이션 */}
        <nav className="flex items-center gap-[35px]">
          {NAV_ITEMS.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`pb-[2px] text-[15px] tracking-[-0.4px] transition-colors border-b-[2px] ${
                  active
                    ? "border-[#3e2722] text-[#3e2722] font-semibold"
                    : "border-transparent text-[#3e2722] font-medium hover:border-[#3e2722]/40"
                }`}
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* 우측 아이콘 */}
        <div className="flex items-center gap-[16px] shrink-0">
          <button className="w-[15px] h-[15px] flex items-center justify-center hover:opacity-70 transition-opacity">
            <img src={iconMenu} alt="메뉴" className="w-[15px] h-[15px]" />
          </button>
          <button className="w-[15px] h-[15px] flex items-center justify-center hover:opacity-70 transition-opacity">
            <img src={iconSearch} alt="검색" className="w-[15px] h-[15px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
