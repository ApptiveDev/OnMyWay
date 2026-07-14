import { forwardRef, Fragment } from "react";

const ITEMS = [
  {
    flow: "directions",
    label: "길찾기",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6.5 20.5V11a3.5 3.5 0 0 1 3.5-3.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.5 4L15 7.5 11.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6.5" cy="20.5" r="2.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    flow: "search",
    label: "장소검색",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="m20 20-3.4-3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    flow: "saved",
    label: "저장",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M7 4.5h10v15l-5-4-5 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    flow: "recent",
    label: "최근",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const IconRail = forwardRef(function IconRail({ flow, onFlowChange, sidebarOpen, onSidebarToggle }, ref) {
  return (
    <nav
      ref={ref}
      className="flex-none w-[88px] bg-[#FFF6D6] flex flex-col items-center py-[14px] gap-[7px] shadow-[1px_0_0_rgba(62,39,34,0.05)] overflow-y-auto z-10"
    >
      {ITEMS.map(({ flow: itemFlow, label, icon }, i) => {
        const active = flow === itemFlow;
        return (
          <Fragment key={itemFlow}>
            {i === 2 && <div className="w-[44px] h-px bg-[#EDE3C4] my-[5px] flex-none" />}
            <button
              onClick={() => onFlowChange(itemFlow)}
              className="w-[74px] py-[11px] rounded-[16px] flex flex-col items-center gap-[6px] cursor-pointer flex-none transition-colors"
              style={{ background: active ? "#ED7A13" : "transparent", color: active ? "#fff" : "#9a8e84" }}
            >
              {icon}
              <span className="text-[11px]" style={{ fontFamily: "Pretendard-SemiBold" }}>{label}</span>
            </button>
          </Fragment>
        );
      })}

      {onSidebarToggle && (
        <button
          onClick={onSidebarToggle}
          title={sidebarOpen ? "패널 숨기기" : "패널 펼치기"}
          className="mt-auto w-[36px] h-[36px] rounded-full bg-white shadow-[0_1px_4px_rgba(62,39,34,0.12)] flex items-center justify-center cursor-pointer text-[#9a8e84] hover:text-[#3E2722] flex-none"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: sidebarOpen ? "rotate(180deg)" : "none" }}>
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </nav>
  );
});

export default IconRail;
