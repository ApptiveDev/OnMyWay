import { useToast } from "../context/ToastContext";

export default function SettingsPanel({ onClose, onOpenWithdraw }) {
  const showToast = useToast();
  const notReady = () => showToast("준비 중인 기능이에요");

  return (
    <div
      className="fixed top-[64px] left-0 right-0 bottom-0 bg-[#FFFBEC] z-[60] overflow-y-auto"
      style={{ fontFamily: "Pretendard, system-ui, sans-serif" }}
    >
      <button
        onClick={onClose}
        className="absolute top-[20px] right-[24px] w-[38px] h-[38px] rounded-[11px] bg-[#F4EEE3] shadow-[0_1px_4px_rgba(62,39,34,0.1)] flex items-center justify-center cursor-pointer hover:bg-[#EDE3D0] active:scale-[0.93] z-10"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="#3E2722" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="w-full max-w-[560px] mx-auto px-[24px] pt-[40px] pb-[60px]">
        <div className="text-[19px] font-bold text-[#3E2722] mb-[28px] text-center">설정</div>

        <div className="text-[15px] font-bold text-[#3E2722] mb-[16px]">계정</div>
        <div className="flex items-center gap-[10px] flex-wrap mb-[28px]">
          <div className="flex-1 min-w-[200px] h-[46px] rounded-[13px] bg-[#F4EEE3] flex items-center px-[16px] text-[14px] font-medium text-[#6a5d52]">
            abcd123@gmail.com
          </div>
          <button
            onClick={notReady}
            className="h-[46px] px-[18px] rounded-[13px] bg-[#F4EEE3] flex items-center justify-center text-[13.5px] font-semibold text-[#3E2722] cursor-pointer whitespace-nowrap hover:bg-[#EDE3D0]"
          >
            카카오 계정 관리
          </button>
        </div>

        <div className="h-px bg-[rgba(62,39,34,0.1)] my-[8px_0_28px]" style={{ margin: "8px 0 28px" }} />

        <div className="text-[15px] font-bold text-[#3E2722] mb-[16px]">프로필</div>
        <div className="flex items-start justify-between gap-[24px] flex-wrap">
          <div className="flex-1 min-w-[160px] h-[46px] rounded-[13px] bg-[#F4EEE3] flex items-center px-[16px] text-[14px] font-medium text-[#6a5d52]">
            닉네임
          </div>
          <div className="flex flex-col items-center gap-[10px] shrink-0">
            <div className="w-[74px] h-[74px] rounded-full bg-[#FFE28A] shadow-[inset_0_0_0_3px_#fff,0_2px_6px_rgba(62,39,34,0.15)]" />
            <button
              onClick={notReady}
              className="h-[36px] px-[15px] rounded-[10px] bg-[#F4EEE3] flex items-center justify-center text-[12.5px] font-semibold text-[#3E2722] cursor-pointer hover:bg-[#EDE3D0]"
            >
              프로필 편집
            </button>
          </div>
        </div>

        <div className="h-px bg-[rgba(62,39,34,0.1)]" style={{ margin: "28px 0 22px" }} />

        <div className="text-[15px] font-bold text-[#3E2722] mb-[16px]">고객지원</div>
        <button
          onClick={notReady}
          className="flex items-center justify-between h-[46px] w-full cursor-pointer hover:opacity-75"
        >
          <span className="text-[14px] font-medium text-[#3E2722]">문의하기</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#c9bcae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button
          onClick={notReady}
          className="flex items-center justify-between h-[46px] w-full cursor-pointer hover:opacity-75"
        >
          <span className="text-[14px] font-medium text-[#3E2722]">피드백 보내기</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#c9bcae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        <div className="h-px bg-[rgba(62,39,34,0.1)]" style={{ margin: "8px 0 22px" }} />

        <div className="text-right">
          <button
            onClick={onOpenWithdraw}
            className="text-[13.5px] font-semibold text-[#9a8e84] cursor-pointer hover:text-[#7a6e64]"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}
