import iconex from "@/assets/icon-ex.svg";

export default function RouteInputSection({
  locStatus,
  destText, setDestText, destFocused,
  deptText, setDeptText, deptFocused,
  destInputRef, deptInputRef,
  handleDestFocus, handleDeptFocus, handleCancel,
  handleDestSubmit, handleDeptSubmit,
  pinMode, onExitPinMode,
}) {
  const granted = locStatus === "granted";
  const isEditing = destFocused || deptFocused || pinMode;

  return (
    <div className="flex gap-[12px] items-start w-full">

      {/* 인디케이터: 출발(원형 링) - 점선 - 도착(핀) */}
      <div className="relative w-[13px] self-stretch shrink-0">
        <div className="absolute left-1/2 -translate-x-1/2 top-[16px] w-[12px] h-[12px] rounded-full border-[3px] border-[#ED7A13]" />
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[28px] w-[2px] h-[30px]"
          style={{
            backgroundImage: "linear-gradient(rgb(201,168,106) 50%, rgba(201,168,106,0) 0%)",
            backgroundSize: "100% 10px",
            backgroundRepeat: "repeat-y",
          }}
        />
        <div className="absolute left-1/2 -translate-x-1/2 top-[55px] flex items-center justify-center w-[18px] h-[18px]">
          <div className="w-[13px] h-[13px] bg-[#3e2722] rounded-tl-[6.5px] rounded-tr-[6.5px] rounded-br-[6.5px] rounded-bl-[2px] rotate-45" />
        </div>
      </div>

      {/* 입력 박스 */}
      <div className="flex-1 min-w-0 flex flex-col gap-[10px]">

        {/* 출발지 (현재 위치 / 출발지 변경) */}
        <form onSubmit={handleDeptSubmit} className="w-full">
          <div className={`bg-[#FFFDF2] h-[50px] flex items-center gap-[9px] px-[15px] rounded-[14px] ${
            deptFocused ? "border-2 border-[#ED7A13]" : "shadow-[inset_0_0_0_1px_rgba(62,39,34,0.06)]"
          }`}>
            {!deptFocused && <div className="w-[14px] h-[14px] rounded-full bg-[#6A8042] shrink-0" />}
            {granted && !deptFocused ? (
              <button
                type="button"
                onClick={handleDeptFocus}
                className="flex-1 min-w-0 text-left font-['Pretendard'] font-bold text-[15.5px] text-[#3e2722] truncate"
              >
                {deptText || "부산대학교"}
              </button>
            ) : (
              <input
                ref={deptInputRef}
                type="text"
                value={deptText}
                onChange={e => setDeptText(e.target.value)}
                onFocus={handleDeptFocus}
                placeholder={granted ? "현재 위치" : locStatus === "pending" ? "위치 확인 중…" : "출발지를 입력하세요"}
                className="flex-1 min-w-0 font-['Pretendard'] font-bold text-[15.5px] text-[#3e2722] bg-transparent outline-none placeholder:font-normal placeholder:text-[#afafaf]"
                autoFocus={deptFocused}
              />
            )}
            {granted && !deptFocused && !deptText && (
              <span className="shrink-0 font-['MaruBuriOTF'] text-[12px] text-[#9a8e84]">내 위치</span>
            )}
            {deptFocused && (
              <>
                <div className="w-px h-[18px] bg-[#ED7A13] shrink-0" />
                <span className="shrink-0 font-['MaruBuriOTF'] text-[12px] text-[#B07A52] whitespace-nowrap">출발지 변경</span>
              </>
            )}
          </div>
        </form>

        {/* 목적지: 지도 핀 지정 중 / 출발지 편집 중엔 선택된 값만 표시, 아니면 검색 입력 */}
        {pinMode ? (
          <button
            type="button"
            onClick={onExitPinMode}
            className="w-full bg-[#FFF7E0] border-2 border-[#ED7A13] h-[50px] flex items-center gap-[9px] px-[17px] rounded-[14px] text-left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="#ED7A13" strokeWidth="1.7" />
              <circle cx="12" cy="10" r="2.4" stroke="#ED7A13" strokeWidth="1.7" />
            </svg>
            <span className="flex-1 min-w-0 font-['MaruBuriOTF'] text-[14.5px] text-[#B8843F] truncate">
              지도에서 위치 지정 중…
            </span>
          </button>
        ) : deptFocused ? (
          <div className="bg-[#FFFDF2] h-[50px] flex items-center gap-[9px] px-[15px] rounded-[14px] shadow-[inset_0_0_0_1px_rgba(62,39,34,0.06)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="#8b7e6a" strokeWidth="1.7" />
              <circle cx="12" cy="10" r="2.4" stroke="#8b7e6a" strokeWidth="1.7" />
            </svg>
            <p className={`flex-1 min-w-0 font-['Pretendard'] font-bold text-[15px] truncate ${destText ? "text-[#3e2722]" : "text-[#b3a892] font-normal"}`}>
              {destText || "어디로 가시나요?"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleDestSubmit} className="w-full">
            <div className="bg-[#FFFDF2] border-2 border-[#ED7A13] h-[50px] flex items-center gap-[9px] px-[17px] rounded-[14px]">
              <div className="w-[2px] h-[18px] bg-[#ED7A13] shrink-0" />
              <input
                ref={destInputRef}
                type="text"
                value={destText}
                onChange={e => setDestText(e.target.value)}
                onFocus={handleDestFocus}
                placeholder="어디로 가시나요?"
                className="flex-1 min-w-0 font-['MaruBuriOTF'] text-[15.5px] text-[#3e2722] bg-transparent outline-none placeholder:text-[#b3a892]"
                autoFocus={destFocused}
              />
              {destFocused && (
                <button type="button" onClick={handleCancel} className="shrink-0 ml-1 hover:opacity-70 transition-opacity">
                  <img src={iconex} alt="취소" className="w-[16px] h-[15px]" />
                </button>
              )}
              {destText && (
                <button type="submit" className="ml-1 text-[12px] font-medium text-[#c8873a] bg-[rgba(200,135,58,0.1)] px-2 py-1 rounded-full shrink-0">검색</button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* 출발/도착 스왑 — 검색 중(입력 포커스)일 땐 숨김. 디자인 자리만, 기능 연결은 추후 */}
      {!isEditing && (
        <div className="self-stretch flex flex-col items-center justify-center shrink-0">
          <button
            type="button"
            className="w-[34px] h-[34px] rounded-[10px] bg-[#FFFDF2] shadow-[inset_0_0_0_1px_rgba(62,39,34,0.08)] flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 4v15M7 19l-3-3M7 19l3-3M17 20V5M17 5l-3 3M17 5l3 3" stroke="#ED7A13" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
