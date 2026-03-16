/* import { useEffect } from "react";

function KakaoMap() {
  useEffect(() => {
    console.log("KakaoMap 실행됨");
    console.log("window.kakao:", window.kakao);

    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오 SDK가 아직 없음"); //여기가 문제 아직 SDK가 없는 것 같음
      return;
    }

    const container = document.getElementById("map");
    if (!container) {
      console.error("map div를 못 찾음");
      return;
    }

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3,
    };

    new window.kakao.maps.Map(container, options); //window.kakao에서 window는 전역객체를 뜻한다. 그래서 앞에 붙여줌
  }, []);

  
  function MoveMap() {
    const moveLatLon = new window.kakao.maps.LatLng(33.452613, 126.570888);
      // 지도 중심을 부드럽게 이동시킵니다
      // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    window.kakao.maps.MoveMap(moveLatLon) }

  return (
    <div>
      <h1>지도 테스트</h1>
      <div id="map" style={{ width: "100%", height: "500px" }} />
    </div>
  );
}

export default KakaoMap;

//그냥 이동시키는거
/* function setCenter() {            
    // 이동할 위도 경도 위치를 생성합니다 
    const moveLatLon = new window.kakao.maps.LatLng(33.452613, 126.570888);
    
    // 지도 중심을 이동 시킵니다
    window.kakao.maps.setCenter(moveLatLon);
}
export default setCenter; */

import { useEffect, useRef } from "react";

function KakaoMap() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오 SDK가 아직 없음");
      return;
    }

    const container = document.getElementById("map");
    if (!container) {
      console.error("map div를 못 찾음");
      return;
    }

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);
    mapRef.current = map;

    const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });

    marker.setMap(map);
    markerRef.current = marker;

    setTimeout(() => {
      const moveLatLon = new window.kakao.maps.LatLng(37.5700, 126.9820);
      mapRef.current.panTo(moveLatLon);
    }, 1000);
  }, []);

  return (
    <div>
      <h1>지도 테스트</h1>
      <div id="map" style={{ width: "100%", height: "500px" }} />
    </div>
  );
}

export default KakaoMap;