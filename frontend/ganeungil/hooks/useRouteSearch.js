import { useState, useRef, useEffect } from "react";
import api from "../api/api";

// 점 → 선분(segment) 최단거리 (미터). 좌표계: equirectangular 근사
function distPointToSegment(pLat, pLng, aLat, aLng, bLat, bLng) {
  const R = 6371000;
  const cosLat = Math.cos(pLat * Math.PI / 180);
  const toM = (dLat, dLng) => [dLat * R * Math.PI / 180, dLng * cosLat * R * Math.PI / 180];
  const [py, px] = toM(pLat, pLng);
  const [ay, ax] = toM(aLat, aLng);
  const [by, bx] = toM(bLat, bLng);
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function filterPlacesNearRoute(places, routeCoords, threshold = 50) {
  return places.filter(p => {
    if (!p.lat || !p.lng) return false;
    for (let i = 0; i < routeCoords.length - 1; i++) {
      const [aLng, aLat] = routeCoords[i];
      const [bLng, bLat] = routeCoords[i + 1];
      if (distPointToSegment(p.lat, p.lng, aLat, aLng, bLat, bLng) <= threshold) return true;
    }
    return false;
  });
}

// 경로 좌표에서 균등 간격으로 최대 maxN개 샘플 추출
function sampleRouteCoords(coords, maxN) {
  if (coords.length <= maxN) return coords;
  const step = (coords.length - 1) / (maxN - 1);
  return Array.from({ length: maxN }, (_, i) => coords[Math.round(i * step)]);
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
    debounceRef.current = setTimeout(() => {
      if (!window.kakao?.maps?.services) return;
      setIsSearching(true);
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(destText, (results, status) => {
        setIsSearching(false);
        if (status === window.kakao.maps.services.Status.OK) setSearchResults(results.slice(0, 5));
        else setSearchResults([]);
      });
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

  const handleDestSubmit = (e) => {
    e?.preventDefault();
    if (!destText.trim() || !window.kakao?.maps?.services) return;
    setIsSearching(true);
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(destText, (results, status) => {
      setIsSearching(false);
      if (status === window.kakao.maps.services.Status.OK) setSearchResults(results.slice(0, 5));
      else setSearchResults([]);
    });
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

  return {
    destText, setDestText, destFocused,
    deptText, setDeptText, deptFocused,
    searchResults, deptSearchResults,
    selectedResult, customDeptCoords,
    isSearching, selectedMode,
    destInputRef, deptInputRef,
    isSearchMode, showResults, showDeptResults, routeStats,
    handleDestFocus, handleDeptFocus, handleCancel,
    handleDestSubmit, handleDeptSubmit,
    handleDeptResultClick, handleDeptClear,
    handleResultClick, handleModeChange, handleExplore,
  };
}
