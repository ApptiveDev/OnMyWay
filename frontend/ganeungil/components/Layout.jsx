import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState, useEffect } from "react";

const DESIGN_WIDTH = 1920;

export default function Layout() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => setScale(window.innerWidth / DESIGN_WIDTH);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    /* 바깥 wrapper: 뷰포트 크기만큼만 차지, 넘치는 부분 숨김 */
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* 안쪽 div: 1920px 고정 + 비율 축소 */}
      <div
        style={{
          fontFamily: "'Noto Serif KR', serif",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${DESIGN_WIDTH}px`,
        }}
      >
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
