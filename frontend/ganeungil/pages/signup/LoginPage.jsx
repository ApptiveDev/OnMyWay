import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LOGO_ICON from "@/assets/Frame 16.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleKakaoLogin = () => {
    navigate("/login/kakao-connecting");
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: 이메일/비밀번호 로그인 API 연결
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-white"
      style={{ fontFamily: "'Pretendard', sans-serif" }}
    >
      <div className="flex flex-col items-center">

        {/* 로고 */}
        <div className="flex items-center gap-2 mb-6">
          <img src={LOGO_ICON} alt="가는길" className="h-[min(40px,5.2vw)]" />
        </div>

        {/* 메인 컨테이너 800px */}
        <div className="flex w-[min(300px,80vw)] flex-col items-center">

          {/* 타이틀 */}
          <h1
            className="text-[16px] text-[#3e2722] text-center mb-2"
            style={{ fontFamily: "MaruBuriOTF", fontWeight: 600 }}
          >
            다시 만나서 반갑습니다
          </h1>
          <p
            className="text-[10px] text-[#3e2722] text-center mb-8"
            style={{ fontFamily: "MaruBuriOTF", fontWeight: 400 }}
          >
            저장한 경로와 장소를 다시 확인하세요.
          </p>

          {/* 폼 */}
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-[8px]">
            {/* 이메일 */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              className="w-full bg-[#fffbec] border border-[#d9d9d9] rounded-full px-[min(20px,2.6vw)] py-[min(9px,1.2vw)] text-[10px] text-[#3e2722] placeholder:text-[#afafaf] outline-none focus:border-[#ed7a13] transition-colors tracking-[-0.378px]"
              style={{ fontFamily: "Pretendard" }}
            />

            {/* 비밀번호 */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full bg-[#fffbec] border border-[#d9d9d9] rounded-full px-[min(20px,2.6vw)] pr-[min(48px,6.3vw)] py-[min(9px,1.2vw)] text-[10px] text-[#3e2722] placeholder:text-[#afafaf] outline-none focus:border-[#ed7a13] transition-colors tracking-[-0.378px]"
                style={{ fontFamily: "Pretendard" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[min(18px,2.3vw)] top-1/2 -translate-y-1/2 text-[#afafaf] hover:text-[#3e2722] transition-colors"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full h-[min(40px,5.2vw)] bg-[#ed7a13] rounded-full text-white text-[10px] tracking-[-0.5px] hover:bg-[#d96e10] transition-colors mt-1"
              style={{ fontFamily: "Pretendard-Medium" }}
            >
              로그인
            </button>
          </form>

          {/* 회원가입 링크 */}
          <p className="mt-5 text-[11px] text-[#3e2722]" style={{ fontFamily: "MaruBuriOTF", fontWeight: 300 }}>
            아직 계정이 없으신가요?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-[#ed7a13] hover:underline text-[11px]"
              style={{ fontFamily: "Pretendard-SemiBold" }}
            >
              회원가입
            </button>
          </p>

          {/* 구분선 */}
          <div className="flex items-center w-full gap-4 my-5">
            <div className="flex-1 h-px bg-[#d9d9d9]" />
            <span className="text-[10px] text-[#d9d9d9]" style={{ fontFamily: "MaruBuriOTF" }}>또는</span>
            <div className="flex-1 h-px bg-[#d9d9d9]" />
          </div>

          {/* 카카오 로그인 */}
          <button
            onClick={handleKakaoLogin}
            className="w-full h-[min(40px,5.2vw)] bg-[#ed7a13] rounded-full text-white text-[10px] tracking-[-0.5px] hover:bg-[#d96e10] transition-colors"
            style={{ fontFamily: "Pretendard-Medium" }}
          >
            카카오로 로그인
          </button>

        </div>
      </div>
    </div>
  );
}
