import { useState, useRef } from "react";
import api from "../api/api";

export const ROUTE_MODES = [
  { id: "right",   label: "바른 길",     endpoint: "/route/right" },
  { id: "slow",    label: "여유로운 길", endpoint: "/route/slow" },
  { id: "findOut", label: "발견하는 길", endpoint: "/route/findOut" },
];

export function useRouteSearch({ userCoords, onDestinationSelect, onDrawRoute, onRecsHide, onRecsShow, onDestinationClear }) {
  const [destText, setDestText]             = useState("");
  const [destFocused, setDestFocused]       = useState(false);
  const [deptText, setDeptText]             = useState("");
  const [deptFocused, setDeptFocused]       = useState(false);
  const [searchResults, setSearchResults]   = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isSearching, setIsSearching]       = useState(false);
  const [selectedMode, setSelectedMode]     = useState("slow");
  const [routeInfo, setRouteInfo]           = useState({});

  const destInputRef = useRef(null);
  const deptInputRef = useRef(null);

  const isSearchMode = destFocused || deptFocused;
  const showResults  = searchResults.length > 0;

  const handleDestFocus = () => { setDestFocused(true); onRecsHide?.(); };
  const handleDeptFocus = () => { setDeptFocused(true); onRecsHide?.(); };

  const handleCancel = () => {
    setDestText(""); setDeptText("");
    setDestFocused(false); setDeptFocused(false);
    setSearchResults([]); setSelectedResult(null);
    onRecsShow?.(); onDestinationClear?.();
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

  const fetchRouteData = async (modeId, result) => {
    if (!userCoords || !result) {
      console.warn("[경로] 중단 - userCoords:", userCoords, "result:", result);
      return;
    }
    const mode = ROUTE_MODES.find(m => m.id === modeId);
    console.log(`[경로] ${mode.label} 요청`, { from: userCoords, to: { y: result.y, x: result.x } });
    try {
      const response = await api.post(mode.endpoint, [
        { lat: userCoords.lat, lon: userCoords.lng },
        { lat: parseFloat(result.y), lon: parseFloat(result.x) },
      ]);
      console.log("[경로] 응답:", response.data);
      const features = response.data.route?.features;
      console.log("[경로] features:", features?.length, "개");
      if (features && Array.isArray(features)) {
        onDrawRoute?.(features);
        const summary = features[0]?.properties;
        if (summary?.totalTime != null) {
          setRouteInfo(prev => ({
            ...prev,
            [modeId]: {
              time: Math.round(summary.totalTime / 60),
              distance: (summary.totalDistance / 1000).toFixed(1),
            },
          }));
        }
      } else {
        console.warn("[경로] features 없음. 응답 구조:", JSON.stringify(response.data).slice(0, 200));
      }
    } catch (error) {
      console.error("[경로] API 에러:", error.response?.status, error.response?.data ?? error.message);
    }
  };

  const handleResultClick = async (result) => {
    setSelectedResult(result);
    setSearchResults([]);
    setDestText(result.place_name);
    onDestinationSelect?.(result);
    if (!userCoords) { alert("현재 위치를 먼저 잡아주세요."); return; }
    fetchRouteData(selectedMode, result);
  };

  const handleModeChange = (modeId) => {
    setSelectedMode(modeId);
    if (selectedResult) fetchRouteData(modeId, selectedResult);
  };

  return {
    destText, setDestText, destFocused,
    deptText, setDeptText, deptFocused,
    searchResults, selectedResult, isSearching, selectedMode, routeInfo,
    destInputRef, deptInputRef,
    isSearchMode, showResults,
    handleDestFocus, handleDeptFocus, handleCancel,
    handleDestSubmit, handleDeptSubmit,
    handleResultClick, handleModeChange,
  };
}
