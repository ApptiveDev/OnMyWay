import { useState, useRef } from "react";
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
  { id: "right",   label: "바른 길",     endpoint: "/route/right" },
  { id: "slow",    label: "여유로운 길", endpoint: "/route/slow" },
  { id: "findOut", label: "발견하는 길", endpoint: "/route/findOut" },
];

export function useRouteSearch({ userCoords, onDestinationSelect, onDrawRoute, onRouteRecs, onRecsHide, onRecsShow, onDestinationClear }) {
  const [destText, setDestText]             = useState("");
  const [destFocused, setDestFocused]       = useState(false);
  const [deptText, setDeptText]             = useState("");
  const [deptFocused, setDeptFocused]       = useState(false);
  const [searchResults, setSearchResults]   = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isSearching, setIsSearching]       = useState(false);
  const [selectedMode, setSelectedMode]     = useState(null);
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

  const fetchRouteData = async (modeId, result, { draw = true } = {}) => {
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
        if (draw) onDrawRoute?.(features);
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
        const cats = response.data.recommendations?.categories ?? [];
        if (modeId === "findOut") {
          const routeCoords = features
            .filter(f => f.geometry.type === "LineString")
            .flatMap(f => f.geometry.coordinates); // [lng, lat]

          // 경로를 따라 최대 6개 지점 샘플 → 각 지점마다 /places/recommend 호출
          const samples = sampleRouteCoords(routeCoords, 6);
          const results = await Promise.all(
            samples.map(([lng, lat]) =>
              api.get("/places/recommend", { params: { lat, lng } })
                .then(r => r.data.categories ?? [])
                .catch(() => [])
            )
          );

          // 전체 장소 합치기 + lat/lng 기준 중복 제거
          const seen = new Set();
          const allPlaces = results
            .flat()
            .flatMap(cat => cat.places ?? [])
            .filter(p => {
              if (!p.lat || !p.lng) return false;
              const key = `${p.lat},${p.lng}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });

          const nearby = filterPlacesNearRoute(allPlaces, routeCoords, 50);

          // 카테고리별 1개씩만
          const seenCat = new Set();
          const onePerCategory = nearby.filter(p => {
            if (seenCat.has(p.category)) return false;
            seenCat.add(p.category);
            return true;
          });

          console.log("[발견하는 길] 수집 장소:", allPlaces.length, "→ 50m 이내:", nearby.length, "→ 카테고리별 1개:", onePerCategory.length);
          if (draw) onRouteRecs?.(onePerCategory);
        } else {
          if (draw) onRouteRecs?.([]);
        }
      } else {
        console.warn("[경로] features 없음. 응답 구조:", JSON.stringify(response.data).slice(0, 200));
      }
    } catch (error) {
      console.error("[경로] API 에러:", error.response?.status, error.response?.data ?? error.message);
    }
  };

  const handleResultClick = (result) => {
    setSelectedResult(result);
    setSearchResults([]);
    setDestText(result.place_name);
    onDestinationSelect?.(result);
  };

  const handleModeChange = (modeId) => {
    setSelectedMode(modeId);
  };

  const handleSearch = () => {
    if (!userCoords) { alert("현재 위치를 먼저 잡아주세요."); return; }
    if (!selectedResult) return;
    const activeMode = selectedMode ?? "slow";
    ROUTE_MODES.forEach(mode => {
      fetchRouteData(mode.id, selectedResult, { draw: mode.id === activeMode });
    });
  };

  return {
    destText, setDestText, destFocused,
    deptText, setDeptText, deptFocused,
    searchResults, selectedResult, isSearching, selectedMode, routeInfo, handleSearch,
    destInputRef, deptInputRef,
    isSearchMode, showResults,
    handleDestFocus, handleDeptFocus, handleCancel,
    handleDestSubmit, handleDeptSubmit,
    handleResultClick, handleModeChange,
  };
}
