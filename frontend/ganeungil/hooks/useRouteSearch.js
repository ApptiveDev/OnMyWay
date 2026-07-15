import { useState, useRef, useEffect } from "react";
import api from "../api/api";

// 백엔드 /places/search는 PointDTO({placeName, latitude, longitude, address, roadAddress})를 반환한다.
// 백엔드 SearchService가 위경도를 바꿔 담고 있어서(latitude 필드에 실제 경도, longitude 필드에 실제 위도가 들어옴),
// 백엔드는 건드리지 않고 여기서 다시 바꿔 카카오 Places 결과와 같은 형태(place_name, x=lng, y=lat)로 맞춘다.
export function toSearchResults(data) {
  if (!Array.isArray(data)) return [];
  return data.slice(0, 5).map((p, i) => ({
    id: `${p.placeName}-${i}`,
    place_name: p.placeName,
    x: String(p.latitude),
    y: String(p.longitude),
    address_name: p.address,
    road_address_name: p.roadAddress,
  }));
}

export const ROUTE_MODES = [
  { id: "findOut", label: "바른 길",     endpoint: "/route/right"   },
  { id: "slow",    label: "여유로운 길", endpoint: "/route/slow"    },
  { id: "right",   label: "발견하는 길", endpoint: "/route/findOut" },
];

export function useRouteSearch({ userCoords, onDestinationSelect, onDrawRoute, onRecsHide, onRecsShow, onDestinationClear, onRouteLoadingChange }) {
  const [destText, setDestText]               = useState("");
  const [destFocused, setDestFocused]         = useState(false);
  const [deptText, setDeptText]               = useState("");
  const [deptFocused, setDeptFocused]         = useState(false);
  const [searchResults, setSearchResults]     = useState([]);
  const [deptSearchResults, setDeptSearchResults] = useState([]);
  const [selectedResult, setSelectedResult]   = useState(null);
  const [customDeptCoords, setCustomDeptCoords] = useState(null); // null = userCoords 사용
  const [isSearching, setIsSearching]         = useState(false);
  const [selectedMode, setSelectedMode]       = useState("slow");
  const [exploredMode, setExploredMode]       = useState(null);
  const [routeStats, setRouteStats]           = useState({});
  const [routeFeatures, setRouteFeatures]     = useState({});
  const [routeRecsByMode, setRouteRecsByMode] = useState({}); // modeId -> 그 경로 위 추천 장소(flat)

  const destInputRef    = useRef(null);
  const deptInputRef    = useRef(null);
  const debounceRef     = useRef(null);
  const deptDebounceRef = useRef(null);

  const isSearchMode    = destFocused || deptFocused;
  const showResults     = searchResults.length > 0;
  const showDeptResults = deptSearchResults.length > 0;

  // 목적지 debounce 자동완성 (350ms)
  useEffect(() => {
    if (!destText.trim() || !destFocused) {
      setSearchResults([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.get("/places/search", {
          params: { query: destText, lat: userCoords?.lat, lon: userCoords?.lng },
        });
        setSearchResults(toSearchResults(response.data));
      } catch (error) {
        console.error("[자동완성] 백엔드 검색 에러:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [destText, destFocused]);

  // 출발지 debounce 자동완성 (350ms)
  useEffect(() => {
    if (!deptText.trim() || !deptFocused) {
      setDeptSearchResults([]);
      return;
    }
    clearTimeout(deptDebounceRef.current);
    deptDebounceRef.current = setTimeout(() => {
      if (!window.kakao?.maps?.services) return;
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(deptText, (results, status) => {
        if (status === window.kakao.maps.services.Status.OK) setDeptSearchResults(results.slice(0, 5));
        else setDeptSearchResults([]);
      });
    }, 350);
    return () => clearTimeout(deptDebounceRef.current);
  }, [deptText, deptFocused]);

  const handleDestFocus = () => { setDestFocused(true); onRecsHide?.(); };
  const handleDeptFocus = () => { setDeptFocused(true); onRecsHide?.(); };

  const handleCancel = () => {
    setDestText(""); setDeptText("");
    setDestFocused(false); setDeptFocused(false);
    setSearchResults([]); setDeptSearchResults([]);
    setSelectedResult(null); setCustomDeptCoords(null);
    setRouteStats({}); setRouteFeatures({}); setExploredMode(null);
    onRecsShow?.(); onDestinationClear?.();
  };

  // 출발지 결과 선택
  const handleDeptResultClick = (result) => {
    const newCoords = { lat: parseFloat(result.y), lng: parseFloat(result.x) };
    setDeptText(result.place_name);
    setCustomDeptCoords(newCoords);
    setDeptSearchResults([]);
    setDeptFocused(false);
    setRouteStats({}); setRouteFeatures({}); setExploredMode(null);
    // 목적지가 이미 선택된 상태면 새 출발지로 경로 자동 재탐색
    if (selectedResult) {
      Promise.all(ROUTE_MODES.map(m => fetchOne(m.id, selectedResult, newCoords)));
    }
  };

  // 출발지 초기화 (현재위치 / 부산대정문으로 복귀)
  const handleDeptClear = () => {
    setDeptText("");
    setCustomDeptCoords(null);
    setDeptSearchResults([]);
    setDeptFocused(false);
    setRouteStats({}); setRouteFeatures({}); setExploredMode(null);
    // 목적지가 이미 선택된 상태면 기본 출발지로 경로 자동 재탐색
    if (selectedResult && userCoords) {
      Promise.all(ROUTE_MODES.map(m => fetchOne(m.id, selectedResult, userCoords)));
    }
  };

/* 바꿀 코드 (백엔드 API 연동 방식) */
  const handleDestSubmit = async (e) => {
    e?.preventDefault();
    if (!destText.trim()) return;

    setIsSearching(true);
    try {
      const response = await api.get("/places/search", {
        params: { query: destText, lat: userCoords?.lat, lon: userCoords?.lng },
      });
      const results = toSearchResults(response.data);
      setSearchResults(results);
      // Enter로 제출한 경우 목록만 띄우지 말고 첫 번째 결과를 바로 선택해 좌표를 확정한다.
      if (results.length > 0) {
        await handleResultClick(results[0]);
      }
    } catch (error) {
      console.error("[검색 제출] 백엔드 검색 에러:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeptSubmit = (e) => { e?.preventDefault(); };

  // 단일 모드 fetch (startCoordsOverride: 출발지 변경 직후 state 반영 전 명시적으로 전달)
  const fetchOne = async (modeId, result, startCoordsOverride) => {
    const startCoords = startCoordsOverride ?? customDeptCoords ?? userCoords;
    if (!startCoords || !result) return null;
    const mode = ROUTE_MODES.find(m => m.id === modeId);
    try {
      const response = await api.post(mode.endpoint, [
        { lat: startCoords.lat, lon: startCoords.lng },
        { lat: parseFloat(result.y), lon: parseFloat(result.x) },
      ]);
      const features = response.data.route?.features;
      if (!features || !Array.isArray(features)) return null;

      const props = features[0]?.properties;
      if (props?.totalDistance != null && props?.totalTime != null) {
        setRouteStats(prev => ({
          ...prev,
          [modeId]: { distance: props.totalDistance, time: props.totalTime },
        }));
      }
      setRouteFeatures(prev => ({ ...prev, [modeId]: features }));

      // 경로 위(그 경로에서만 나오는) 추천 장소 — 카테고리당 대표(featured) 1곳씩만 사용 (최대 6개)
      const categories = response.data.recommendations?.categories;
      if (Array.isArray(categories)) {
        const featuredPlaces = categories.map(c => c.featured).filter(Boolean);
        setRouteRecsByMode(prev => ({ ...prev, [modeId]: featuredPlaces }));
      }

      return features;
    } catch (error) {
      console.error(`[경로] ${modeId} 에러:`, error.response?.status, error.response?.data ?? error.message);
      return null;
    }
  };

  // 목적지 선택 시 3개 모드 동시 fetch (지도에는 그리지 않음)
  const handleResultClick = async (result) => {
    setSelectedResult(result);
    setSearchResults([]);
    setDestText(result.place_name);
    setDestFocused(false);
    setExploredMode(null);
    onDestinationSelect?.(result);
    if (!customDeptCoords && !userCoords) { alert("현재 위치를 먼저 잡아주세요."); return; }

    await Promise.all(ROUTE_MODES.map(m => fetchOne(m.id, result)));
  };

  // 모드 카드 클릭: 선택만 변경
  const handleModeChange = (modeId) => {
    setSelectedMode(modeId);
  };

  // 탐색하기:
  // - 처음 or 다른 모드 → 캐시된 경로 즉시 사용
  // - 같은 모드로 재클릭 → 새로 fetch (랜덤 재탐색)
  const handleExplore = () => {
    if (!selectedResult) return;
    if (exploredMode === selectedMode) {
      onRouteLoadingChange?.(true);
      fetchOne(selectedMode, selectedResult).then(f => {
        if (f) onDrawRoute?.(f, selectedMode);
        onRouteLoadingChange?.(false);
      });
    } else {
      const cached = routeFeatures[selectedMode];
      if (cached) {
        onDrawRoute?.(cached, selectedMode);
        setExploredMode(selectedMode);
      } else {
        onRouteLoadingChange?.(true);
        fetchOne(selectedMode, selectedResult).then(f => {
          if (f) { onDrawRoute?.(f, selectedMode); setExploredMode(selectedMode); }
          onRouteLoadingChange?.(false);
        });
      }
    }
  };

  // 지도 핀으로 직접 지정한 위치를 목적지로 선택 (검색 결과와 동일한 파이프라인 재사용)
  const selectManualDestination = ({ name, lat, lng }) =>
    handleResultClick({ place_name: name, x: String(lng), y: String(lat) });

  return {
    destText, setDestText, destFocused,
    deptText, setDeptText, deptFocused,
    searchResults, deptSearchResults,
    selectedResult, customDeptCoords,
    isSearching, selectedMode,
    destInputRef, deptInputRef,
    isSearchMode, showResults, showDeptResults, routeStats, routeRecsByMode,
    handleDestFocus, handleDeptFocus, handleCancel,
    handleDestSubmit, handleDeptSubmit,
    handleDeptResultClick, handleDeptClear,
    handleResultClick, handleModeChange, handleExplore,
    selectManualDestination,
  };
}
