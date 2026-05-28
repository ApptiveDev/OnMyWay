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
    <header className="top-0 h-[120px]  bg-[#FFFADD]">
      <div className="flex w-[1920px] justify-items-center ml-[352px] mr-[340px] ">

        {/* 로고 */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center w-[186px] h-[43px] py-[8px] pl-[10px] gap-[8px] ml-[352px] ms-[19.77px]"
        >
          <img src={LOGO_ICON} className="w-[186px] h-[43.23px]"/>
        </button>

        {/* 내비게이션 */}
        <nav className="flex place-items-start w-[710px] h-[25px] gap-[44.44px] my-[11.45px] ml-[53.33px]">
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
                style={{ fontFamily: "Pretendard" }}
              >
                {label}
              </button>
            );
          })}
        </nav>


        {/* 우측: 아이콘 + 로그인/회원가입 */}
        <div className="flex items-center gap-[8px] "> 
            <button
              onClick={() => navigate("/login")}
              className="color: #858585;
                            align-center,
                          
                            text [14px]
                            font-normal
                            font-weight-500
                            tracking-[-0.28px]
                            
                            "
              style={{ fontFamily: "Pretendard" }}
            >
              로그인
            </button>
            <div className="w-[1px] h-[10px] bg-[#858585]" /> {/* 구분선 */}

            <button
              onClick={() => navigate("/signup")}
              className="color: #858585;
                            align-center,
                          
                            text [14px]
                            font-normal
                            font-weight-500
                            tracking-[-0.28px]"
                            
              style={{ fontFamily: "Pretendard" }}
            >
              회원가입
            </button>
            
            <div classname= "flex w-[71px] align-center gap-[16px] ml-[45.33px]">
              <button className="inline-flex w-[24px] h-[24px]  ">
                <img src={iconMenu} alt="메뉴" className="w-[24px] h-[24px]" />
              </button>
              <button className="inline-flex w-[24px] h-[24px]">
                <img src={iconSearch} alt="검색" className="w-[24px] h-[24px]" />
              </button>
          </div>
        </div>
      </div>
    </header>
  );
}
