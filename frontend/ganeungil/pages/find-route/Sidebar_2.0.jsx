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
import iconAllActive   from "@/assets/icon-all-active.svg";
import iconDrinkActive from "@/assets/icon-drink-active.svg";
import iconFoodActive  from "@/assets/icon-food-active.svg";
import iconRestActive  from "@/assets/icon-rest-active.svg";
import iconShopActive  from "@/assets/icon-shop-active.svg";
import iconViewActive  from "@/assets/icon-view-active.svg";
import iconHeart  from "@/assets/icon-heart.svg";
import imgPlace   from "@/assets/img-place.jpg";
import iconex     from "@/assets/icon-ex.svg";

const CATEGORIES = [
  { label: "전체",  icon: iconAll,   iconActive: iconAllActive   },
  { label: "한 잔", icon: iconDrink, iconActive: iconDrinkActive },
  { label: "한 입", icon: iconFood,  iconActive: iconFoodActive  },
  { label: "한 판", icon: iconShop,  iconActive: iconShopActive  },
  { label: "한 눈", icon: iconView,  iconActive: iconViewActive  },
  { label: "한 끼", icon: iconFood,  iconActive: iconFoodActive  },
];

const fmt = (t) => t?.slice(0, 5) ?? null;

function HoursLabel({ place }) {
  if (place.isOpen) {
    if (!place.closeTime) return <span className="text-[7.714px] font-family:MaruburiOTF font-normal font-weight:300 text-[#6A8042]">영업 중</span>;
    return <span className="text-[7.714px] font-light text-[#6A8042]">영업 중 ({fmt(place.closeTime)}에 종료)</span>;
  }
  if (!place.openTime) return <span className="text-[7.714px] font-family:MaruburiOTF font-normal font-weight:300 text-[#c82b2b]">영업 종료</span>;
  return <span className="text-[7.714px] font-light text-[#c82b2b]">영업 종료 ({fmt(place.openTime)}에 시작)</span>;
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
        className="absolute top-[159px] w-8 h-8 bg-white rounded-full border border-[#f3f4f6] shadow flex items-center justify-center hover:shadow-md transition-all duration-300 z-20"
        style={{ left: sidebarOpen ? "380px" : "-40px" }}
        title="현재 위치 보정"
      >
        <img src={iconGPS} alt="위치 보정" className="w-3.5 h-3.5" />
      </button>

      {/* ── 사이드바 ── */}
      <aside
        className="absolute top-[34px] left-[36px] w-[492px] h-[1091px] flex-shrink-0 rounded-[30px] bg-[#FDFDFD] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)]"
        style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(calc(-100% - 16px))" }}
      >

        {/* 내부 콘텐츠 */}
        <div className="flex flex-col flex-1 w-[492px] h-[359px] rounded-t-[30px] rounded-b-[0px] overflow-hidden bg-[#FFEDA1]">

          <div className="flex-col gap-[40px] items-start self-stretch">

            {/* ── 출발지 + 목적지 — Figma 1024:254 ── */}
            <div className="flex gap-[18px] items-center w-full px-[18px] pt-[18px]">

              {/* 왼쪽: 출발/도착 인디케이터 — Figma: w-[24px] h-[91px] */}
              <div className="flex flex-col items-center w-[24px] h-[91px] shrink-0 py-[5px]">
                <div className="w-[14px] h-[14px] rounded-full bg-[#ED7A13] ring-2 ring-white" />
                <div className="flex-1 w-px border-l border-dashed border-[rgba(62,39,34,0.3)]" />
                <div className="w-[14px] h-[14px] rounded-full bg-[#3E2722] ring-2 ring-white" />
              </div>

              {/* 오른쪽: 입력 박스 컬럼 — Figma: flex flex-col items-center flex-1 */}
              <div className="flex flex-col items-center flex-1">

                {/* 출발지 — Figma: flex flex-col items-start p-[8px] w-full */}
                <div className="flex flex-col items-start p-[8px] w-full">
                  <form onSubmit={handleDeptSubmit} className="w-full">
                    <div className={`bg-[#fffbec] border-[1.883px] border-solid h-[65px] flex items-center gap-[15.068px] mt-[41px] pl-[37.67px] rounded-[37.669px] ${
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
                            className="w-full text-[20px] tracking-[-0.54px] font-normal bg-transparent outline-none leading-tight placeholder:text-[#afafaf] text-[#3e2722]"
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
                      <img src={iconSearchNew} alt="" className="w-[25.188px] h-[25.188px] shrink-0 opacity-60" />
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
                      {destText && (
                        <>
                          <button
                            type="button"
                            onClick={() => setDestText("")}
                            className="w-6 h-6 rounded-full bg-[#e0d8cc] flex items-center justify-center shrink-0 ml-2"
                          >
                            <span className="text-[#8b7e6a] text-[13px]">✕</span>
                          </button>
                          <button
                            type="submit"
                            className="ml-2 text-[13px] font-medium text-[#c8873a] bg-[rgba(200,135,58,0.1)] px-2.5 py-1 rounded-full shrink-0"
                          >
                            검색
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                  {/* 취소 버튼 */}
                  {isSearchMode && (
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center w-full mt-2 transition-opacity hover:opacity-70"
                    >
                      <img src={iconex} alt="취소" className="w-[20.221px] h-[18.184px]" />
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* 구분선 */}
            <div className="w-[423px] h-px bg-[#d9d9d9] mx-auto mt-[32px] shrink-0" />

            {/* ── 카카오 장소 검색 결과 ── */}
            {showResults && (
              <div className="flex flex-col flex-1 overflow-hidden border-t border-[#f3f4f6]">
                <div className="flex-1 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex items-center justify-center h-16">
                      <p className="text-[15px] font-light text-[#8b7e6a]">검색 중...</p>
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
                          <p className="text-[18px] font-medium text-[#2c2417] leading-[20.4px] truncate">
                            {result.place_name}
                          </p>
                          <p className="text-[15px] font-light text-[#8b7e6a] leading-[16.8px] truncate">
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
                <div className="px-4 pt-[25px] shrink-0">
                  <p className="text-[15px] font-normal text-[#000000] leading-[133.4%] tracking-[-0.405px] opacity-70">
                    가는길에{" "}
                    <span>잠시 들러 보세요</span>
                  </p>
                </div>

                {/* 카테고리 필터 */}
                <div className="px-[24px] pt-[15px] pb-2 flex items-center gap-[7px] shrink-0">
                  {CATEGORIES.map(({ label, icon, iconActive }) => {
                    const isActive = activeCategory === label;
                    return (
                      <button
                        key={label}
                        onClick={() => onCategoryChange(label)}
                        className={`group flex w-[70.695px] h-[31.813px] p-[7.069px] justify-center items-center gap-[7.069px] rounded-full font-['Pretendard'] text-[12.372px] font-medium leading-[140%] transition-colors whitespace-nowrap ${
                          isActive
                            ? "bg-[#ED7A13] text-[#FDFDFD]"
                            : "bg-[#FDFDFD] rounded-[35.347px] text-[#3E2722] hover:bg-[#ED7A13] hover:text-[#FDFDFD]"
                        }`}
                      >
                        <img
                          src={isActive ? iconActive : icon}
                          alt=""
                          className={`w-[7.8px] h-[7.8px] ${!isActive ? "group-hover:hidden" : ""}`}
                        />
                        {!isActive && (
                          <img src={iconActive} alt="" className="w-[7.8px] h-[7.8px] hidden group-hover:block" />
                        )}
                        {label}
                      </button>
                    );
                  })}
                </div>

        <div className="flex flex-col flex-1 w-[492px] h-[359px] rounded-t-[30px] rounded-b-[0px] overflow-hidden bg-[#FFEDA1] ">

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
                        <img src={place.imageURL || imgPlace} alt={place.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-[#2c2417] leading-tight truncate">
                              {place.name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              <span className="text-[10px] font-light text-[#8b7e6a]">{place.category}</span>
                              <span className="text-[10px] text-[rgba(139,126,106,0.3)] leading-none">·</span>
                              <span className="text-[10px] font-light text-[#8b7e6a]">도보 {place.walkMin}분</span>
                              <span className="text-[10px] text-[rgba(139,126,106,0.3)] leading-none">·</span>
                              <HoursLabel place={place} />
                            </div>
                          </div>
                          <button
                            className="shrink-0 ml-1 w-[15px] h-[17px] flex items-center justify-center"
                            onClick={e => e.stopPropagation()}
                          >
                            <img src={iconHeart} alt="저장" className="w-[8.6px] h-[8.6px]" />
                          </button>
                        </div>
                        <p className="text-[9px] font-light text-[#8b7e6a] mt-1 leading-relaxed line-clamp-1">
                          {place.desc}
                        </p>
                        <div className="flex gap-[2.5px] mt-1.5">
                          {place.tags.map(tag => (
                            <span key={tag} className="bg-[#f5f0e8] text-[#8b7e6a] text-[8px] font-normal px-[3.7px] py-[1.2px] rounded-[2.5px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
        </div>
              </div>
            )}

          </div>

        </div>
      </aside>
    </>
  );
}
