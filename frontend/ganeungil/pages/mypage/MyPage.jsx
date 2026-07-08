import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getAccessToken, refreshAccessToken } from "@api/api";
import { useAuth } from "@context/AuthContext";

export default function MyPage() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await refreshAccessToken();
        setAccessToken(getAccessToken());

        const res = await api.get("/api/auth/me");
        setProfile(res.data);
      } catch {
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setAccessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="w-8 h-8 border-2 border-[#ed7a13] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center px-4 py-12"
      style={{ fontFamily: "'Pretendard', sans-serif" }}
    >
      <h1
        className="text-[20px] text-[#3e2722] mb-8"
        style={{ fontFamily: "'MaruBuri', 'Noto Serif KR', serif", fontWeight: 600 }}
      >
        마이페이지
      </h1>

      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-[#fffbec] border border-[#d9d9d9]">
          {profile?.imageURL ? (
            <img src={profile.imageURL} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#afafaf] text-[11px]">
              프로필
            </div>
          )}
        </div>
        <p className="text-[16px] font-semibold text-[#3e2722]">{profile?.nickname}</p>
        <p className="text-[11px] text-[#afafaf]">임시 마이페이지입니다.</p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="px-8 h-[min(40px,5.2vw)] bg-[#ed7a13] rounded-full text-white text-[10px] font-medium tracking-[-0.5px] hover:bg-[#d96e10] transition-colors"
      >
        홈으로 가기
      </button>
    </div>
  );
}
