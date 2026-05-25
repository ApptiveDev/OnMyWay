import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 지도 페이지에서는 헤더 숨김 (Figma 3001-185: 헤더 없이 지도가 전체 화면)
  const isMapPage = pathname.startsWith("/find-route") || pathname === "/";
  if (isMapPage) return null;

  return (
    <header className="absolute top-0 left-0 z-50 bg-[#fffbec] w-[1920px] h-[120px]">
    </header>
  );
}
