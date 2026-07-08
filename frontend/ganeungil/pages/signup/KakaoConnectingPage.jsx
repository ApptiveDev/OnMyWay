import { useEffect } from "react";
import LOGO_ICON from "@/assets/Frame 16.svg";

export default function KakaoConnectingPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const redirectUri = `${window.location.origin}/signup/terms`;
      window.location.href = `/oauth2/authorization/kakao?redirect-uri=${encodeURIComponent(redirectUri)}&flow=signup`;
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-white"
      style={{ fontFamily: "'Pretendard', sans-serif" }}
    >
      <div className="flex flex-col items-center gap-6">
        <img src={LOGO_ICON} alt="가는길" className="h-[min(40px,5.2vw)]" />

        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#ed7a13] border-t-transparent rounded-full animate-spin" />
          <p
            className="text-[14px] text-[#3e2722]"
            style={{ fontFamily: "'MaruBuri', 'Noto Serif KR', serif", fontWeight: 600 }}
          >
            카카오 계정으로 연결 중..
          </p>
          <p className="text-[10px] text-[#afafaf]">잠시만 기다려 주세요.</p>
        </div>
      </div>
    </div>
  );
}
