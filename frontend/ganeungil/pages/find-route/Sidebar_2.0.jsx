import RouteInputSection from "./RouteInputSection";
import { useRouteSearch, ROUTE_MODES } from "../../hooks/useRouteSearch";

import iconGPS        from "@/assets/icon-gps.svg";
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
import imgPlace       from "@/assets/img-place.jpg";

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
}) {
  const routeSearch = useRouteSearch({
    userCoords,
    onDestinationSelect,
    onDrawRoute,
    onRecsHide,
    onRecsShow,
    onDestinationClear,
  });

  const {
    showResults, isSearchMode, selectedMode,
    searchResults, selectedResult, isSearching,
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
        className="absolute w-[66px] h-[66px] bg-[#fdfdfd] rounded-[33px] drop-shadow-[0px_4.5px_2.25px_rgba(0,0,0,0.25)] flex items-center justify-center p-[15px] transition-all duration-300 z-20"
        style={{ left: "545px", top: "50px" }}
        title="현재 위치 보정"
      >
        <img src={iconGPS} alt="위치 보정" className="w-[35.982px] h-[35.982px]" />
      </button>

      {/* ── 사이드바 ── */}
      <aside
        className="absolute top-[34px] left-[36px] w-[492px] h-[1091px] flex-shrink-0 rounded-[30px] bg-[#FDFDFD] shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] flex flex-col overflow-hidden"
        style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(calc(-100% - 16px))" }}
      >

        {/* ── 노란 상단 영역 ── */}
        <div className="w-[492px] h-[407.19px] rounded-t-[30px] overflow-hidden bg-[#FFEDA1] shrink-0 flex flex-col">

          <div className="flex flex-col gap-[37px] items-center px-[41px] pt-[41px] w-full">

            {/* 입력 섹션 */}
            <RouteInputSection locStatus={locStatus} {...routeSearch} />

            {/* 구분선 */}
            <div className="w-[423px] h-px bg-[#d9d9d9] shrink-0" />

          </div>

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

          <div className="h-[46.19px] shrink-0" />

        </div>

        {/* ── 흰색 하단 영역 ── */}
        <div className="flex-1 overflow-y-auto pt-[17]">

          {/* 경로 모드 탭 (목적지 선택 후 노출) */}
          {selectedResult && (
            <div className="flex gap-1.5 px-4 py-3 border-b border-[#f3f4f6]">
              {ROUTE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  className={`flex-1 py-2 text-[10.5px] font-medium rounded-xl transition-all ${
                    selectedMode === mode.id
                      ? "bg-[#c8873a] text-white shadow-sm"
                      : "bg-white text-[#8b7e6a] border border-[#eee] hover:bg-[#faf6f0]"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
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
                  <div className={`bg-[#fdfdfd] border-[1.286px] flex h-[127px] items-start pb-[9px] pt-[14px] px-[16px] rounded-[25.714px] w-full cursor-pointer transition-all ${
                    selectedPlace?.id === place.id
                      ? "border-[rgba(200,135,58,0.5)] shadow-sm"
                      : "border-[rgba(175,175,175,0.5)] hover:shadow-sm"
                  }`}>

                    <div className="flex gap-[6px] items-start flex-1 min-w-0">
                      <div className="w-[80.286px] h-[80.286px] rounded-[8.6px] overflow-hidden shrink-0">
                        <img src={place.imageURL || imgPlace} alt={place.name} className="object-cover w-full h-full" />
                      </div>

                      <div className="flex flex-col gap-[10px] items-start flex-1 min-w-0">
                        <div className="flex flex-col gap-[11px] items-start w-full">
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
                          <p className="font-['MaruBuriOTF'] font-light text-[#3e2722] text-[9px] leading-[1.334] line-clamp-2">{place.desc}</p>
                        </div>
                        <div className="flex gap-[4px] items-center flex-wrap">
                          {place.tags.map(tag => (
                            <span key={tag} className="bg-[#fff2b9] text-[#3e2722] font-['MaruBuriOTF'] font-light text-[6.429px] px-[6.429px] py-[3.857px] rounded-[12.857px] whitespace-nowrap">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

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
