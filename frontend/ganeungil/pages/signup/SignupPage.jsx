import { useNavigate } from "react-router-dom";
import LOGO_ICON from "@/assets/Frame 16.svg";

export default function SignupPage() {
  const navigate = useNavigate();

  const handleKakaoSignup = () => {
    navigate("/signup/kakao-connecting");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-white"
      style={{ fontFamily: "'Pretendard', sans-serif" }}
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
          <img src={LOGO_ICON} alt="가는길" className="h-[min(40px,5.2vw)]" />
        </div>

        <div className="flex w-[min(300px,80vw)] flex-col items-center">
          <h1
            className="text-[16px] text-[#3e2722] text-center mb-2"
            style={{ fontFamily: "'MaruBuri', 'Noto Serif KR', serif", fontWeight: 600 }}
          >
            가는길에 오신 것을 환영합니다
          </h1>
          <p
            className="text-[10px] text-[#3e2722] text-center mb-8"
            style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 400 }}
          >
            카카오 계정으로 간편하게 시작하세요.
          </p>

          <button
            onClick={handleKakaoSignup}
            className="w-full h-[min(40px,5.2vw)] bg-[#ed7a13] rounded-full text-white text-[10px] font-medium tracking-[-0.5px] hover:bg-[#d96e10] transition-colors"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            카카오로 회원가입
          </button>

          <p className="mt-5 text-[11px] text-[#3e2722]" style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 300 }}>
            이미 계정이 있으신가요?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#ed7a13] font-semibold hover:underline text-[11px]"
              style={{ fontFamily: "'Pretendard', sans-serif" }}
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
