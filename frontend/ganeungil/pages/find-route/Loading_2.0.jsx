import { useState, useEffect } from "react";

const DESIGN_W = 1920;
const DESIGN_H = 1275;

export default function Loading20() {
  const [scale, setScale] = useState(
    () => Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
  );

  useEffect(() => {
    const update = () =>
      setScale(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "rgba(255,251,236,0.45)" }}
    >
      <style>{`
        @keyframes gg-spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="flex flex-col items-center gap-[15px] bg-white px-[34px] py-[26px] rounded-[20px] shadow-[0_12px_36px_rgba(62,39,34,0.18)]">
        <div
          className="w-[42px] h-[42px] rounded-full border-[3.5px] border-[#F0E2C0]"
          style={{ borderTopColor: "#ED7A13", animation: "gg-spin 0.8s linear infinite" }}
        />
        <div className="text-[14.5px] text-[#5a4d42]" style={{ fontFamily: "'MaruBuri', serif" }}>
          걷기 좋은 길을 준비하고 있어요…
        </div>
      </div>
    </div>
  );
}
