import { createContext, useCallback, useContext, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          className="fixed left-1/2 bottom-[34px] -translate-x-1/2 bg-[#3E2722] text-[#FFF6E8] text-[14px] px-[22px] py-[13px] rounded-[13px] shadow-[0_8px_26px_rgba(62,39,34,0.3)] z-[999] whitespace-nowrap"
          style={{ fontFamily: "Pretendard-Medium" }}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.showToast;
}
