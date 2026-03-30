import { useState, useRef, useEffect } from "react";

import iconGPS            from "@/assets/icon-gps.svg";
import iconCurrentLocation from "@/assets/icon-current-location.svg";
import iconArrow     from "@/assets/icon-arrow.svg";
import iconSearch    from "@/assets/icon-search.svg";
import iconSearchNew from "@/assets/icon-search-new.svg";
import iconAll    from "@/assets/icon-all.svg";
import iconDrink  from "@/assets/icon-drink.svg";
import iconFood   from "@/assets/icon-food.svg";
import iconRest   from "@/assets/icon-rest.svg";
import iconShop   from "@/assets/icon-shop.svg";
import iconView   from "@/assets/icon-view.svg";
import iconHeart  from "@/assets/icon-heart.svg";
import imgPlace   from "@/assets/img-place.jpg";

const CATEGORIES = [
  { label: "전체", icon: iconAll },
  { label: "한 잔", icon: iconDrink },
  { label: "한 입", icon: iconFood },
  { label: "한 숨", icon: iconRest },
  { label: "한 손", icon: iconShop },
  { label: "한 눈", icon: iconView },
];

function HoursLabel({ place }) {
  if (place.isOpen) {
    if (!place.closeTime) return <span className="text-[6.9px] font-light text-[#2b8237]">상시 개방</span>;
    return <span className="text-[6.9px] font-light text-[#2b8237]">영업 중 · {place.closeTime}에 종료</span>;
  }
  if (!place.openTime) return <span className="text-[6.9px] font-light text-[#c82b2b]">영업 종료</span>;
  return <span className="text-[6.9px] font-light text-[#c82b2b]">영업 종료 · {place.openTime}에 시작</span>;
}

/**
 * Props
 * ─────
 * locStatus       : "pending" | "granted" | "denied"
 * recs            : 추천 장소 배열
 * activeCategory  : 현재 선택된 카테고리
 * recsState       : "visible" | "fading" | "hidden"
 * selectedPlace   : 현재 선택된 장소 객체 | null
 * sidebarOpen     : boolean
 *
 * onCategoryChange(label)   : 카테고리 변경
 * onPlaceSelect(place|null) : 장소 선택/해제
 * onSidebarToggle()         : 사이드바 열기/닫기
 * onRecalibrate()           : 위치 보정
 * onRecsHide()              : 추천 목록 숨기기 (검색 포커스 시)
 * onRecsShow()              : 추천 목록 다시 보이기 (검색 취소 시)
 * onSearchSubmit(query)     : 검색어 제출 → TODO: 백엔드 API 연결
 */
export default function Sidebar20({
  locStatus,
  recs,
  activeCategory,
  recsState,
  selectedPlace,
  sidebarOpen,
  onCategoryChange,
  onPlaceSelect,
  onSidebarToggle,
  onRecalibrate,
  onRecsHide,
  onRecsShow,
  onDestinationSelect,
  onDestinationClear,
}) {
  const [destText, setDestText]         = useState("");
  const [destFocused, setDestFocused]   = useState(false);
  const [deptText, setDeptText]         = useState("");
  const [deptFocused, setDeptFocused]   = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isSearching, setIsSearching]   = useState(false);

  const destInputRef = useRef(null);
  const deptInputRef = useRef(null);

  const granted       = locStatus === "granted";
  const showRecs      = granted && recsState !== "hidden";
  const overlayFading = recsState === "fading";
  const showResults   = searchResults.length > 0;

  const handleDestFocus = () => {
    setDestFocused(true);
    onRecsHide();
  };

  const handleDeptFocus = () => {
    setDeptFocused(true);
    onRecsHide();
  };

  const handleCancel = () => {
    setDestText("");
    setDeptText("");
    setDestFocused(false);
    setDeptFocused(false);
    setSearchResults([]);
    setSelectedResult(null);
    onRecsShow();
    onDestinationClear?.();
  };

  // 카카오 장소 검색
  const handleDestSubmit = (e) => {
    e?.preventDefault();
    if (!destText.trim() || !window.kakao?.maps?.services) return;
    setIsSearching(true);
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(destText, (results, status) => {
      setIsSearching(false);
      if (status === window.kakao.maps.services.Status.OK) {
        setSearchResults(results.slice(0, 5));
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleDeptSubmit = (e) => {
    e?.preventDefault();
  };

  // 검색 결과 선택 → 지도 이동
  const handleResultClick = (result) => {
    setSelectedResult(result);
    setDestText(result.place_name);
    onDestinationSelect?.(result);
  };

  const isSearchMode = destFocused || deptFocused;

  return (
    <>
      {/* ── 위치 보정 버튼 (사이드바 바로 옆) ── */}
      <button
        onClick={onRecalibrate}
        className="absolute top-[10px] w-8 h-8 bg-white rounded-full border border-[#f3f4f6] shadow flex items-center justify-center hover:shadow-md transition-all duration-300 z-20"
        style={{ left: sidebarOpen ? "320px" : "-40px" }}
        title="현재 위치 보정"
      >
        <img src={iconGPS} alt="위치 보정" className="w-3.5 h-3.5" />
      </button>

      {/* ── 사이드바 ── */}
      <aside
        className="absolute top-[10px] left-4 w-[301px] h-[694px] bg-white border border-[#f3f4f6] rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-visible flex flex-col z-10 transition-transform duration-300 ease-in-out"
        style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(calc(-100% - 16px))" }}
      >
        {/* 열기/닫기 탭 */}
        <button
          onClick={onSidebarToggle}
          className="absolute top-1/2 -translate-y-1/2 -right-[22px] w-[22px] h-14 bg-white border border-l-0 border-[#f3f4f6] rounded-r-xl shadow-[2px_0px_6px_rgba(0,0,0,0.07)] flex items-center justify-center hover:bg-[#faf6f0] transition-colors z-10"
        >
          <span className="text-[#8b7e6a] text-[11px] select-none">
            {sidebarOpen ? "‹" : "›"}
          </span>
        </button>

        {/* 내부 콘텐츠 */}
        <div className="flex flex-col flex-1 overflow-hidden rounded-2xl">

          {/* ── 출발지 ── */}
          <div className="px-4 pt-4 pb-0 shrink-0">
            <form onSubmit={handleDeptSubmit}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-[14px] transition-colors ${
                deptFocused
                  ? "bg-white border border-[rgba(200,135,58,0.4)] shadow-sm"
                  : "bg-[rgba(245,240,232,0.6)]"
              }`}>
                <img
                  src={iconCurrentLocation}
                  alt=""
                  className={`w-[15px] h-[15px] shrink-0 transition-opacity ${!granted ? "opacity-30" : ""}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11.2px] font-light text-[#8b7e6a] leading-tight mb-0.5">출발지</p>
                  {granted && !deptFocused ? (
                    // 위치 허용 상태 + 포커스 아닐 때: "현재 위치" 텍스트 버튼
                    <button
                      type="button"
                      className="text-[14px] font-medium text-[#c8873a] leading-tight text-left w-full"
                      onClick={handleDeptFocus}
                    >
                      현재 위치
                    </button>
                  ) : (
                    <input
                      ref={deptInputRef}
                      type="text"
                      value={deptText}
                      onChange={e => setDeptText(e.target.value)}
                      onFocus={handleDeptFocus}
                      placeholder={granted ? "현재 위치" : locStatus === "pending" ? "위치 확인 중…" : "출발지를 입력하세요"}
                      className={`w-full text-[14px] font-light bg-transparent outline-none leading-tight placeholder:text-[rgba(44,36,23,0.3)] ${
                        granted && !deptText ? "text-[#c8873a]" : "text-[#2c2417]"
                      }`}
                      autoFocus={deptFocused}
                    />
                  )}
                </div>
                {deptFocused && deptText && (
                  <button
                    type="button"
                    onClick={() => setDeptText("")}
                    className="shrink-0 text-[#8b7e6a] text-[11px] hover:text-[#2c2417]"
                  >
                    ✕
                  </button>
                )}
                {!deptFocused && (
                  <img src={iconArrow} alt="" className="w-[14px] h-[14px] shrink-0" />
                )}
              </div>
            </form>

            <div className="flex items-center gap-3 px-3 my-3">
              <div className="flex-1 h-px bg-[#f3f4f6]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[rgba(200,135,58,0.3)]" />
              <div className="flex-1 h-px bg-[#f3f4f6]" />
            </div>
          </div>

          {/* ── 목적지 검색 ── */}
          <div className="px-4 pb-3 shrink-0">
            <form onSubmit={handleDestSubmit} className="relative">

              {/* 기본 상태 (28:2103) */}
              {!destFocused && !destText && (
                <div className="bg-[#f5f0e8] rounded-[14px] h-[53px] relative overflow-hidden">
                  <img
                    src={iconSearchNew}
                    alt=""
                    className="absolute w-[17px] h-[17px] pointer-events-none"
                    style={{ left: 16, top: 18 }}
                  />
                  <input
                    ref={destInputRef}
                    type="text"
                    value={destText}
                    onChange={e => setDestText(e.target.value)}
                    onFocus={handleDestFocus}
                    placeholder="어디로 가시나요?"
                    className="absolute bg-transparent outline-none text-[15.2px] text-[#2c2417] placeholder:text-[rgba(139,126,106,0.5)] w-[calc(100%-40px)]"
                    style={{ left: 40, top: 17 }}
                  />
                </div>
              )}

              {/* 검색 중 상태 (28:2131) */}
              {(destFocused || destText) && (
                <div className="bg-[#f5f0e8] rounded-[14px] flex items-center px-[40px] py-[12px] relative">
                  <img
                    src={iconCurrentLocation}
                    alt=""
                    className="absolute left-[16px] w-[17px] h-[17px] pointer-events-none"
                  />
                  <input
                    ref={destInputRef}
                    type="text"
                    value={destText}
                    onChange={e => setDestText(e.target.value)}
                    onFocus={handleDestFocus}
                    placeholder="어디로 가시나요?"
                    className="flex-1 bg-transparent outline-none text-[14.08px] text-[#2c2417] placeholder:text-[rgba(139,126,106,0.5)] min-w-0"
                    autoFocus
                  />
                  {destText && (
                    <>
                      <button
                        type="button"
                        onClick={() => setDestText("")}
                        className="w-6 h-6 rounded-full bg-[#e0d8cc] flex items-center justify-center shrink-0 ml-2"
                      >
                        <span className="text-[#8b7e6a] text-[10px]">✕</span>
                      </button>
                      <button
                        type="submit"
                        className="ml-2 text-[10px] font-medium text-[#c8873a] bg-[rgba(200,135,58,0.1)] px-2.5 py-1 rounded-full shrink-0"
                      >
                        검색
                      </button>
                    </>
                  )}
                </div>
              )}

            </form>

            {/* 취소 버튼 */}
            {isSearchMode && (
              <button
                onClick={handleCancel}
                className="mt-2 w-full text-center text-[10.8px] text-[#8b7e6a] hover:text-[#2c2417] transition-colors"
              >
                취소
              </button>
            )}
          </div>

          {/* ── 카카오 장소 검색 결과 ── */}
          {showResults && (
            <div className="flex flex-col flex-1 overflow-hidden border-t border-[#f3f4f6]">
              <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                  <div className="flex items-center justify-center h-16">
                    <p className="text-[11.2px] font-light text-[#8b7e6a]">검색 중...</p>
                  </div>
                ) : (
                  searchResults.map((result, idx) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full flex items-center gap-3 px-4 py-[10px] text-left transition-colors ${
                        selectedResult?.id === result.id
                          ? "bg-[rgba(232,195,106,0.2)] rounded-[12px]"
                          : "border-b border-[#f9fafb] hover:bg-[#faf6f0]"
                      }`}
                    >
                      <div className="w-7 h-7 rounded-[10px] bg-[rgba(200,135,58,0.1)] flex items-center justify-center shrink-0">
                        <img src={iconGPS} alt="" className="w-[13px] h-[13px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.6px] font-medium text-[#2c2417] leading-[20.4px] truncate">
                          {result.place_name}
                        </p>
                        <p className="text-[11.2px] font-light text-[#8b7e6a] leading-[16.8px] truncate">
                          {result.road_address_name || result.address_name}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── 추천 섹션 ── */}
          {!showResults && granted && showRecs && (
            <div
              className={`flex flex-col flex-1 overflow-hidden ${overlayFading ? "fade-out" : "fade-in"}`}
            >
              <div className="px-4 pt-1 shrink-0">
                <p className="text-[8.9px] font-light text-[#2c2417]">
                  가는길에{" "}
                  <span className="font-medium text-[#c8873a]">잠시 들러보세요</span>
                </p>
              </div>

              {/* 카테고리 필터 */}
              <div className="px-[22px] pt-2 pb-2 flex items-center gap-[2px] shrink-0">
                {CATEGORIES.map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => onCategoryChange(label)}
                    className={`flex items-center gap-[4px] px-[8px] py-[5px] rounded-full text-[6.6px] font-medium transition-colors whitespace-nowrap ${
                      activeCategory === label
                        ? "bg-[#c8873a] text-white shadow-sm"
                        : "bg-white border border-[rgba(44,36,23,0.1)] text-[#8b7e6a] hover:bg-[#faf6f0]"
                    }`}
                  >
                    <img src={icon} alt="" className="w-[7.8px] h-[7.8px]" />
                    {label}
                  </button>
                ))}
              </div>

              {/* 장소 목록 */}
              <div className="flex-1 overflow-y-auto px-[14px] pb-3 flex flex-col gap-2">
                {recs.map(place => (
                  <div
                    key={place.id}
                    onClick={() => onPlaceSelect(selectedPlace?.id === place.id ? null : place)}
                    className={`flex gap-[7.4px] items-start border rounded-[9.9px] p-[8px] cursor-pointer transition-all ${
                      selectedPlace?.id === place.id
                        ? "bg-[rgba(200,135,58,0.05)] border-[rgba(200,135,58,0.3)] shadow-sm"
                        : "bg-white border-[#f3f4f6] hover:shadow-sm"
                    }`}
                  >
                    <div className="w-[39.5px] h-[39.5px] rounded-[8.6px] overflow-hidden shrink-0">
                      <img src={imgPlace} alt={place.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="text-[8.7px] font-medium text-[#2c2417] leading-tight truncate">
                            {place.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                            <span className="text-[6.9px] font-light text-[#8b7e6a]">{place.category}</span>
                            <span className="text-[9.9px] text-[rgba(139,126,106,0.3)] leading-none">·</span>
                            <span className="text-[6.9px] font-light text-[#8b7e6a]">도보 {place.walkMin}분</span>
                            <span className="text-[9.9px] text-[rgba(139,126,106,0.3)] leading-none">·</span>
                            <HoursLabel place={place} />
                          </div>
                        </div>
                        <button
                          className="shrink-0 ml-1 w-[17px] h-[17px] flex items-center justify-center"
                          onClick={e => e.stopPropagation()}
                        >
                          <img src={iconHeart} alt="저장" className="w-[8.6px] h-[8.6px]" />
                        </button>
                      </div>
                      <p className="text-[7.1px] font-light text-[#8b7e6a] mt-1 leading-relaxed line-clamp-1">
                        {place.desc}
                      </p>
                      <div className="flex gap-[2.5px] mt-1.5">
                        {place.tags.map(tag => (
                          <span key={tag} className="bg-[#f5f0e8] text-[#8b7e6a] text-[6.1px] font-normal px-[3.7px] py-[1.2px] rounded-[2.5px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 위치 거부 안내 */}
          {!showResults && locStatus === "denied" && (
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(139,126,106,0.08)] flex items-center justify-center">
                <img src={iconGPS} alt="" className="w-4 h-4 opacity-30" />
              </div>
              <p className="text-[11.2px] font-light text-[#8b7e6a] leading-relaxed">
                위치 정보를 허용하면<br />주변 추천 장소를 볼 수 있어요
              </p>
              <button
                onClick={onRecalibrate}
                className="text-[10.8px] text-[#c8873a] border border-[rgba(200,135,58,0.3)] px-4 py-1.5 rounded-full hover:bg-[rgba(200,135,58,0.05)] transition-colors"
              >
                위치 허용하기
              </button>
            </div>
          )}

        </div>
      </aside>
    </>
  );
}
