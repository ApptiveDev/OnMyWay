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
      className="bg-[#faf6f0] text-[#2c2417] overflow-hidden w-full h-screen"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer-sweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes width-pulse {
          0%, 100% { transform: scaleX(1); }
          50%       { transform: scaleX(0.55); }
        }
        .loading-spinner {
          animation: spin 1.4s linear infinite;
        }
        .shimmer-bar {
          background: linear-gradient(105deg, #f0e9df 38%, #fdf8f0 50%, #f0e9df 62%);
          background-size: 300% 100%;
          animation: shimmer-sweep 1.6s linear infinite;
        }
        .skeleton {
          transform-origin: left center;
          background: linear-gradient(105deg, #e8e0d8 38%, #f5f0ea 50%, #e8e0d8 62%);
          background-size: 300% 100%;
          animation: shimmer-sweep 1.6s linear infinite,
                     width-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <main className="relative w-full h-full overflow-hidden">

        {/* 지도 배경 */}
        <div className="absolute inset-0 bg-[#faf6f0]" />

        {/* 로딩 스피너 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="mb-6 loading-spinner" style={{ width: 95, height: 95 }}>
            <svg viewBox="0 0 95 95" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="47.5" cy="47.5" r="40" stroke="#f0e8da" strokeWidth="7" />
              <circle
                cx="47.5" cy="47.5" r="40"
                stroke="url(#goldGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="180 72"
              />
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="95" y2="95" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#c8873a" />
                  <stop offset="100%" stopColor="#e8b96a" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p
            className="text-[#8b7e6a] text-[15px] font-light text-center leading-[20px]"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            걷기 좋은 길을 준비하고 있어요..
          </p>
        </div>

        {/* 사이드바 스켈레톤 — 실제 사이드바와 동일한 위치·크기·스타일 */}
        <div
          className="absolute flex-shrink-0"
          style={{
            top:          `${34 * scale}px`,
            left:         `${36 * scale}px`,
            width:        `${492 * scale}px`,
            height:       `${1091 * scale}px`,
            borderRadius: `${30 * scale}px`,
            boxShadow:    "0 4px 10px 0 rgba(0,0,0,0.25)",
            overflow:     "hidden",
          }}
        >
          <aside
            className="w-[492px] h-[1091px] bg-[#FDFDFD] flex flex-col overflow-hidden"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
          >

            {/* 노란 상단 */}
            <div className="w-[492px] h-[407.19px] rounded-t-[30px] overflow-hidden bg-[#FFEDA1] shrink-0 flex flex-col">
              <div className="flex flex-col gap-[37px] items-center px-[41px] pt-[41px] w-full">

                {/* RouteInputSection 스켈레톤 */}
                <div className="flex gap-[18px] items-center w-full">
                  {/* 인디케이터 */}
                  <div className="flex flex-col items-center w-[24px] h-[91px] shrink-0 py-[5px]">
                    <div className="w-[14px] h-[14px] rounded-full bg-[#ED7A13] ring-2 ring-white" />
                    <div className="flex-1 w-px border-l border-dashed border-[rgba(62,39,34,0.3)]" />
                    <div className="w-[14px] h-[14px] rounded-full bg-[#3E2722] ring-2 ring-white" />
                  </div>
                  {/* 입력 박스 */}
                  <div className="flex flex-col w-[388px]">
                    {/* 출발지 */}
                    <div className="p-[8px] w-full">
                      <div className="bg-[#fffbec] border-[1.883px] border-[#d9d9d9] h-[65px] rounded-[37.669px]" />
                    </div>
                    {/* 목적지 */}
                    <div className="p-[8px] w-full">
                      <div className="bg-[#fffbec] border-[1.883px] border-[#d9d9d9] h-[65px] rounded-[37.669px]" />
                    </div>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="w-[423px] h-px bg-[#d9d9d9] shrink-0" />
              </div>
            </div>

            {/* 흰색 하단 — 경로 카드 스켈레톤 4개 */}
            <div className="flex-1 flex flex-col gap-[44px] px-[20px] pt-[80px] pb-[12px] overflow-hidden">
              <div className="skeleton rounded-[37.669px] h-[32px] w-full" style={{ animationDelay: "0s,    0s"   }} />
              <div className="skeleton rounded-[37.669px] h-[32px] w-full" style={{ animationDelay: "0.15s, 0.4s" }} />
              <div className="skeleton rounded-[37.669px] h-[32px] w-full" style={{ animationDelay: "0.3s,  0.8s" }} />
              <div className="skeleton rounded-[37.669px] h-[32px] w-full" style={{ animationDelay: "0.45s, 1.2s" }} />
            </div>

          </aside>
        </div>

      </main>
    </div>
  );
}
