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

  const displayRoute = (features, modeId, padding = {}) => {
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
    });

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "rgba(123, 196, 160, 0.75)",
      strokeOpacity: 1,
    });
    polyline.setMap(map);
    polylineRef.current = polyline;
    routeMarkersRef.current = newMarkers;

    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(pos => bounds.extend(pos));
    const { top = 60, right = 60, bottom = 60, left = 60 } = padding;
    map.setBounds(bounds, top, right, bottom, left);
  };

  return { handleDestinationSelect, clearDestMarker, displayRoute };
}
