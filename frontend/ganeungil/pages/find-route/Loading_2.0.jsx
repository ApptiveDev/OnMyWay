export default function Loading20() {
  return (
    <div
      className="bg-[#faf6f0] text-[#2c2417] overflow-hidden"
      style={{ fontFamily: "'Noto Serif KR', serif" }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { opacity: 0.5; }
          50%  { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .loading-spinner {
          animation: spin 1.4s linear infinite;
        }
        .skeleton {
          animation: shimmer 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* ── 메인 ── */}
      <main className="relative h-full overflow-hidden">

        {/* ── 지도 영역 배경 ── */}
        <div className="absolute inset-0 bg-[#faf6f0]" />

        {/* ── 로딩 스피너 (지도 중앙) ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* 골든 링 스피너 */}
          <div className="mb-6 loading-spinner" style={{ width: 95, height: 95 }}>
            <svg viewBox="0 0 95 95" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="47.5"
                cy="47.5"
                r="40"
                stroke="#f0e8da"
                strokeWidth="7"
              />
              <circle
                cx="47.5"
                cy="47.5"
                r="40"
                stroke="url(#goldGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="180 72"
                strokeDashoffset="0"
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

        {/* ── 사이드바 스켈레톤 ── */}
        <div className="absolute top-[10px] left-[10px] w-[301px] h-[694px] bg-white rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] border border-[#f3f4f6] overflow-hidden z-10">
          <div className="flex flex-col gap-3 p-4">

            {/* 출발지 버튼 */}
            <div className="bg-[rgba(245,240,232,0.6)] rounded-[14px] h-[60px] flex items-center px-3 gap-3">
              <div className="w-[15px] h-[15px] rounded-full bg-[#c8873a] shrink-0" />
              <div className="flex flex-col flex-1 gap-1">
                <span className="text-[11.2px] font-light text-[#8b7e6a]">출발지</span>
                <span className="text-[14px] font-light text-[#2c2417]">현재 위치</span>
              </div>
            </div>

            {/* 구분선 */}
            <div className="flex items-center gap-3 px-3 h-[6px]">
              <div className="flex-1 h-px bg-[#f3f4f6]" />
              <div className="w-[6px] h-[6px] rounded-full bg-[rgba(200,135,58,0.3)]" />
              <div className="flex-1 h-px bg-[#f3f4f6]" />
            </div>

            {/* 검색 입력창 */}
            ``
            <div className="relative">
              <div className="bg-[#f5f0e8] rounded-[14px] h-[51px] flex items-center pl-[44px] pr-[40px]">
                <span className="text-[15.2px] text-[rgba(139,126,106,0.5)]">어디로 가시나요?</span>
              </div>
            </div>

            {/* 스켈레톤 바 목록 */}
            <div className="flex flex-col gap-4 px-1 mt-4">
              <div className="skeleton bg-[#f5f0e8] rounded-[14px] h-[27px] w-[143px]" />
              <div className="skeleton bg-[#f5f0e8] rounded-[14px] h-[27px] w-[229px]" style={{ animationDelay: "0.2s" }} />
              <div className="skeleton bg-[#f5f0e8] rounded-[14px] h-[27px] w-[66px]"  style={{ animationDelay: "0.4s" }} />
              <div className="skeleton bg-[#f5f0e8] rounded-[14px] h-[27px] w-[102px]" style={{ animationDelay: "0.6s" }} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
`