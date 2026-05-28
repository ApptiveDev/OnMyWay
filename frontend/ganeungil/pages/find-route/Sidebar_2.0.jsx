import { useState, useRef, useEffect } from "react";

import iconGPS            from "@/assets/icon-gps.svg";
import iconCurrentLocation from "@/assets/icon-current-location.svg";
import iconArrow     from "@/assets/icon-arrow.svg";
import iconSearch    from "@/assets/icon-search.svg";
import iconSearchNew from "@/assets/icon-search-new.svg";
import iconAll       from "@/assets/all.svg";
import iconWhiteAll  from "@/assets/whiteall.svg";
import iconSip       from "@/assets/sip.svg";
import iconOrgSip    from "@/assets/org_sip.svg";
import iconBite      from "@/assets/bite.svg";
import iconOrgBite   from "@/assets/org_bite.svg";
import iconFight     from "@/assets/fight.svg";
import iconOrgFight  from "@/assets/org_fight.svg";
import iconSee       from "@/assets/see.svg";
import iconOrgSee    from "@/assets/org_see.svg";
import iconMeal      from "@/assets/meal.svg";
import iconOrgMeal   from "@/assets/org_meal.svg";
import iconHeart  from "@/assets/icon-heart.svg";
import imgPlace   from "@/assets/img-place.jpg";
import iconex     from "@/assets/icon-ex.svg";

const CATEGORIES = [
  { label: "전체",  icon: iconWhiteAll, iconActive: iconAll      },
  { label: "한 잔", icon: iconSip,      iconActive: iconOrgSip   },
  { label: "한 입", icon: iconBite,     iconActive: iconOrgBite  },
  { label: "한 판", icon: iconFight,    iconActive: iconOrgFight },
  { label: "한 눈", icon: iconSee,      iconActive: iconOrgSee   },
  { label: "한 끼", icon: iconMeal,     iconActive: iconOrgMeal  },
];

const CATEGORY_ICON_MAP = {
  "한잔": iconOrgSip,
  "한입": iconOrgBite,
  "한숨": iconAll,
  "한판": iconOrgFight,
  "한눈": iconOrgSee,
  "한끼": iconOrgMeal,
};

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

  const handleResultClick = (result) => {
    setSelectedResult(result);
    setDestText(result.place_name);
    onDestinationSelect?.(result);
  };

  const isSearchMode = destFocused || deptFocused;

  return (
    <>
      {/* ── 위치 보정 버튼 ── */}
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
        className="absolute top-[34px] left-[36px] w-[492px] h-[1091px] flex-shrink-0 rounded-[30px] bg-[#FDFDFD] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] flex flex-col"
        style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(calc(-100% - 16px))" }}
      >

        {/* ── 노란 상단 영역 (359px 고정) ── */}
        <div className="w-[492px] h-[359px] rounded-t-[30px] overflow-hidden bg-[#FFEDA1] shrink-0 flex flex-col">

          {/* 출발지 + 목적지 */}
          <div className="flex gap-[18px] items-center w-full px-[18px] pt-[18px]">

            {/* 출발/도착 인디케이터 */}
            <div className="flex flex-col items-center w-[24px] h-[91px] shrink-0 py-[5px]">
              <div className="w-[14px] h-[14px] rounded-full bg-[#ED7A13] ring-2 ring-white" />
              <div className="flex-1 w-px border-l border-dashed border-[rgba(62,39,34,0.3)]" />
              <div className="w-[14px] h-[14px] rounded-full bg-[#3E2722] ring-2 ring-white" />
            </div>

            {/* 입력 박스 컬럼 */}
            <div className="flex flex-col items-center flex-1">

              {/* 출발지 */}
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
                      <button type="button" onClick={() => setDeptText("")} className="shrink-0 text-[#8b7e6a] text-[11px] hover:text-[#2c2417]">✕</button>
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
                        <button type="button" onClick={() => setDestText("")} className="w-6 h-6 rounded-full bg-[#e0d8cc] flex items-center justify-center shrink-0 ml-2">
                          <span className="text-[#8b7e6a] text-[13px]">✕</span>
                        </button>
                        <button type="submit" className="ml-2 text-[13px] font-medium text-[#c8873a] bg-[rgba(200,135,58,0.1)] px-2.5 py-1 rounded-full shrink-0">검색</button>
                      </>
                    )}
                  </div>
                </form>
                {isSearchMode && (
                  <button onClick={handleCancel} className="flex items-center justify-center w-full mt-2 transition-opacity hover:opacity-70">
                    <img src={iconex} alt="취소" className="w-[20.221px] h-[18.184px]" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* 구분선 */}
          <div className="w-[423px] h-px bg-[#d9d9d9] mx-auto mt-[32px] shrink-0" />

          {/* 가는길에 + 카테고리 필터 */}
          {!showResults && granted && showRecs && (
            <>
              <div className="px-4 pt-[25px] shrink-0">
                <p className="text-[15px] font-normal text-[#000000] leading-[133.4%] tracking-[-0.405px] opacity-70">
                  가는길에{" "}
                  <span>잠시 들러 보세요</span>
                </p>
              </div>
              <div className="px-[24px] pt-[15px] pb-2 flex items-center gap-[7px] shrink-0">
                {CATEGORIES.map(({ label, icon, iconActive }) => {
                  const isActive = activeCategory === label;
                  return (
                    <button key={label} onClick={() => onCategoryChange(label)} className="shrink-0 group">
                      <img
                        src={isActive ? iconActive : icon}
                        alt={label}
                        className={`w-[70.695px] h-[31.813px] ${!isActive ? "group-hover:hidden" : ""}`}
                      />
                      {!isActive && (
                        <img src={iconActive} alt={label} className="w-[70.695px] h-[31.813px] hidden group-hover:block" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

        </div>

        {/* ── 흰색 하단 영역 (나머지 공간) — 목록 표시 ── */}
        <div className="flex-1 overflow-y-auto">

          {/* 카카오 장소 검색 결과 */}
          {showResults && (
            <div className="flex flex-col px-4 py-3 gap-2">
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
                      <p className="text-[18px] font-medium text-[#2c2417] leading-[20.4px] truncate">{result.place_name}</p>
                      <p className="text-[15px] font-light text-[#8b7e6a] leading-[16.8px] truncate">{result.road_address_name || result.address_name}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* 추천 장소 목록 */}
          {!showResults && granted && showRecs && (
            <div className={`flex flex-col px-[14px] py-3 gap-2 ${overlayFading ? "fade-out" : "fade-in"}`}>
              {recs.map(place => (
                <div key={place.id} className="p-[8px] w-full" onClick={() => onPlaceSelect(selectedPlace?.id === place.id ? null : place)}>
                  {/* Figma 944:1282 — 카드 */}
                  <div className={`bg-[#fdfdfd] border-[1.286px] flex h-[127px] items-start pb-[9px] pt-[14px] px-[16px] rounded-[25.714px] w-full cursor-pointer transition-all ${
                    selectedPlace?.id === place.id
                      ? "border-[rgba(200,135,58,0.5)] shadow-sm"
                      : "border-[rgba(175,175,175,0.5)] hover:shadow-sm"
                  }`}>

                    {/* 왼쪽: 이미지 + 정보 */}
                    <div className="flex gap-[6px] items-start flex-1 min-w-0">
                      {/* 이미지 80×80 */}
                      <div className="w-[80.286px] h-[80.286px] rounded-[8.6px] overflow-hidden shrink-0">
                        <img src={place.imageURL || imgPlace} alt={place.name} className="object-cover w-full h-full" />
                      </div>

                      {/* 정보 컬럼 */}
                      <div className="flex flex-col gap-[10px] items-start flex-1 min-w-0">
                        <div className="flex flex-col gap-[11px] items-start w-full">
                          {/* 이름 + 카테고리 배지 */}
                          <div className="flex items-center">
                            <p className="font-['Pretendard'] font-semibold text-[#3e2722] text-[12.857px] whitespace-nowrap shrink-0">{place.name}</p>
                            {CATEGORY_ICON_MAP[place.category] && (
                              <img
                                src={CATEGORY_ICON_MAP[place.category]}
                                alt={place.category}
                                className="w-[37.286px] h-[16.512px] shrink-0 ml-[14.14px]"
                              />
                            )}
                          </div>
                          {/* 도보 + 영업시간 */}
                          <div className="flex items-center gap-[12px]">
                            <p className="font-['MaruBuriOTF'] font-light text-[#3e2722] text-[7.714px] whitespace-nowrap">내 위치로부터 도보 {place.walkMin}분</p>
                            <HoursLabel place={place} />
                          </div>
                          {/* 설명 */}
                          <p className="font-['MaruBuriOTF'] font-light text-[#3e2722] text-[9px] leading-[1.334] line-clamp-2">{place.desc}</p>
                        </div>
                        {/* 태그 */}
                        <div className="flex gap-[4px] items-center flex-wrap">
                          {place.tags.map(tag => (
                            <span key={tag} className="bg-[#fff2b9] text-[#3e2722] font-['MaruBuriOTF'] font-light text-[6.429px] px-[6.429px] py-[3.857px] rounded-[12.857px] whitespace-nowrap">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽: 하트 아이콘 */}
                    <button className="shrink-0 w-[19px] h-[19px] flex items-center justify-center ml-2" onClick={e => e.stopPropagation()}>
                      <img src={iconHeart} alt="저장" className="w-[15.74px] h-[13.705px]" />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </aside>
    </>
  );
}
