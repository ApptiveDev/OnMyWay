import iconSearchNew from "@/assets/icon-search-new.svg";
import iconex        from "@/assets/icon-ex.svg";

export default function RouteInputSection({
  locStatus,
  destText, setDestText, destFocused,
  deptText, setDeptText, deptFocused,
  destInputRef, deptInputRef,
  handleDestFocus, handleDeptFocus, handleCancel,
  handleDestSubmit, handleDeptSubmit,
}) {
  const granted = locStatus === "granted";

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
              <div className={`bg-[#fffbec] border-[1.883px] border-solid h-[65px] flex items-center gap-[15.068px] pl-[37.67px] rounded-[37.669px] ${
                deptFocused ? "border-[rgba(200,135,58,0.6)] shadow-sm" : "border-[#d9d9d9]"
              }`}>
                <div className="flex-1 min-w-0">
                  {granted && !deptFocused ? (
                    <button
                      type="button"
                      className="font-['Pretendard'] text-[20px] font-normal leading-[133.4%] tracking-[-0.54px] text-[#3e2722] text-left w-full"
                      onClick={handleDeptFocus}
                    >
                      부산대학교
                    </button>
                  ) : (
                    <input
                      ref={deptInputRef}
                      type="text"
                      value={deptText}
                      onChange={e => setDeptText(e.target.value)}
                      onFocus={handleDeptFocus}
                      placeholder={granted ? "현재 위치" : locStatus === "pending" ? "위치 확인 중…" : "출발지를 입력하세요"}
                      className="w-full text-[20px] tracking-[-0.54px] font-normal bg-transparent outline-none leading-tight placeholder:text-[#afafaf] text-[#3e2722] [font-family:'Pretendard']"
                      autoFocus={deptFocused}
                    />
                  )}
                </div>
                {deptFocused && deptText && (
                  <button type="button" onClick={() => setDeptText("")} className="shrink-0 text-[#8b7e6a] text-[11px] hover:text-[#2c2417]">✕</button>
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
                    className="w-full text-[20px] tracking-[-0.54px] font-normal bg-transparent outline-none leading-tight placeholder:text-[#afafaf] text-[#3e2722] [font-family:'Pretendard']"
                    autoFocus={destFocused}
                  />
                </div>
                {!destFocused && <img src={iconSearchNew} alt="" className="w-[25.188px] h-[25.188px] shrink-0 opacity-60" />}
                {destFocused && (
                  <button type="button" onClick={handleCancel} className="shrink-0 ml-2 hover:opacity-70 transition-opacity">
                    <img src={iconex} alt="취소" className="w-[20.221px] h-[18.184px]" />
                  </button>
                )}
                {destText && (
                  <button type="submit" className="ml-2 text-[13px] font-medium text-[#c8873a] bg-[rgba(200,135,58,0.1)] px-2.5 py-1 rounded-full shrink-0">검색</button>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
