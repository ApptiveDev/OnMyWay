import { useEffect, useState } from "react";
import RouteInputSection from "./RouteInputSection";
import { useRouteSearch, ROUTE_MODES } from "../../hooks/useRouteSearch";

import iconGPS        from "@/assets/icon-gps.svg";
import iconLocation   from "@/assets/iconlocation.svg";
import iconArrow      from "@/assets/icon-arrow.svg";
import iconUnion      from "@/assets/iconUnion.svg";
import iconLeisure    from "@/assets/icon-leisure.svg";
import iconFind       from "@/assets/icon-find.svg";
import iconClock      from "@/assets/icon-route.svg";
import iconAll        from "@/assets/all.svg";
import iconWhiteAll   from "@/assets/whiteall.svg";
import iconSip        from "@/assets/sip.svg";
import iconOrgSip     from "@/assets/org_sip.svg";
import iconBite       from "@/assets/bite.svg";
import iconOrgBite    from "@/assets/org_bite.svg";
import iconFight      from "@/assets/fight.svg";
import iconOrgFight   from "@/assets/org_fight.svg";
import iconSee        from "@/assets/see.svg";
import iconOrgSee     from "@/assets/org_see.svg";
import iconMeal       from "@/assets/meal.svg";
import iconOrgMeal    from "@/assets/org_meal.svg";
import iconHeart      from "@/assets/icon-heart.svg";
import iconQuiet      from "@/assets/iconquiet.svg";
import iconRoasting   from "@/assets/iconroasting.svg";
import imgPlace       from "@/assets/img-place.jpg";

// 피그마 기준 프레임 크기
const DESIGN_W = 1920;
const DESIGN_H = 1275;

const MODE_CONFIG = {
  right:   { icon: iconUnion,   iconBg: "#FAE3CE", cardClass: "bg-[#fdfdfd] hover:bg-[#fffbec]" },
  slow:    { icon: iconLeisure, iconBg: "#E0E4D8", cardClass: "bg-[#fdfdfd] hover:bg-[#fffbec]" },
  findOut: { icon: iconUnion,   iconBg: "#FDFAEB", cardClass: "bg-[#fdfdfd] hover:bg-[#fffbec]" },
};

const CATEGORIES = [
  { label: "전체",  icon: iconWhiteAll, iconActive: iconAll      },
  { label: "한 잔", icon: iconSip,      iconActive: iconOrgSip   },
  { label: "한 입", icon: iconBite,     iconActive: iconOrgBite  },
  { label: "한 끼", icon: iconMeal,     iconActive: iconOrgMeal  },
  { label: "한 눈", icon: iconSee,      iconActive: iconOrgSee   },
  { label: "한 판", icon: iconFight,    iconActive: iconOrgFight },
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
    if (!place.closeTime) return <span className="font-['MaruBuriOTF'] text-[7.714px] font-normal text-[#6A8042]">영업 중</span>;
    return <span className="font-['MaruBuriOTF'] text-[7.714px] font-light text-[#6A8042]">영업 중 ({fmt(place.closeTime)}에 종료)</span>;
  }
  if (!place.openTime) return <span className="font-['MaruBuriOTF'] text-[7.714px] font-normal text-[#c82b2b]">영업 종료</span>;
  return <span className="font-['MaruBuriOTF'] text-[7.714px] font-light text-[#c82b2b]">영업 종료 ({fmt(place.openTime)}에 시작)</span>;
}

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
  userCoords,
  onDrawRoute,
  onRouteRecs,
}) {
  const [scale, setScale] = useState(
    () => Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
  );

  useEffect(() => {
    const update = () =>
      setScale(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const routeSearch = useRouteSearch({
    userCoords,
    onDestinationSelect,
    onDrawRoute,
    onRouteRecs,
    onRecsHide,
    onRecsShow,
    onDestinationClear,
  });

  const {
    showResults, isSearchMode, selectedMode,
    searchResults, selectedResult, isSearching, routeInfo, handleSearch,
    handleResultClick, handleModeChange,
  } = routeSearch;

  const granted       = locStatus === "granted";
  const showRecs      = granted && recsState !== "hidden";
  const overlayFading = recsState === "fading";

  return (
    <>
      {/* ── 위치 보정 버튼 ── */}
      <button
        onClick={onRecalibrate}
        className="absolute bg-[#fdfdfd] rounded-full drop-shadow-[0px_4.5px_2.25px_rgba(0,0,0,0.25)] flex items-center justify-center transition-all duration-300 z-20"
        style={{
          width:   `${66 * scale}px`,
          height:  `${66 * scale}px`,
          padding: `${15 * scale}px`,
          left:    `${545 * scale}px`,
          top:     `${50 * scale}px`,
        }}
        title="현재 위치 보정"
      >
        <img
          src={iconGPS}
          alt="위치 보정"
          style={{ width: `${35.982 * scale}px`, height: `${35.982 * scale}px` }}
        />
      </button>

      {/*
        ── 사이드바 래퍼 ──
        - 스케일된 크기·위치·그림자·애니메이션 담당
        - overflow:hidden 으로 원본 크기(492×1091)의 aside를 잘라냄
      */}
      <div
        className="absolute flex-shrink-0"
        style={{
          top:          `${34 * scale}px`,
          left:         `${36 * scale}px`,
          width:        `${492 * scale}px`,
          height:       `${1091 * scale}px`,
          borderRadius: `${30 * scale}px`,
          boxShadow:    "0 4px 10px 0 rgba(0,0,0,0.25)",
          overflow:     "hidden",
          transition:   "transform 300ms",
          transform:    sidebarOpen ? "translateX(0)" : "translateX(calc(-100% - 16px))",
        }}
      >
        {/*
          ── 사이드바 본체 ──
          - 원본 px 값 그대로 유지 (피그마 기준)
          - transform:scale 로 래퍼 크기에 맞춰 축소·확대
          - RouteInputSection 포함 모든 하위 요소가 함께 스케일됨
        */}
        <aside
          className="w-[492px] h-[1091px] bg-[#FDFDFD] flex flex-col overflow-hidden"
          style={{
            transform:       `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >

          {/* ── 노란 상단 영역 ── */}
          <div className={`w-[492px] rounded-t-[30px] overflow-hidden bg-[#FFEDA1] shrink-0 flex flex-col ${showResults || selectedResult ? "h-auto" : "h-[407.19px]"}`}>

            <div className="flex flex-col gap-[37px] items-center px-[41px] pt-[41px] w-full">

              {/* 입력 섹션 */}
              <RouteInputSection locStatus={locStatus} {...routeSearch} />

              {/* 구분선 */}
              <div className="w-[423px] h-px bg-[#d9d9d9] shrink-0" />

            </div>

            {/* 가는길에 + 카테고리 필터 */}
            {!showResults && granted && showRecs && (
              <>
                <div className="pl-[32px] pr-4 pt-[25px] shrink-0">
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
                          <img
                            src={iconActive}
                            alt={label}
                            className="w-[70.695px] h-[31.813px] hidden group-hover:block"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {!showResults && !selectedResult && <div className="h-[46.19px] shrink-0" />}

          </div>

          {/* ── 흰색 하단 영역 ── */}
          <div className="flex-1 overflow-y-auto pt-[17px]">

            {/* 경로 모드 탭 (목적지 선택 후 노출) */}
            {selectedResult && (
              <div className="flex flex-col gap-[10px] px-[27px] py-[17px]">
                {ROUTE_MODES.map((mode) => {
                  const cfg  = MODE_CONFIG[mode.id];
                  const info = routeInfo[mode.id];
                  const isActive = selectedMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => handleModeChange(mode.id)}
                      className={`w-full flex items-center gap-[22px] px-[27px] py-[22px] rounded-[20px] border-2 transition-all text-left ${cfg.cardClass}`}
                      style={{ borderColor: isActive ? "#c8873a" : "#d9d9d9" }}
                    >
                      <div
                        className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: cfg.iconBg }}
                      >
                        <img src={cfg.icon} alt="" className="w-[18px] h-[18px]" />
                      </div>
                      <p className="text-[20px] text-[#3e2722] whitespace-nowrap shrink-0" style={{ fontFamily: "MaruBuriOTF" }}>
                        {mode.label}
                      </p>
                      {info && (
                        <div className="flex items-center gap-[7px] ml-auto shrink-0">
                          <img src={iconClock} alt="" className="w-[12px] h-[12px]" />
                          <span className="text-[14px] font-medium text-[#8b7e6a] whitespace-nowrap" style={{ fontFamily: "Pretendard" }}>
                            {info.time}분
                          </span>
                          <span className="text-[14px] font-medium text-[#8b7e6a] whitespace-nowrap" style={{ fontFamily: "Pretendard" }}>
                            {info.distance}km
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 탐색하기 버튼 디자인완료*/ }
            {selectedResult && !showResults && (
              <div className=" h-[90px] my-[363px]">
                <button
                  onClick={handleSearch}
                  className="w-[413px] h-[90px] px-[17px] mx-[40px] rounded-[38px] bg-[#ed7a13] text-white text-[26.368px] font-normal tracking-[-0.7px] transition-opacity hover:opacity-90"
                  style={{ fontFamily: "Pretendard" }}
                >
                  탐색하기
                </button>
              </div>
            )}

            {/* 카카오 장소 검색 결과 */}
            {showResults && (
              <div className="flex flex-col gap-2 px-4 py-3">
                {isSearching ? (
                  <div className="flex items-center justify-center h-16">
                    <p className="text-[15px] font-light text-[#8b7e6a]">검색 중...</p>
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full flex items-center gap-[22px] px-[27px] py-[27px] text-left rounded-[20px] transition-colors ${
                        selectedResult?.id === result.id
                          ? "bg-[rgba(255,237,161,0.5)]"
                          : "hover:bg-[rgba(255,237,161,0.3)]"
                      }`}
                    >
                      <div className="w-[44px] h-[44px] rounded-full bg-[#fae3ce] flex items-center justify-center shrink-0">
                        <img src={iconLocation} alt="" className="w-[18px] h-[18px]" />
                      </div>
                      <p className="text-[20px] text-[#3e2722] whitespace-nowrap shrink-0" style={{ fontFamily: "MaruBuriOTF" }}>{result.place_name}</p>
                      <p className="text-[14px] font-medium text-[#8b7e6a] truncate" style={{ fontFamily: "Pretendard" }}>{result.road_address_name || result.address_name}</p>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* 추천 장소 목록 */}
            {!showResults && granted && showRecs && (
              <div className={`flex flex-col p-[14px] gap-[15px] ${overlayFading ? "fade-out" : "fade-in"}`}>
                {recs.map(place => (
                  <div
                    key={place.id}
                    className="p-[8px] w-full"
                    onClick={() => onPlaceSelect(selectedPlace?.id === place.id ? null : place)}
                  >
                    <div className={`bg-[#fdfdfd] border-[1.286px] flex items-start px-[22px] pt-[14px] pb-[17px] rounded-[25.714px] w-full cursor-pointer transition-all ${
                      selectedPlace?.id === place.id
                        ? "border-[rgba(200,135,58,0.5)] shadow-sm"
                        : "border-[rgba(175,175,175,0.5)] hover:shadow-sm"
                    }`}>

                      <div className="flex gap-[14px] items-start flex-1 min-w-0">
                        <div className="w-[64px] h-[64px] rounded-[8.6px] overflow-hidden shrink-0 mt-[8px]">
                          <img src={place.imageURL || imgPlace} alt={place.name} className="object-cover w-full h-full" />
                        </div>

                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <div className="flex flex-col gap-[7px] items-start w-full">
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
                            <div className="flex items-center gap-[12px]">
                              <p className="font-['MaruBuriOTF'] font-light text-[#3e2722] text-[7.714px] whitespace-nowrap">내 위치로부터 도보 {place.walkMin}분</p>
                              <HoursLabel place={place} />
                            </div>
                            <p className="font-['MaruBuriOTF'] font-light text-[#3e2722] text-[9px] leading-[1.334] line-clamp-2 whitespace-pre-line">
                              {place.desc || "골목 안 작은 로스터리,\n신선한 원두가 기다립니다"}
                            </p>
                            <div className="flex items-center gap-[8px] mt-[3px]">
                              <img src={iconQuiet} alt="quiet" className="h-[16px] w-auto" />
                              <img src={iconRoasting} alt="roasting" className="h-[16px] w-auto" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="shrink-0 w-[19px] h-[19px] flex items-center justify-center ml-2"
                        onClick={e => e.stopPropagation()}
                      >
                        <img src={iconHeart} alt="저장" className="w-[15.74px] h-[13.705px]" />
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </aside>
      </div>
    </>
  );
}
