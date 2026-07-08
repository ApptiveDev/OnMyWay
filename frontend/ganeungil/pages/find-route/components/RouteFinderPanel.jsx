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

// TODO: 실제 최근/추천 도착지 데이터 연동 전까지의 임시 placeholder
const DEFAULT_DESTINATIONS = [
  { name: "도시철도 부산대역", sub: "북측 공영 주차장 · 1.0km" },
  { name: "온천천 시민공원",   sub: "산책로 입구 · 1.6km" },
  { name: "금강식물원",       sub: "금정구 · 2.0km" },
];

function commonPrefixLen(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

function HighlightedName({ name, query }) {
  const len = commonPrefixLen(query, name);
  if (len === 0) {
    return <span className="font-['Pretendard'] font-bold text-[#3e2722]">{name}</span>;
  }
  return (
    <>
      <span className="font-['Pretendard'] font-black text-[#ed7a13]">{name.slice(0, len)}</span>
      <span className="font-['Pretendard'] font-bold text-[#3e2722]">{name.slice(len)}</span>
    </>
  );
}

export default function RouteFinderPanel({
  locStatus,
  userCoords,
  onDestinationSelect,
  onDestinationClear,
  onDrawRoute,
  onRouteRecs,
  pinMode,
  pinCenter,
  pinNeighborhood,
  onEnterPinMode,
  onExitPinMode,
}) {
  const routeSearch = useRouteSearch({
    userCoords,
    onDestinationSelect,
    onDrawRoute,
    onRouteRecs,
    onDestinationClear,
  });

  const {
    showResults, selectedMode, deptFocused, deptText, destText,
    searchResults, selectedResult, isSearching, routeInfo, handleSearch,
    deptSearchResults, isDeptSearching, handleDeptResultClick,
    handleResultClick, handleModeChange,
  } = routeSearch;

  const originSearching = deptFocused && deptText.trim().length > 0;
  const merged = originSearching || showResults;
  const showDefault = !pinMode && !originSearching && !selectedResult && !showResults;

  const confirmPin = () => {
    handleResultClick({
      id: "pin",
      place_name: pinNeighborhood || "지정한 위치",
      x: pinCenter?.lng,
      y: pinCenter?.lat,
    });
    onExitPinMode();
  };

  return (
    <>
      {/* ── 노란 카드: 출발/도착 입력 ── */}
      <div className={`shrink-0 p-[18px] ${merged ? "pb-0" : "pb-[12px]"}`}>
        <div className={`bg-[#FFEDA1] p-[20px] ${merged ? "rounded-t-[22px]" : "rounded-[8px]"}`}>
          <RouteInputSection locStatus={locStatus} {...routeSearch} pinMode={pinMode} onExitPinMode={onExitPinMode} />
        </div>
      </div>

      {/* ── 흰 카드: 기본 안내 · 경로모드 · 검색결과 ── */}
      <div
        className={`flex-1 min-h-0 mb-[18px] bg-[#fdfdfd] shadow-[0_14px_30px_rgba(62,39,34,0.1)] flex flex-col overflow-hidden pt-[18px] ${
          merged ? "mx-[18px] mt-0 rounded-b-[22px] px-0" : "mx-[18px] rounded-[22px]"
        }`}
      >

        {/* 출발지 변경 중: 카카오 키워드 검색 결과 */}
        {originSearching && (
          <div className="flex-1 min-h-0 flex flex-col">
            <p className="shrink-0 px-[12px] pb-[11px] font-['MaruBuriOTF'] text-[14px] text-[#8a7d5f]">
              '{deptText}' 검색 결과
            </p>
            <div className="flex-1 min-h-0 overflow-y-auto px-[8px]">
              {isDeptSearching ? (
                <div className="flex items-center justify-center h-16">
                  <p className="text-[14px] font-light text-[#8b7e6a]">검색 중...</p>
                </div>
              ) : deptSearchResults.length === 0 ? (
                <div className="flex items-center justify-center h-16">
                  <p className="text-[14px] font-light text-[#8b7e6a]">'{deptText}'에 대한 결과가 없어요</p>
                </div>
              ) : (
                deptSearchResults.map((result, i) => (
                  <button
                    key={result.id}
                    onClick={() => handleDeptResultClick(result)}
                    className={`w-full flex items-center gap-[13px] p-[12px] rounded-[14px] text-left transition-colors ${
                      i === 0 ? "bg-[#FFFBEC]" : "hover:bg-[#FFF7E0]"
                    }`}
                  >
                    <div
                      className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0"
                      style={{ background: i === 0 ? "#FFF3D6" : "#F4EEE3" }}
                    >
                      <img src={iconLocation} alt="" className="w-[19px] h-[19px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] truncate">
                        <HighlightedName name={result.place_name} query={deptText} />
                      </p>
                      <p className="font-['MaruBuriOTF'] text-[12.5px] text-[#9a8e84] truncate mt-[2px]">
                        {result.road_address_name || result.address_name}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="shrink-0 p-[12px]">
              <button
                className="w-full h-[54px] rounded-[16px] text-white text-[16px] font-bold transition-colors"
                style={{
                  fontFamily: "Pretendard",
                  background: destText ? "#ED7A13" : "#E6C98A",
                  boxShadow: destText ? "0 6px 8px rgba(237,122,19,0.3)" : "none",
                }}
              >
                길찾기
              </button>
            </div>
          </div>
        )}

        {/* 지도에서 위치 지정 모드 */}
        {pinMode && (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="shrink-0 px-[20px] pb-[14px] flex items-center gap-[10px]">
              <div className="w-[36px] h-[36px] rounded-[11px] bg-[#FFF3D6] flex items-center justify-center shrink-0">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="7" stroke="#ED7A13" strokeWidth="1.7" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#ED7A13" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-['Pretendard'] font-bold text-[15px] text-[#3e2722]">핀을 옮겨 도착지 지정</p>
                <p className="font-['MaruBuriOTF'] text-[12.5px] text-[#9a8e84] mt-[2px]">지도를 움직이면 가운데 핀 위치가 도착지가 돼요</p>
              </div>
            </div>

            <div className="shrink-0 px-[20px] pb-[14px]">
              <div className="flex items-center gap-[10px] bg-[#FBF7EE] rounded-[13px] px-[15px] py-[13px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" stroke="#8a7d5f" strokeWidth="1.7" />
                  <circle cx="12" cy="10" r="2.4" stroke="#8a7d5f" strokeWidth="1.7" />
                </svg>
                <p className="font-['MaruBuriOTF'] text-[13px] text-[#8a7d5f] truncate">
                  현위치 부근: <span className="font-bold text-[#5a4d42]">{pinNeighborhood || "확인 중…"}</span>
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-0" />

            <div className="shrink-0 px-[20px] pb-[20px]">
              <button
                onClick={confirmPin}
                disabled={!pinCenter}
                className="w-full h-[54px] rounded-[16px] bg-[#ED7A13] text-white text-[16px] font-bold shadow-[0_6px_8px_rgba(237,122,19,0.3)] hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ fontFamily: "Pretendard" }}
              >
                이 위치로 도착지 설정
              </button>
            </div>
          </div>
        )}

        {/* 목적지 미선택 기본 상태: 지도에서 위치 지정 + 최근·추천 도착지 */}
        {showDefault && (
          <>
            <div className="shrink-0 px-[8px] pb-[12px]">
              <button onClick={onEnterPinMode} className="w-full flex items-center gap-[13px] pl-[10px] pr-[15px] py-[10px] rounded-[16px] bg-[#FFF7E0] border border-[#F2D49A] transition-colors hover:bg-[#FFF3D0]">
                <div className="w-[48px] h-[48px] rounded-[13px] bg-[#FFE9C2] shrink-0 flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(62,39,34,0.1)]">
                  <div className="w-[15px] h-[15px] bg-[#ED7A13] border-[1.5px] border-white rounded-tl-[7.5px] rounded-tr-[7.5px] rounded-bl-[2px] rounded-br-[7.5px] shadow-[0_2px_5px_rgba(62,39,34,0.4)] rotate-45" />
                </div>
                <p className="flex-1 min-w-0 text-left font-['Pretendard'] font-bold text-[15.5px] text-[#3e2722] truncate">
                  지도에서 위치 지정
                </p>
                <div className="w-[26px] h-[26px] rounded-[13px] bg-white shadow-[0_1px_1.5px_rgba(62,39,34,0.12)] flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="#ED7A13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            </div>

            <p className="shrink-0 px-[20px] pb-[13px] font-['MaruBuriOTF'] text-[14px] text-[#8a7d5f]">
              최근 · 추천 도착지
            </p>

            <div className="flex-1 min-h-0 overflow-y-auto px-[8px]">
              {DEFAULT_DESTINATIONS.map((item) => (
                <div key={item.name} className="flex items-center gap-[13px] p-[12px] rounded-[14px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#FFF3D6] flex items-center justify-center shrink-0">
                    <img src={iconLocation} alt="" className="w-[19px] h-[19px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Pretendard'] font-bold text-[15px] text-[#3e2722] truncate">{item.name}</p>
                    <p className="font-['MaruBuriOTF'] text-[12.5px] text-[#9a8e84] truncate mt-[2px]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 p-[12px]">
              <button
                disabled
                className="w-full h-[54px] rounded-[16px] bg-[#E6C98A] text-white text-[16px] font-bold cursor-default"
                style={{ fontFamily: "Pretendard" }}
              >
                길찾기
              </button>
            </div>
          </>
        )}

        {/* 경로 모드 탭 (목적지 선택 후 노출) */}
        {!pinMode && !originSearching && selectedResult && (
          <div className="shrink-0 flex flex-col gap-[10px] px-[16px]">
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
        {!pinMode && !originSearching && showResults && (
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
        {!pinMode && !originSearching && selectedResult && !showResults && (
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
    </>
  );
}
