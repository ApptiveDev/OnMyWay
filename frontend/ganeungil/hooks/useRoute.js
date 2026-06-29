import { useRef } from "react";
import iconDestPin from "@/assets/icon-destination-pin.svg";
import IconArrive from "@/assets/iconArrive.svg";

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

  const displayRoute = (features) => {
    const map = kakaoMapRef.current;
    if (!map || !features) return;

    if (polylineRef.current) polylineRef.current.setMap(null);
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

    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "#7BC4A0",
      strokeOpacity: 0.8,
    });
    polyline.setMap(map);
    polylineRef.current = polyline;
    routeMarkersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(pos => bounds.extend(pos));
    map.setBounds(bounds);
  };

  const clearRoute = () => {
    if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; }
    routeMarkersRef.current.forEach(m => m.setMap(null));
    routeMarkersRef.current = [];
  };

  return { handleDestinationSelect, clearDestMarker, clearRoute, displayRoute };
}
