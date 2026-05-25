import { useState, useRef } from "react";

import iconGPS       from "@/assets/icon-gps.svg";
import iconSearchNew from "@/assets/icon-search-new.svg";
import iconRoute     from "@/assets/icon-route.svg";
import iconAll       from "@/assets/icon-all.svg";
import iconDrink     from "@/assets/icon-drink.svg";
import iconFood      from "@/assets/icon-food.svg";
import iconRest      from "@/assets/icon-rest.svg";
import iconShop      from "@/assets/icon-shop.svg";
import iconView      from "@/assets/icon-view.svg";
import iconHeart     from "@/assets/icon-heart.svg";
import imgPlace      from "@/assets/img-place.jpg";

const CATEGORIES = [
  { label: "전체", icon: iconAll },
  { label: "한 잔", icon: iconDrink },
  { label: "한 입", icon: iconFood },
  { label: "한 숨", icon: iconRest },
  { label: "한 손", icon: iconShop },
  { label: "한 눈", icon: iconView },
];

const CAT_ICON = {
  "한 잔": iconDrink,
  "한 입": iconFood,
  "한 숨": iconRest,
  "한 손": iconShop,
  "한 눈": iconView,
};

function HoursLabel({ place }) {
  const s = { fontFamily: "'Noto Serif KR', serif", fontWeight: 300 };
  if (place.isOpen) {
    if (!place.closeTime)
      return <span style={s} className="text-[7.714px] text-[#6a8042]">상시 개방</span>;
    return <span style={s} className="text-[7.714px] text-[#6a8042]">{`영업 중 (${place.closeTime}에 종료)`}</span>;
  }
  if (!place.openTime)
    return <span style={s} className="text-[7.714px] text-[#c82b2b]">영업 종료</span>;
  return <span style={s} className="text-[7.714px] text-[#c82b2b]">{`영업 종료 (${place.openTime}에 시작)`}</span>;
}

export default function Sidebar20({
  locStatus, recs, activeCategory, recsState, selectedPlace, sidebarOpen,
  onCategoryChange, onPlaceSelect, onSidebarToggle, onRecalibrate,
  onRecsHide, onRecsShow, onDestinationSelect, onDestinationClear,
}) {
  const [destText, setDestText]           = useState("");
  const [destFocused, setDestFocused]     = useState(false);
  const [deptText, setDeptText]           = useState("");
  const [deptFocused, setDeptFocused]     = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isSearching, setIsSearching]     = useState(false);

  const destInputRef = useRef(null);
  const deptInputRef = useRef(null);

  const granted       = locStatus === "granted";
  const showRecs      = granted && recsState !== "hidden";
  const overlayFading = recsState === "fading";
  const showResults   = searchResults.length > 0;
  const isSearchMode  = destFocused || deptFocused;

  const handleDestFocus = () => { setDestFocused(true); onRecsHide(); };
  const handleDeptFocus = () => { setDeptFocused(true); onRecsHide(); };

  const handleCancel = () => {
    setDestText(""); setDeptText("");
    setDestFocused(false); setDeptFocused(false);
    setSearchResults([]); setSelectedResult(null);
    onRecsShow(); onDestinationClear?.();
  };

  const handleDestSubmit = (e) => {
    e?.preventDefault();
    if (!destText.trim() || !window.kakao?.maps?.services) return;
    setIsSearching(true);
    new window.kakao.maps.services.Places().keywordSearch(destText, (results, status) => {
      setIsSearching(false);
      setSearchResults(
        status === window.kakao.maps.services.Status.OK ? results.slice(0, 5) : []
      );
    });
  };

  const handleDeptSubmit  = (e) => e?.preventDefault();
  const handleResultClick = (result) => {
    setSelectedResult(result);
    setDestText(result.place_name);
    onDestinationSelect?.(result);
  };

  return (
    <aside
      className="absolute top-[34px] left-[36px] w-[492px] h-[1091px] overflow-visible z-10 transition-transform duration-300 ease-in-out drop-shadow-[0px_4px_5px_rgba(0,0,0,0.25)]"
      style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(calc(-100% - 36px))" }}
    >
      {/* ── 패널 본체 ── */}
      <div className="absolute inset-0 bg-[#fdfdfd] rounded-[30px] overflow-hidden">

        {/* 노란 헤더 배경 */}
        <div className="absolute top-0 left-0 right-0 h-[359px] bg-[#ffeda1] rounded-tl-[30px] rounded-tr-[30px]" />

        {/* ── 내부 프레임 (auto-layout: flex-col gap-65) ── */}
        <div className="absolute left-[24px] top-[41px] w-[447px] flex flex-col gap-[65px] items-start">

          {/* ── 상단 섹션 (gap-25) ── */}
          <div className="flex flex-col gap-[25px] items-start w-full">

            {/* 검색 영역 (gap-32) */}
            <div className="flex flex-col gap-[32px] items-center w-[430px]">

              {/* 경로 아이콘 + 인풋 행 (gap-18) */}
              <div className="flex gap-[18px] items-center w-full">

                {/* 경로 인디케이터 */}
                <div className="h-[91px] w-[24px] shrink-0 flex flex-col items-center">
                  <div className="w-[12px] h-[12px] rounded-full bg-[#ed7a13] border-[2px] border-white shadow shrink-0" />
                  <div className="w-[2px] flex-1 bg-[#8b7e6a] opacity-30 my-[5px]" />
                  <div className="w-[10px] h-[10px] rounded-full border-[2px] border-[#3e2722] bg-white shrink-0" />
                </div>

                {/* 인풋 컬럼 */}
                <div className="flex flex-col items-center w-[388px]">

                  {/* 출발지 인풋 wrapper (p-8) */}
                  <div className="p-[8px] w-full">
                    <form onSubmit={handleDeptSubmit} className="relative w-full">
                      <div className="bg-[#fffbec] border-[1.883px] border-[#d9d9d9] border-solid h-[65px] flex items-center gap-[15.068px] px-[37.669px] py-[16.951px] rounded-[37.669px] w-full">
                        {granted && !deptFocused ? (
                          <button type="button" onClick={handleDeptFocus}
                            className="flex-1 text-[20px] text-[#3e2722] text-left bg-transparent outline-none tracking-[-0.54px]"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}>
                            {deptText || "현재 위치"}
                          </button>
                        ) : (
                          <input ref={deptInputRef} type="text"
                            value={deptText} onChange={e => setDeptText(e.target.value)}
                            onFocus={handleDeptFocus}
                            placeholder={granted ? "현재 위치" : locStatus === "pending" ? "위치 확인 중…" : "출발지를 입력하세요"}
                            className="flex-1 text-[20px] text-[#3e2722] placeholder:text-[#afafaf] bg-transparent outline-none tracking-[-0.54px]"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                            autoFocus={deptFocused}
                          />
                        )}
                      </div>
                      {/* 검색 아이콘 (absolute) */}
                      <div className="absolute overflow-clip size-[25.188px] right-[16px] top-[50%] -translate-y-1/2 pointer-events-none">
                        <img src={iconSearchNew} alt="" className="absolute block inset-0 w-full h-full" />
                      </div>
                    </form>
                  </div>

                  {/* 목적지 인풋 wrapper (px-29 py-19) */}
                  <div className="relative px-[29px] py-[19px] w-[372px] h-[64.973px] shrink-0">
                    <form onSubmit={handleDestSubmit}
                      className="absolute inset-0 w-[372px] h-[64.973px]">
                      <div className={`w-full h-full bg-[#fffbec] border-[1.883px] border-solid flex items-center px-[37.669px] py-[16.951px] rounded-[37.669px] transition-colors ${
                        destFocused ? "border-[#ed7a13]" : "border-[#d9d9d9]"
                      }`}>
                        <input ref={destInputRef} type="text"
                          value={destText} onChange={e => setDestText(e.target.value)}
                          onFocus={handleDestFocus}
                          placeholder="어디로 가시나요?"
                          className="flex-1 text-[20px] text-[#3e2722] placeholder:text-[#afafaf] bg-transparent outline-none tracking-[-0.54px]"
                          style={{ fontFamily: "'Pretendard', sans-serif" }}
                        />
                        {destText ? (
                          <div className="flex items-center gap-[8px] shrink-0">
                            <button type="button" onClick={() => setDestText("")}
                              className="text-[#afafaf] text-[11px] hover:text-[#3e2722]">✕</button>
                            <button type="submit"
                              className="text-[11px] font-medium text-[#ed7a13] bg-[rgba(237,122,19,0.1)] px-[10px] py-[4px] rounded-full"
                              style={{ fontFamily: "'Pretendard', sans-serif" }}>검색</button>
                          </div>
                        ) : (
                          <img src={iconSearchNew} alt="" className="w-[25.188px] h-[25.188px] shrink-0" />
                        )}
                      </div>
                    </form>
                  </div>

                </div>
              </div>

              {/* 취소 버튼 */}
              {isSearchMode && (
                <button onClick={handleCancel}
                  className="text-[12px] text-[#8b7e6a] hover:text-[#3e2722] transition-colors self-start"
                  style={{ fontFamily: "'Pretendard', sans-serif" }}>
                  취소
                </button>
              )}

              {/* 구분선 */}
              <div className="h-px w-[423px] bg-[rgba(0,0,0,0.1)]" />
            </div>

            {/* 안내 텍스트 + 카테고리 탭 (gap-15) */}
            {!showResults && (
              <div className="flex flex-col gap-[15px] items-start w-full">
                <p className="text-[15px] text-black leading-[1.334] tracking-[-0.405px] w-full"
                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300 }}>
                  가는길에 잠시 들러 보세요
                </p>

                {/* 카테고리 탭 */}
                {granted && showRecs && (
                  <div className="flex gap-[7px] items-center w-full">
                    {CATEGORIES.map(({ label, icon }) => (
                      <button key={label} onClick={() => onCategoryChange(label)}
                        className={`flex items-center gap-[7.069px] h-[31.813px] justify-center p-[7.069px] whitespace-nowrap transition-colors shrink-0 w-[70.695px] ${
                          activeCategory === label
                            ? "bg-[#ed7a13] text-white rounded-[75.338px]"
                            : "bg-[#fdfdfd] text-[#3e2722] rounded-[35.347px]"
                        }`}
                        style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "12.372px" }}>
                        <img src={icon} alt="" className="w-[13.255px] h-[13.255px] shrink-0" />
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── 카드 목록 / 검색 결과 ── */}

          {/* 검색 결과 */}
          {showResults && (
            <div className="flex flex-col gap-[8px] items-start w-[440px] max-h-[600px] overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center w-full py-8">
                  <p className="text-[14px] text-[#8b7e6a]" style={{ fontFamily: "'Pretendard', sans-serif" }}>검색 중...</p>
                </div>
              ) : searchResults.map(result => (
                <button key={result.id} onClick={() => handleResultClick(result)}
                  className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] text-left rounded-[20px] transition-colors ${
                    selectedResult?.id === result.id
                      ? "bg-[rgba(237,122,19,0.1)]"
                      : "bg-[#fdfdfd] border border-[rgba(175,175,175,0.3)] hover:bg-[#fff9f0]"
                  }`}>
                  <div className="w-7 h-7 rounded-full bg-[rgba(237,122,19,0.1)] flex items-center justify-center shrink-0">
                    <img src={iconGPS} alt="" className="w-[13px] h-[13px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#3e2722] truncate" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                      {result.place_name}
                    </p>
                    <p className="text-[11px] text-[#8b7e6a] truncate" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                      {result.road_address_name || result.address_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 추천 장소 목록 (gap-15, w-440, 스크롤) */}
          {!showResults && granted && showRecs && (
            <div className={`flex flex-col gap-[15px] items-start w-[440px] max-h-[580px] overflow-y-auto ${overlayFading ? "fade-out" : "fade-in"}`}>
              {recs.map(place => (
                <div key={place.id}
                  onClick={() => onPlaceSelect(selectedPlace?.id === place.id ? null : place)}
                  className="flex flex-col items-start p-[8px] w-full shrink-0 cursor-pointer">
                  <div className={`bg-[#fdfdfd] border-[1.286px] border-solid flex flex-col h-[127px] items-start pb-[9px] pt-[14px] px-[16px] rounded-[25.714px] w-full transition-all ${
                    selectedPlace?.id === place.id
                      ? "border-[#ed7a13] shadow-sm"
                      : "border-[rgba(175,175,175,0.5)]"
                  }`}>

                    {/* 카드 내부 행 */}
                    <div className="flex gap-[116px] items-start w-full">

                      {/* 왼쪽: 이미지 + 텍스트 */}
                      <div className="flex gap-[6px] items-start shrink-0">
                        {/* 이미지 */}
                        <div className="shrink-0 size-[80.286px] rounded-[10px] overflow-hidden">
                          <img src={imgPlace} alt={place.name} className="w-full h-full object-cover" />
                        </div>

                        {/* 텍스트 컬럼 (gap-10) */}
                        <div className="flex flex-col gap-[10px] items-start w-[170.287px]">

                          {/* 상단 텍스트 (gap-11) */}
                          <div className="flex flex-col gap-[11px] items-start w-full">

                            {/* 그리드: 이름+배지 / 도보+영업 */}
                            <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-[12px] gap-y-[7px] w-full">
                              {/* 이름 + 배지 (col-1, row-1) */}
                              <div className="col-start-1 row-start-1 flex items-center">
                                <div className="flex items-center justify-between w-[110.428px]">
                                  <p className="text-[12.857px] text-[#3e2722] leading-[1.334] font-semibold whitespace-nowrap"
                                    style={{ fontFamily: "'Pretendard', sans-serif" }}>
                                    {place.name}
                                  </p>
                                  <div className="bg-[#ed7a13] flex items-center gap-[3.675px] h-[16.512px] justify-center p-[3.675px] rounded-[14.293px] w-[37.286px] shrink-0">
                                    <img src={CAT_ICON[place.category] || iconAll} alt="" className="w-[6.89px] h-[6.89px]" />
                                    <p className="text-[6.43px] text-white whitespace-nowrap"
                                      style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 500 }}>
                                      {place.category}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* 도보 (col-1, row-2) */}
                              <div className="col-start-1 row-start-2 flex items-center justify-center">
                                <p className="text-[7.714px] text-[#3e2722] whitespace-nowrap"
                                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300 }}>
                                  내 위치로부터 도보 {place.walkMin}분
                                </p>
                              </div>
                              {/* 영업 상태 (col-2, row-2) */}
                              <div className="col-start-2 row-start-2 flex items-center">
                                <HoursLabel place={place} />
                              </div>
                            </div>

                            {/* 설명 */}
                            <div className="flex items-center justify-center">
                              <p className="text-[9px] text-[#3e2722] whitespace-nowrap leading-[1.334]"
                                style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300 }}>
                                {place.desc}
                              </p>
                            </div>
                          </div>

                          {/* 태그 (gap-4) */}
                          <div className="flex gap-[4px] items-center">
                            {place.tags.map(tag => (
                              <div key={tag} className="bg-[#fff2b9] flex items-center justify-center px-[6.429px] py-[3.857px] rounded-[12.857px]">
                                <p className="text-[6.429px] text-[#3e2722] whitespace-nowrap"
                                  style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300 }}>
                                  {tag}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 하트 아이콘 */}
                      <div className="overflow-clip shrink-0 size-[19px]">
                        <button className="absolute h-[13.705px] left-[1.63px] top-[2.65px] w-[15.74px]"
                          onClick={e => e.stopPropagation()}>
                          <img src={iconHeart} alt="저장" className="absolute block inset-0 w-full h-full" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 위치 거부 안내 */}
          {!showResults && locStatus === "denied" && (
            <div className="flex flex-col items-center gap-3 w-full py-8">
              <div className="w-10 h-10 rounded-full bg-[rgba(237,122,19,0.08)] flex items-center justify-center">
                <img src={iconGPS} alt="" className="w-4 h-4 opacity-30" />
              </div>
              <p className="text-[14px] text-[#8b7e6a] text-center leading-relaxed"
                style={{ fontFamily: "'Pretendard', sans-serif" }}>
                위치 정보를 허용하면<br />주변 추천 장소를 볼 수 있어요
              </p>
              <button onClick={onRecalibrate}
                className="text-[12px] text-[#ed7a13] border border-[rgba(237,122,19,0.3)] px-4 py-1.5 rounded-full hover:bg-[rgba(237,122,19,0.05)] transition-colors"
                style={{ fontFamily: "'Pretendard', sans-serif" }}>
                위치 허용하기
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── 열기/닫기 탭 ── */}
      <button onClick={onSidebarToggle}
        className="absolute top-1/2 -translate-y-1/2 -right-[22px] w-[22px] h-14 bg-white border border-l-0 border-[#f3f4f6] rounded-r-xl shadow-[2px_0px_6px_rgba(0,0,0,0.07)] flex items-center justify-center hover:bg-[#faf6f0] transition-colors z-10">
        <span className="text-[#8b7e6a] text-[11px] select-none">
          {sidebarOpen ? "‹" : "›"}
        </span>
      </button>
    </aside>
  );
}
