export default function IconRail({ mode, onSelectRoute, onSelectSearch, onNavigateSaved }) {
  return (
    <nav
      className="shrink-0 w-[88px] h-full bg-[#FFF6D6] flex flex-col items-center py-[14px] gap-[7px] overflow-y-auto z-10"
      style={{ boxShadow: "1px 0 0 rgba(62,39,34,0.05)" }}
    >
      <button
        onClick={onSelectRoute}
        className="w-[74px] py-[11px] rounded-[16px] flex flex-col items-center gap-[6px] shrink-0 transition-colors"
        style={mode === "route" ? { background: "#ED7A13", color: "#fff" } : { color: "#9a8e84" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6.5 20.5V11a3.5 3.5 0 0 1 3.5-3.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.5 4L15 7.5 11.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6.5" cy="20.5" r="2.1" fill="currentColor" />
        </svg>
        <span className="text-[11px] font-semibold" style={{ fontFamily: "Pretendard" }}>길찾기</span>
      </button>

      <button
        onClick={onSelectSearch}
        className="w-[74px] py-[11px] rounded-[16px] flex flex-col items-center gap-[6px] shrink-0 transition-colors"
        style={mode === "search" ? { background: "#ED7A13", color: "#fff" } : { color: "#9a8e84" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.4-3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="text-[11px] font-semibold" style={{ fontFamily: "Pretendard" }}>장소검색</span>
      </button>

      <div className="w-[44px] h-px bg-[#EDE3C4] my-[5px] shrink-0" />

      <button
        onClick={onNavigateSaved}
        className="w-[74px] py-[11px] rounded-[16px] flex flex-col items-center gap-[6px] shrink-0 hover:bg-[rgba(62,39,34,0.05)] transition-colors"
        style={{ color: "#9a8e84" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M7 4.5h10v15l-5-4-5 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <span className="text-[11px] font-semibold" style={{ fontFamily: "Pretendard" }}>저장</span>
      </button>

      <button
        title="준비 중"
        className="w-[74px] py-[11px] rounded-[16px] flex flex-col items-center gap-[6px] shrink-0 cursor-default"
        style={{ color: "#c7bdae" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[11px] font-semibold" style={{ fontFamily: "Pretendard" }}>최근</span>
      </button>
    </nav>
  );
}
