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
    <header className="top-0  bg-[#FFFBEC] border-b border-[rgba(17,242,54,0.06)]">
      <div className="display:inline-flex max-w-[1920px] flex justify-content:flex-end align-items:center ml-[352px] h-[57px] ms-[19.77px] mr-[340px]   ">

        {/* 로고 */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center w-[186px] h-[43px] py-[8px] pl-[10px] gap-[8px]"
        >
          <img src={LOGO_ICON} className="w-auto h-auto" />
        </button>

        {/* 내비게이션 */}
        <nav className="flex items-center gap-[44.44px] my-[11.45px] ml-[53.33px]">
          {NAV_ITEMS.map(({ label, path }) => {
            const active = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`text-center text-[20.74px] font-semibold leading-normal tracking-[-0.622px] ${
                  active
                    ? "text-[#3e2722] font-semibold"
                    : "text-[#3e2722] font-medium hover:opacity-40"
                }`}
                style={{ fontFamily: "'Pretendard', sans-serif" }}
              >
                {label}
              </button>
            );
          })}
        </nav>


        {/* 우측: 아이콘 + 로그인/회원가입 */}
        <div className="flex items-center gap-[16px] shrink-0">
          <button className="w-[15px] h-[15px] flex items-center justify-center hover:opacity-70 transition-opacity">
            <img src={iconMenu} alt="메뉴" className="w-[15px] h-[15px]" />
          </button>
          <button className="w-[15px] h-[15px] flex items-center justify-center hover:opacity-70 transition-opacity">
            <img src={iconSearch} alt="검색" className="w-[15px] h-[15px]" />
          </button>
          <div className="w-px h-[10px] bg-[#858585]" />
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
    </header>
  );
}
