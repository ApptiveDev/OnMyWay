import { useEffect, useRef, useState } from "react";

export default function WithdrawFlow({ onClose, onWithdrawn }) {
  const [step, setStep] = useState("confirm"); // confirm | done
  const [agree, setAgree] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const confirmWithdraw = () => {
    if (!agree) return;
    setStep("done");
    setCountdown(5);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(timerRef.current);
          onWithdrawn?.();
          onClose?.();
          return 0;
        }
        return n - 1;
      });
    }, 1000);
  };

  return (
    <div
      className="fixed top-[64px] left-0 right-0 bottom-0 bg-[#FFFBEC] z-[60] overflow-y-auto"
      style={{ fontFamily: "Pretendard, system-ui, sans-serif" }}
    >
      {step === "confirm" ? (
        <>
          <button
            onClick={onClose}
            className="absolute top-[20px] right-[24px] w-[38px] h-[38px] rounded-[11px] bg-[#F4EEE3] shadow-[0_1px_4px_rgba(62,39,34,0.1)] flex items-center justify-center cursor-pointer hover:bg-[#EDE3D0] active:scale-[0.93] z-10"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="#3E2722" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="max-w-[520px] mx-auto px-[24px] pt-[56px] pb-[60px] text-center">
            <div className="font-bold text-[22px] text-[#3E2722] mb-[18px]" style={{ fontFamily: "MaruBuriOTF" }}>서비스 탈퇴하기</div>
            <div className="text-[14px] text-[#6a5d52] leading-[1.7] mb-[26px]" style={{ fontFamily: "MaruBuriOTF" }}>
              탈퇴하시면 가는길 계정이 삭제되며,<br />삭제된 정보는 복구할 수 없습니다.<br />아래 사항을 확인하신 후 신중하게 결정해 주세요.
            </div>
            <div className="text-left bg-[#EDE7D8] rounded-[16px] px-[22px] py-[20px] text-[13.5px] leading-[1.9] text-[#5a4d42]" style={{ fontFamily: "Pretendard-Medium" }}>
              - 프로필 정보, 카카오 로그인 연동 정보가 삭제됩니다.<br />
              - 저장한 게시글이 모두 삭제됩니다.<br />
              - 저장한 장소(즐겨찾기)가 모두 삭제됩니다.<br />
              - 최근 검색 및 방문 기록 데이터가 모두 삭제됩니다.<br />
              - 작성한 댓글은 삭제되지 않으며, 서비스에 그대로 유지됩니다.<br />
              - 탈퇴 후에는 삭제된 데이터를 복구할 수 없습니다.
            </div>
            <button
              onClick={() => setAgree((v) => !v)}
              className="flex items-center justify-center gap-[8px] my-[22px] cursor-pointer mx-auto"
            >
              <span
                className="w-[20px] h-[20px] rounded-[6px] flex items-center justify-center shrink-0"
                style={{
                  background: agree ? "#ED7A13" : "#fff",
                  boxShadow: agree ? "none" : "inset 0 0 0 1.5px rgba(62,39,34,0.25)",
                }}
              >
                {agree && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M4 12l6 6L20 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-[13.5px] text-[#6a5d52]" style={{ fontFamily: "Pretendard-Medium" }}>안내 사항을 모두 확인하였으며, 이에 동의합니다.</span>
            </button>
            <button
              onClick={confirmWithdraw}
              disabled={!agree}
              className="w-full h-[50px] rounded-[14px] flex items-center justify-center text-[15px] cursor-pointer"
              style={{
                background: agree ? "#ED7A13" : "#EDE7D8",
                color: agree ? "#fff" : "#b3a892",
                boxShadow: agree ? "0 6px 16px rgba(237,122,19,0.3)" : "none",
                fontFamily: "Pretendard-SemiBold",
              }}
            >
              탈퇴하기
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center min-h-full px-[24px] py-[60px]">
          <div className="text-[15px] text-[#3E2722] leading-[1.8] mb-[16px]" style={{ fontFamily: "MaruBuriOTF" }}>
            회원 탈퇴가 완료되었습니다.<br />그동안 가는길 서비스를 이용해 주셔서 감사합니다.
          </div>
          <div className="text-[13px] text-[#9a8e84]" style={{ fontFamily: "MaruBuriOTF" }}>{countdown}초 후에 홈으로 이동합니다.</div>
        </div>
      )}
    </div>
  );
}
