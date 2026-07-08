import { useLayoutEffect, useState } from "react";

const BASE_WIDTH = 1440;
const MAX_SCALE = 1.2;

// 모든 페이지가 1440px 기준으로 설계돼있어서, 그보다 좁은 화면에서는
// 레이아웃을 그대로 유지한 채 통째로 축소해서 보여준다.
// zoom은 transform과 달리 실제 레이아웃 크기까지 같이 조정되므로
// 별도 높이 계산 없이 브라우저 기본 스크롤이 그대로 동작한다.
export default function ScaledFrame({ children }) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function updateScale() {
      setScale(Math.min(window.innerWidth / BASE_WIDTH, MAX_SCALE));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div style={{ width: BASE_WIDTH, margin: "0 auto", zoom: scale }}>
      {children}
    </div>
  );
}
