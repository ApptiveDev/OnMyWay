import iconSearchNew from "@/assets/icon-search-new.svg";
import iconex        from "@/assets/icon-ex.svg";

export default function RouteInputSection({
  locStatus,
  destText, setDestText, destFocused,
  deptText, setDeptText, deptFocused,
  customDeptCoords,
  destInputRef, deptInputRef,
  handleDestFocus, handleDeptFocus, handleCancel,
  handleDestSubmit, handleDeptSubmit,
  handleDeptClear,
}) {
  const granted = locStatus === "granted";
  const defaultDeptLabel =
    locStatus === "granted" ? "현재 위치" :
    locStatus === "pending"  ? "위치 확인 중…" :
    "부산대학교 정문";

  // 출발지에 커스텀 값이 있거나 포커스 중일 때 X 버튼 노출
  const showDeptClear = !!customDeptCoords || (deptFocused && !!deptText);

  return (
    <div className="flex gap-[11px] items-center w-full">

      {/* 인디케이터 */}
      <div className="flex flex-col items-center w-[13px] h-[64px] shrink-0 py-[3px]">
        <div className="w-[12px] h-[12px] rounded-full bg-[#ED7A13] ring-2 ring-white shrink-0" />
        <div className="flex-1 w-px border-l border-dashed border-[rgba(62,39,34,0.3)]" />
        <div className="w-[13px] h-[13px] rounded-[50%_50%_50%_2px] rotate-[-45deg] bg-[#3E2722] shrink-0" />
      </div>

      {/* 입력 박스 */}
      <div className="flex flex-col gap-[9px] w-full min-w-0">

        {/* 출발지 */}
        <form onSubmit={handleDeptSubmit} className="w-full">
          <div className={`bg-[#fffdf2] border-[1.5px] border-solid h-[48px] flex items-center gap-[9px] px-[14px] rounded-[13px] shadow-[inset_0_0_0_1px_rgba(62,39,34,0.06)] ${
            deptFocused ? "border-[rgba(200,135,58,0.6)]" : "border-transparent"
          }`}>
            <div className="w-[13px] h-[13px] rounded-full bg-[#6A8042] shrink-0" />
            <div className="flex-1 min-w-0">
              {(locStatus === "granted" || locStatus === "denied") && !deptFocused && !deptText ? (
                <button
                  type="button"
                  className="w-full text-[15px] leading-tight text-[#3e2722] text-left bg-transparent"
                  style={{ fontFamily: "Pretendard-SemiBold" }}
                  onClick={handleDeptFocus}
                >
                  {defaultDeptLabel}
                </button>
              ) : (
                <input
                  ref={deptInputRef}
                  type="text"
                  value={deptText}
                  onChange={e => setDeptText(e.target.value)}
                  onFocus={handleDeptFocus}
                  placeholder={defaultDeptLabel}
                  className="w-full text-[15px] bg-transparent outline-none leading-tight placeholder:text-[#afafaf] placeholder:font-normal text-[#3e2722]"
                  style={{ fontFamily: "Pretendard-SemiBold" }}
                  autoFocus={deptFocused}
                />
              )}
            </div>
            {showDeptClear && (
              <button
                type="button"
                onClick={handleDeptClear}
                className="shrink-0 hover:opacity-70 transition-opacity"
              >
                <img src={iconex} alt="초기화" className="w-[14px] h-[13px]" />
              </button>
            )}
          </div>
        </form>

        {/* 목적지 */}
        <form onSubmit={handleDestSubmit} className="w-full">
          <div className={`bg-[#fffdf2] border-2 border-solid h-[48px] flex items-center gap-[9px] px-[14px] rounded-[13px] transition-colors ${
            destFocused ? "border-[rgba(200,135,58,0.6)]" : "border-[#ED7A13]"
          }`}>
            <div className="flex-1 min-w-0">
              <input
                ref={destInputRef}
                type="text"
                value={destText}
                onChange={e => setDestText(e.target.value)}
                onFocus={handleDestFocus}
                placeholder="어디로 가시나요?"
                className="w-full text-[15px] bg-transparent outline-none leading-tight placeholder:text-[#b3a892] placeholder:font-normal text-[#3e2722]"
                style={{ fontFamily: "Pretendard-SemiBold" }}
                autoFocus={destFocused}
              />
            </div>
            {!destFocused && <img src={iconSearchNew} alt="" className="w-[16px] h-[16px] shrink-0 opacity-60" />}
            {destFocused && (
              <button type="button" onClick={handleCancel} className="shrink-0 hover:opacity-70 transition-opacity">
                <img src={iconex} alt="취소" className="w-[13px] h-[12px]" />
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
