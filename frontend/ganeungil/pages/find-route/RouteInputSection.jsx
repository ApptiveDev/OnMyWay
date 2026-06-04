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
    <div className="flex gap-[18px] items-center w-full">

      {/* 인디케이터 */}
      <div className="flex flex-col items-center w-[24px] h-[91px] shrink-0 py-[5px]">
        <div className="w-[14px] h-[14px] rounded-full bg-[#ED7A13] ring-2 ring-white" />
        <div className="flex-1 w-px border-l border-dashed border-[rgba(62,39,34,0.3)]" />
        <div className="w-[14px] h-[14px] rounded-full bg-[#3E2722] ring-2 ring-white" />
      </div>

      {/* 입력 박스 */}
      <div className="flex flex-col items-center w-[388px]">
        <div className="flex flex-col items-center w-full">

          {/* 출발지 */}
          <div className="flex flex-col items-start p-[8px] w-full">
            <form onSubmit={handleDeptSubmit} className="w-full">
              <div className={`bg-[#fffbec] border-[1.883px] border-solid h-[65px] flex items-center gap-[15.068px] pl-[37.67px] pr-[16px] rounded-[37.669px] ${
                deptFocused ? "border-[rgba(200,135,58,0.6)] shadow-sm" : "border-[#d9d9d9]"
              }`}>
                <div className="flex-1 min-w-0">
                  {(locStatus === "granted" || locStatus === "denied") && !deptFocused && !deptText ? (
                    <button
                      type="button"
                      className="w-full text-[20px] tracking-[-0.54px] font-normal leading-tight text-[#3e2722] text-left bg-transparent"
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
                      className="w-full text-[20px] tracking-[-0.54px] font-normal bg-transparent outline-none leading-tight placeholder:text-[#afafaf] text-[#3e2722]"
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
                    <img src={iconex} alt="초기화" className="w-[18px] h-[16px]" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* 목적지 */}
          <div className="flex flex-col items-start p-[8px] w-full">
            <form onSubmit={handleDestSubmit} className="w-full">
              <div className={`bg-[#fffbec] border-[1.883px] border-solid h-[65px] flex items-center px-[37.669px] rounded-[37.669px] w-full transition-colors ${
                destFocused ? "border-[rgba(200,135,58,0.6)] shadow-sm" : "border-[#d9d9d9]"
              }`}>
                <div className="flex-1 min-w-0">
                  <input
                    ref={destInputRef}
                    type="text"
                    value={destText}
                    onChange={e => setDestText(e.target.value)}
                    onFocus={handleDestFocus}
                    placeholder="어디로 가시나요?"
                    className="w-full text-[20px] tracking-[-0.54px] font-normal bg-transparent outline-none leading-tight placeholder:text-[#afafaf] text-[#3e2722]"
                    autoFocus={destFocused}
                  />
                </div>
                {!destFocused && <img src={iconSearchNew} alt="" className="w-[25.188px] h-[25.188px] shrink-0 opacity-60" />}
                {destFocused && (
                  <button type="button" onClick={handleCancel} className="shrink-0 ml-2 hover:opacity-70 transition-opacity">
                    <img src={iconex} alt="취소" className="w-[20.221px] h-[18.184px]" />
                  </button>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
