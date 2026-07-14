import { useRef } from "react";
import iconDestPin from "@/assets/icon-destination-pin.svg";
import IconArrive from "@/assets/iconArrive.svg";

export function useRoute(kakaoMapRef, mapContainerRef) {
  const destMarkerRef   = useRef(null);
  const polylineRef     = useRef(null);
  const polylineGlowRef = useRef(null);
  const routeMarkersRef = useRef([]);

  const clearDestMarker = () => {
    if (destMarkerRef.current) {
      destMarkerRef.current.setMap(null);
      destMarkerRef.current = null;
    }
  };

  const handleDestinationSelect = (place) => {
    const map = kakaoMapRef.current;
    if (!map) return;
    const pos = new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
    map.setCenter(pos);
    map.setLevel(3);
    clearDestMarker();
    const markerImage = new window.kakao.maps.MarkerImage(
      IconArrive,
      new window.kakao.maps.Size(40, 40),    //피그마에서는 34/34d인데 지도에서 너무 작게 보여서 40/40으로 조정(임의)
      { offset: new window.kakao.maps.Point(20, 40) }
    );
    destMarkerRef.current = new window.kakao.maps.Marker({
      position: pos,
      image: markerImage,
      map,
    });
  };

  const clearRoute = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (polylineGlowRef.current) {
      polylineGlowRef.current.setMap(null);
      polylineGlowRef.current = null;
    }
    routeMarkersRef.current.forEach(m => m.setMap(null));
    routeMarkersRef.current = [];
  };

  const displayRoute = (features, modeId, padding = {}) => {
    const map = kakaoMapRef.current;
    if (!map || !features) return;

    if (polylineRef.current) polylineRef.current.setMap(null);
    if (polylineGlowRef.current) { polylineGlowRef.current.setMap(null); polylineGlowRef.current = null; }
    routeMarkersRef.current.forEach(m => m.setMap(null));
    routeMarkersRef.current = [];

    const path = [];

    features.forEach((feature) => {
      if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach(coord => {
          path.push(new window.kakao.maps.LatLng(coord[1], coord[0]));
        });
      }
    });

    // 바른 길: Background+Shadow 스타일 - 넓은 글로우 레이어 + 좁은 레이어를 겹쳐 그린다
    // 기준 지도 뷰포트(938x688)에서의 두께(49px/10px)를 실제 지도 뷰포트 크기에 맞춰 비율 조정
    const mapEl = mapContainerRef?.current;
    const mapW = mapEl?.clientWidth || 938;
    const mapH = mapEl?.clientHeight || 688;
    const scale = Math.sqrt((mapW * mapH) / (938 * 688));

    // 여유로운 길(slow) / 발견하는 길(right)도 바른 길과 동일한 Background+Shadow 스타일 적용
    const ROUTE_STYLES = {
      slow:  { strokeColor: "rgba(106, 128, 66, 0.30)", strokeOpacity: 0.9 },
      right: { strokeColor: "rgba(62, 39, 34, 0.30)",   strokeOpacity: 0.9 },
    };

    if (modeId === "findOut") {
      const glow = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 49 * scale,
        strokeColor: "#ED7A13",
        strokeOpacity: 0.3 * 0.9,
      });
      glow.setMap(map);
      polylineGlowRef.current = glow;
    } else if (ROUTE_STYLES[modeId]) {
      const glow = new window.kakao.maps.Polyline({
        path,
        strokeWeight: 49 * scale,
        ...ROUTE_STYLES[modeId],
      });
      glow.setMap(map);
      polylineGlowRef.current = glow;
    }

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: modeId === "findOut" || ROUTE_STYLES[modeId] ? 10 * scale : 5,
      strokeColor: ROUTE_STYLES[modeId] ? ROUTE_STYLES[modeId].strokeColor : "#ED7A13",
      strokeOpacity: modeId === "findOut" ? 0.3 * 0.9 : (ROUTE_STYLES[modeId] ? ROUTE_STYLES[modeId].strokeOpacity : 0.85),
    });
    polyline.setMap(map);
    polylineRef.current = polyline;
    routeMarkersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(pos => bounds.extend(pos));
    const { top = 60, right = 60, bottom = 60, left = 60 } = padding;
    map.setBounds(bounds, top, right, bottom, left);
  };

  return { handleDestinationSelect, clearDestMarker, clearRoute, displayRoute };
}
