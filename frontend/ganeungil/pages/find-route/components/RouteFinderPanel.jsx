import RouteInputSection from "./RouteInputSection";
import { useRouteSearch, ROUTE_MODES } from "../../../hooks/useRouteSearch";

import iconLocation from "@/assets/iconlocation.svg";
import iconClock    from "@/assets/icon-route.svg";
import iconUnion    from "@/assets/iconUnion.svg";
import iconLeisure  from "@/assets/icon-leisure.svg";

// 경로 모드별 포인트 컬러 (바른길/여유로운길/발견하는길)
const MODE_CONFIG = {
  right:   { icon: iconUnion,   tint: "#ED7A13" },
  slow:    { icon: iconLeisure, tint: "#6A8042" },
  findOut: { icon: iconUnion,   tint: "#B07A2E" },
};

export default function RouteFinderPanel({
  locStatus,
  userCoords,
  onDestinationSelect,
  onDestinationClear,
  onDrawRoute,
  onRouteRecs,
}) {
  const routeSearch = useRouteSearch({
    userCoords,
    onDestinationSelect,
    onDrawRoute,
    onRouteRecs,
    onDestinationClear,
  });

  const {
    showResults, selectedMode,
    searchResults, selectedResult, isSearching, routeInfo, handleSearch,
    handleResultClick, handleModeChange,
  } = routeSearch;

  const showCard = selectedResult || showResults;

  return (
    <>
      {/* ── 노란 카드: 출발/도착 입력 ── */}
      <div className="shrink-0 p-[18px] pb-[12px]">
        <div className="bg-[#FFEDA1] rounded-[20px] p-[18px]">
          <RouteInputSection locStatus={locStatus} {...routeSearch} />
        </div>
      </div>

      {/* ── 흰 카드: 경로모드 · 목적지 검색결과 ── */}
      {showCard && (
        <div className="flex-1 min-h-0 mx-[18px] mb-[18px] bg-[#fdfdfd] rounded-[20px] shadow-[0_14px_30px_rgba(62,39,34,0.1)] flex flex-col overflow-hidden">

          {/* 경로 모드 탭 (목적지 선택 후 노출) */}
          {selectedResult && (
            <div className="shrink-0 flex flex-col gap-[10px] px-[16px] pt-[16px]">
              {ROUTE_MODES.map((mode) => {
                const cfg = MODE_CONFIG[mode.id];
                const info = routeInfo[mode.id];
                const isActive = selectedMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className="w-full flex items-center gap-[13px] px-[15px] py-[14px] rounded-[17px] text-left transition-shadow"
                    style={{
                      background: isActive ? "#FFFBEC" : "#fff",
                      boxShadow: isActive ? `inset 0 0 0 2px ${cfg.tint}` : "inset 0 0 0 1.5px rgba(62,39,34,.1)",
                    }}
                  >
                    <div className="w-[44px] h-[44px] rounded-[13px] flex items-center justify-center shrink-0" style={{ background: cfg.tint }}>
                      <img src={cfg.icon} alt="" className="w-[18px] h-[18px]" />
                    </div>
                    <p className="text-[16px] font-semibold text-[#3e2722] whitespace-nowrap shrink-0" style={{ fontFamily: "Pretendard" }}>
                      {mode.label}
                    </p>
                    {info && (
                      <div className="flex items-center gap-[7px] ml-auto shrink-0">
                        <img src={iconClock} alt="" className="w-[12px] h-[12px]" />
                        <span className="text-[13px] font-medium text-[#8b7e6a] whitespace-nowrap" style={{ fontFamily: "Pretendard" }}>
                          {info.time}분
                        </span>
                        <span className="text-[13px] font-medium text-[#8b7e6a] whitespace-nowrap" style={{ fontFamily: "Pretendard" }}>
                          {info.distance}km
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 카카오 목적지 검색 결과 */}
          {showResults && (
            <div className="flex-1 min-h-0 overflow-y-auto pt-[12px]">
              <div className="flex flex-col gap-[4px] px-[16px]">
                {isSearching ? (
                  <div className="flex items-center justify-center h-16">
                    <p className="text-[14px] font-light text-[#8b7e6a]">검색 중...</p>
                  </div>
                ) : (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full flex items-center gap-[12px] px-[12px] py-[11px] text-left rounded-[14px] transition-colors ${
                        selectedResult?.id === result.id ? "bg-[#FFF3D6]" : "hover:bg-[#FFF7E0]"
                      }`}
                    >
                      <div className="w-[40px] h-[40px] rounded-full bg-[#FFF3D6] flex items-center justify-center shrink-0 text-[#ED7A13]">
                        <img src={iconLocation} alt="" className="w-[18px] h-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14.5px] font-semibold text-[#3e2722] truncate" style={{ fontFamily: "Pretendard" }}>{result.place_name}</p>
                        <p className="text-[12.5px] text-[#9a8e84] truncate mt-[2px]" style={{ fontFamily: "MaruBuriOTF" }}>{result.road_address_name || result.address_name}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 탐색하기 버튼 (목적지 선택 후, 검색 중이 아닐 때) */}
          {selectedResult && !showResults && (
            <div className="shrink-0 p-[16px] mt-auto">
              <button
                onClick={handleSearch}
                className="w-full h-[52px] rounded-[15px] bg-[#ed7a13] text-white text-[16px] font-semibold shadow-[0_6px_16px_rgba(237,122,19,0.3)] hover:opacity-90 transition-opacity"
                style={{ fontFamily: "Pretendard" }}
              >
                탐색하기
              </button>
            </div>
          )}

        </div>
      )}
    </>
  );
}
