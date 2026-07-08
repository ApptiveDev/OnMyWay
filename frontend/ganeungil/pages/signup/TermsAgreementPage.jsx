import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { refreshAccessToken } from "@api/api";

const TERMS = [
  { id: "service", label: "서비스 이용약관 동의", required: true },
  { id: "privacy", label: "개인정보처리방침 동의", required: true },
  { id: "location", label: "위치정보수집이용 동의", required: true },
];

export default function TermsAgreementPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState({ service: false, privacy: false, location: false });
  const [allChecked, setAllChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await refreshAccessToken();
        const res = await api.get("/api/auth/me");
        if (res.data.status === "ACTIVE") {
          navigate("/", { replace: true });
        }
      } catch {
        navigate("/signup", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleAllCheck = (value) => {
    setAllChecked(value);
    setChecked({ service: value, privacy: value, location: value });
  };

  const handleSingleCheck = (id, value) => {
    const next = { ...checked, [id]: value };
    setChecked(next);
    setAllChecked(TERMS.every((t) => next[t.id]));
  };

  const allRequiredChecked = TERMS.filter((t) => t.required).every((t) => checked[t.id]);

  const handleSubmit = () => {
    if (!allRequiredChecked) return;
    navigate("/signup/profile");
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
          약관 동의
        </h1>
        <p className="text-[10px] text-[#afafaf] text-center mb-8">
          서비스 이용을 위해 아래 약관에 동의해 주세요.
        </p>

        <div className="border border-[#d9d9d9] rounded-2xl p-4 mb-6">
          <label className="flex items-center gap-3 pb-4 border-b border-[#d9d9d9] cursor-pointer">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={(e) => handleAllCheck(e.target.checked)}
              className="w-4 h-4 accent-[#ed7a13]"
            />
            <span className="text-[12px] font-semibold text-[#3e2722]">전체 동의</span>
          </label>

          <div className="flex flex-col gap-3 pt-4">
            {TERMS.map((term) => (
              <label key={term.id} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked[term.id]}
                    onChange={(e) => handleSingleCheck(term.id, e.target.checked)}
                    className="w-4 h-4 accent-[#ed7a13]"
                  />
                  <span className="text-[11px] text-[#3e2722]">
                    {term.label}
                    {term.required && <span className="text-[#ed7a13] ml-1">(필수)</span>}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-[10px] text-[#afafaf] underline"
                  onClick={(e) => e.preventDefault()}
                >
                  보기
                </button>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allRequiredChecked}
          className="w-full h-[min(40px,5.2vw)] bg-[#ed7a13] rounded-full text-white text-[10px] font-medium tracking-[-0.5px] hover:bg-[#d96e10] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          동의하고 계속하기
        </button>
      </div>
    </div>
  );
}
