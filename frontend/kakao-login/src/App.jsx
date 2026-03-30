import React from "react";
import kakaoLoginImg from "./assets/kakaologin-button.png";
import "./App.css";



function App() {
    const REST_API_KEY = "dd0f4c6c919cfb26ee7110989ad5aa46";
    const REDIRECT_URI = "http://localhost:3000/callback"; //수정

    const handleLogin = () => {
        window.location.href =
            `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    };

    return (
        <div className="container">
            <h1>카카오 로그인 구현 테스트 페이지</h1>
            <button onClick={handleLogin} style={{ border: "none", background: "none", padding: 0 }}>
                <div className="kakao-login-button">
                    <img src={kakaoLoginImg} alt="카카오 로그인 버튼" style={{ height: "50px" }} />
                </div>
            </button>

        </div>
    );
}

export default App;
