import kakaoLoginImg from "./button/kakaologin-button.png";



function LoginPage() {
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
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

export default LoginPage;