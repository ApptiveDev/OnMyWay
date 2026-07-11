import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getAccessToken, refreshAccessToken } from "@api/api";
import { useAuth } from "@context/AuthContext";

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{1,10}$/;

function getNicknameHint(nickname) {
  if (!nickname) return null;
  if (NICKNAME_REGEX.test(nickname)) {
    return { type: "valid", text: "사용할 수 있는 닉네임이에요" };
  }
  return { type: "invalid", text: "한글영어숫자만 쓸 수 있어요(공백특수문자불가)" };
}

export default function SignupProfilePage() {
  const [nickname, setNickname] = useState("");
  const [kakaoName, setKakaoName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [previewURL, setPreviewURL] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { setAccessToken, markAuthActive } = useAuth();

  const nicknameHint = getNicknameHint(nickname);
  const isNicknameValid = NICKNAME_REGEX.test(nickname);

  useEffect(() => {
    const init = async () => {
      try {
        if (!getAccessToken()) {
          await refreshAccessToken();
        }

        const meRes = await api.get("/api/auth/me");
        if (meRes.data.status === "ACTIVE") {
          navigate("/", { replace: true });
          return;
        }

        const kakaoImage = meRes.data.imageURL || "";
        const nameFromKakao = meRes.data.kakaoName || meRes.data.nickname || "";
        setKakaoName(nameFromKakao);
        setImageURL(kakaoImage);
        setPreviewURL(kakaoImage);
      } catch {
        navigate("/signup", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate, setAccessToken, markAuthActive]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setPreviewURL(result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isNicknameValid) return;

    setSubmitting(true);
    try {
      const submitImageURL =
        imageURL && (imageURL.startsWith("http://") || imageURL.startsWith("https://"))
          ? imageURL
          : null;

      const response = await api.post("/api/auth/signup/complete", {
        nickname,
        imageURL: submitImageURL,
      });

      setAccessToken(response.data.accessToken);
      markAuthActive();
      navigate("/signup/complete", {
        state: { nickname, imageURL: previewURL || imageURL },
      });
    } catch (err) {
      const errorMsg =
        typeof err.response?.data === "object"
          ? err.response.data.message || JSON.stringify(err.response.data)
          : err.response?.data;
      setError(errorMsg || "프로필 저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="w-full max-w-[min(360px,90vw)]">
        <h1
          className="text-[16px] text-[#3e2722] text-center mb-2"
          style={{ fontFamily: "'MaruBuri', 'Noto Serif KR', serif", fontWeight: 600 }}
        >
          프로필 설정
        </h1>
        <p className="text-[10px] text-[#afafaf] text-center mb-8">
          서비스에서 사용할 사진과 닉네임을 설정해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full overflow-hidden bg-[#fffbec] border border-[#d9d9d9] flex items-center justify-center"
            >
              {previewURL ? (
                <img src={previewURL} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-[#afafaf]">사진 추가</span>
              )}
              <span className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] py-1">
                변경
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {kakaoName && (
              <p className="text-[10px] text-[#858585]">
                카카오 계정 연결됨. {kakaoName}
              </p>
            )}
          </div>

          <div className="w-full">
            <label className="block text-[11px] text-[#3e2722] mb-2 font-medium">
              닉네임 <span className="text-[#afafaf] font-normal">(한글·영어·숫자, 10자 이하)</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError("");
              }}
              placeholder="닉네임을 입력하세요"
              className="w-full bg-[#fffbec] border border-[#d9d9d9] rounded-full px-5 py-2.5 text-[11px] text-[#3e2722] placeholder:text-[#afafaf] outline-none focus:border-[#ed7a13] transition-colors"
            />
            <div className="flex items-center justify-between mt-1">
              {nicknameHint ? (
                <p
                  className={`text-[10px] ${
                    nicknameHint.type === "valid" ? "text-[#ed7a13]" : "text-red-500"
                  }`}
                >
                  {nicknameHint.text}
                </p>
              ) : (
                <span />
              )}
              <p className="text-[10px] text-[#afafaf]">{nickname.length}/10</p>
            </div>
          </div>

          {error && <p className="text-red-500 text-[11px] w-full">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !isNicknameValid}
            className="w-full h-[min(40px,5.2vw)] bg-[#ed7a13] rounded-full text-white text-[10px] font-medium tracking-[-0.5px] hover:bg-[#d96e10] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "저장 중..." : "가입 완료"}
          </button>
        </form>
      </div>
    </div>
  );
}
