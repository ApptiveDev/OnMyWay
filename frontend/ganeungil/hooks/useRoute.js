import { useRef } from "react";
import iconDestPin from "@/assets/icon-destination-pin.svg";

export function useRoute(kakaoMapRef) {
  const destMarkerRef   = useRef(null);
  const polylineRef     = useRef(null);
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
    destMarkerRef.current = new window.kakao.maps.CustomOverlay({
      position: pos,
      content: `
        <div style="
          width:36px; height:36px;
          background:#e8c36a;
          border:3px solid white;
          border-radius:17px 17px 17px 4px;
          box-shadow:0px 2px 8px rgba(0,0,0,0.3);
          display:flex; align-items:center; justify-content:center;
        ">
          <img src="${iconDestPin}" style="width:15px;height:15px;display:block;" />
        </div>
      `,
      map,
      yAnchor: 1,
      xAnchor: 0,
    });
  };

  const createMarkerHTML = (type) => {
    let color = "#c8873a";
    let label = "";
    if (type === "SP") label = "출발";
    else if (type === "EP") label = "도착";
    else if (type.startsWith("PP")) { color = "#2b8237"; label = "경유"; }
    return `<div style="background:${color}; color:white; padding:4px 8px; border-radius:12px; font-size:10px; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.2); margin-bottom:10px;">${label}</div>`;
  };

  const displayRoute = (features) => {
    const map = kakaoMapRef.current;
    if (!map || !features) return;

    if (polylineRef.current) polylineRef.current.setMap(null);
    routeMarkersRef.current.forEach(m => m.setMap(null));
    routeMarkersRef.current = [];

    const path = [];
    const newMarkers = [];

    features.forEach((feature) => {
      if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach(coord => {
          path.push(new window.kakao.maps.LatLng(coord[1], coord[0]));
        });
      }
      if (feature.geometry.type === "Point") {
        const { pointType } = feature.properties;
        const coords = feature.geometry.coordinates;
        const pos = new window.kakao.maps.LatLng(coords[1], coords[0]);
        if (pointType === "SP" || pointType === "EP" || pointType.startsWith("PP")) {
          const marker = new window.kakao.maps.CustomOverlay({
            position: pos,
            content: createMarkerHTML(pointType),
            yAnchor: 1,
          });
          marker.setMap(map);
          newMarkers.push(marker);
        }
      }
    });

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "#c8873a",
      strokeOpacity: 0.8,
    });
    polyline.setMap(map);
    polylineRef.current = polyline;
    routeMarkersRef.current = newMarkers;

    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(pos => bounds.extend(pos));
    map.setBounds(bounds);
  };

  return { handleDestinationSelect, clearDestMarker, displayRoute };
}
