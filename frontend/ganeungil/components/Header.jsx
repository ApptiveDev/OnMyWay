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
    <header className="top-0 h-[120px] bg-[#FFFADD]">
      <div className="flex items-center w-full px-[352px] pt-[57px]">

        {/* 로고 */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center w-[186px] h-[43px]"
        >
          <img src={LOGO_ICON} className="w-[186px] h-[43.23px]"/>
        </button>

        {/* 내비게이션 */}
        <nav className="flex items-center gap-[44.44px] ml-[53.33px]">
          {NAV_ITEMS.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`text-center text-[20.74px] leading-normal tracking-[-0.622px] ${
                  active
                    ? "text-[#3e2722] font-semibold"
                    : "text-[#3e2722] font-medium hover:opacity-40"
                }`}
                style={{ fontFamily: "Pretendard" }}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* 우측: 로그인/회원가입 + 아이콘 */}
        <div className="flex items-center gap-[8px] ml-auto">
          <button
            onClick={() => {
              const currentPath = encodeURIComponent(pathname)
              navigate(`/login?redirect-url=${currentPath}`)
            }}
            className="text-[#858585] text-[14px] font-medium tracking-[-0.28px]"
            style={{ fontFamily: "Pretendard" }}
          >
            로그인
          </button>
          <div className="w-[1px] h-[10px] bg-[#858585]" />
          <button
            onClick={() => navigate("/signup")}
            className="text-[#858585] text-[14px] font-medium tracking-[-0.28px]"
            style={{ fontFamily: "Pretendard" }}
          >
            회원가입
          </button>

          <div className="flex items-center gap-[16px] ml-[45px]">
            <button className="w-[24px] h-[24px]">
              <img src={iconSearch} alt="검색" className="w-[24px] h-[24px]" />
            </button>
            <button className="w-[24px] h-[24px]">
              <img src={iconMenu} alt="메뉴" className="w-[24px] h-[24px]" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}