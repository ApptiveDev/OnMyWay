import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import SettingsPanel from "./SettingsPanel";
import WithdrawFlow from "./WithdrawFlow";

// Figma 로고 아이콘 (7일 후 만료 → 로컬 파일로 교체 필요)
import LOGO_ICON from "@/assets/Frame 16.svg";

const NAV_ITEMS = [
  { label: "길찾기",  path: "/find-route" },
  { label: "탐색하기", path: "/discover"   },
  { label: "둘러보기", path: "/explore"    },
];

const DESIGN_W = 1920;
const DESIGN_H = 1275;

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { accessToken, setAccessToken } = useAuth();
  const showToast = useToast();
  const isOnline = useOnlineStatus();

  const [accountOpen, setAccountOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleLogout = () => {
    setAccessToken(null);
    setAccountOpen(false);
    showToast("로그아웃 됐어요");
  };

  return (
    <header
      className="flex-none w-full h-[64px] bg-[#FFFBEC] flex items-center px-[28px] gap-[26px] shadow-[0_1px_0_rgba(62,39,34,0.07)] relative z-20"
      style={{ fontFamily: "Pretendard, system-ui, sans-serif" }}
    >
      {/* 로고 */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-[10px] shrink-0"
      >
        <img src={LOGO_ICON} alt="가는길" className="h-[24px]" />
      </button>

      {/* 내비게이션 */}
      <nav className="flex items-center gap-[26px] ml-[8px]">
        {NAV_ITEMS.map(({ label, path }) => {
          const active = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`text-[15.5px] pb-[3px] border-b-2 cursor-pointer ${
                active
                  ? "font-semibold text-[#3E2722] border-[#3E2722]"
                  : "font-medium text-[#8a7d5f] border-transparent hover:opacity-70"
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* 온라인/오프라인 표시 */}
      <div
        className="flex items-center gap-[7px] px-[11px] py-[6px] rounded-[11px]"
        style={{ background: isOnline ? "rgba(91,168,107,0.12)" : "rgba(201,128,59,0.14)" }}
        title="온라인/오프라인 상태"
      >
        <span
          className="w-[7px] h-[7px] rounded-full"
          style={{ background: isOnline ? "#5BA86B" : "#C9803B" }}
        />
        <span
          className="text-[12px] font-semibold"
          style={{ color: isOnline ? "#5a7d5f" : "#9a6a3a" }}
        >
          {isOnline ? "온라인" : "오프라인"}
        </span>
      </div>

      {/* 계정 영역 */}
      {accessToken ? (
        <div className="relative shrink-0">
          <button
            onClick={() => setAccountOpen((v) => !v)}
            title="내 계정"
            className="w-[34px] h-[34px] rounded-full bg-[#FFF3D6] flex items-center justify-center cursor-pointer transition-colors hover:bg-[#FBE7BE] active:scale-[0.94]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.6" stroke="#8a7d5f" strokeWidth="1.8" />
              <path d="M4.5 20c1.4-4.2 5-6 7.5-6s6.1 1.8 7.5 6" stroke="#8a7d5f" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {accountOpen && (
            <>
              <div className="fixed inset-0 z-[45]" onClick={() => setAccountOpen(false)} />
              <div className="absolute top-[44px] right-0 w-[238px] bg-[#FFFDF2] rounded-[18px] shadow-[0_14px_34px_rgba(62,39,34,0.22)] p-[18px] z-50">
                <div className="flex items-start justify-between">
                  <div className="w-[46px] h-[46px] rounded-full bg-[#22E0E0] shadow-[inset_0_0_0_3px_#fff,0_2px_6px_rgba(62,39,34,0.18)]" />
                  <button
                    title="설정"
                    onClick={() => { setAccountOpen(false); setShowSettings(true); }}
                    className="w-[32px] h-[32px] rounded-[10px] bg-[#F4EEE3] flex items-center justify-center cursor-pointer hover:bg-[#EDE3D0]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" stroke="#8a7d5f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="#8a7d5f" strokeWidth="1.6" />
                    </svg>
                  </button>
                </div>
                <div className="font-['MaruBuri',serif] font-bold text-[16px] text-[#3E2722] mt-[12px]">게스트님, 환영합니다</div>
                <div className="h-px bg-[rgba(62,39,34,0.09)] my-[14px]" />
                <button
                  onClick={handleLogout}
                  className="text-[14px] font-semibold text-[#b3402f] cursor-pointer py-[4px] hover:opacity-70"
                >
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-[8px] shrink-0">
          <button
            onClick={() => navigate("/login")}
            className="text-[#858585] text-[14px] font-medium"
          >
            로그인
          </button>
          <div className="w-px h-[10px] bg-[#858585]" />
          <button
            onClick={() => navigate("/signup")}
            className="text-[#858585] text-[14px] font-medium"
          >
            회원가입
          </button>
        </div>
      )}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} onOpenWithdraw={() => { setShowSettings(false); setShowWithdraw(true); }} />
      )}
      {showWithdraw && (
        <WithdrawFlow onClose={() => setShowWithdraw(false)} onWithdrawn={handleLogout} />
      )}
    </header>
  );
}
