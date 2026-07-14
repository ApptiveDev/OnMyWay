import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { refreshAccessToken } from "@api/api";
import { useAuth } from "@context/AuthContext";

export default function SignupCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { markAuthActive } = useAuth();
  const [nickname, setNickname] = useState(location.state?.nickname || "");
  const [imageURL, setImageURL] = useState(location.state?.imageURL || "");
  const [loading, setLoading] = useState(!location.state?.nickname);

  useEffect(() => {
    markAuthActive();
  }, [markAuthActive]);

  useEffect(() => {
    if (location.state?.nickname) return;

    const load = async () => {
      try {
        await refreshAccessToken();
        const res = await api.get("/api/auth/me");
        setNickname(res.data.nickname || "");
        setImageURL(res.data.imageURL || "");
      } catch {
        navigate("/signup", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 border-2 border-[#ed7a13] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-white px-4"
      style={{ fontFamily: "'Pretendard', sans-serif" }}
    >
      <div className="w-full max-w-[min(360px,90vw)] flex flex-col items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-[#fffbec] border border-[#d9d9d9] mb-6">
          {imageURL ? (
            <img src={imageURL} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#afafaf] text-[10px]">
              프로필
            </div>
          )}
        </div>

        <h1
          className="text-[20px] text-[#3e2722] text-center mb-3"
          style={{ fontFamily: "'MaruBuri', 'Noto Serif KR', serif", fontWeight: 600 }}
        >
          {nickname}님, 환영해요!
        </h1>

        <p
          className="text-[11px] text-[#858585] text-center mb-10 leading-relaxed"
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          가는 길과 함께 동네의 새로운 길을 발견해 보세요.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full h-[min(40px,5.2vw)] bg-[#ed7a13] rounded-full text-white text-[10px] font-medium tracking-[-0.5px] hover:bg-[#d96e10] transition-colors"
        >
          가는길이용하기
        </button>
      </div>
    </div>
  );
}
