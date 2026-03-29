import { useNavigate, useLocation } from "react-router-dom";
import iconLogin from "@/assets/icon-login-new.svg";
import iconMenu  from "@/assets/icon-menu-new.svg";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navItem = (label, path) => {
    const active = pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          active
            ? "bg-[rgba(200,135,58,0.1)] text-[#c8873a] font-medium"
            : "text-[#8b7e6a] hover:text-[#2c2417]"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgba(250,246,240,0.8)] backdrop-blur-sm border-b border-[rgba(44,36,23,0.06)]">
      <div className="max-w-[1101px] mx-auto px-10 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-[#c8873a] font-semibold text-[19.2px] tracking-[1.92px]"
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          가는길
        </button>

        <nav className="flex items-center gap-1">
          {navItem("길찾기", "/find-route")}
          {navItem("둘러보기", "/explore")}
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
  );
}
