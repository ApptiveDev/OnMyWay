import iconLocationPin from "@/assets/iconlocation.svg";

// Figma: 위치 권한 동의 (배치 3 · 진입) — node 1412:5762
export default function LocationPermissionModal({ onAllow, onManual }) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-[1px]"
      style={{ background: "rgba(62,39,34,0.28)" }}
    >
      <div className="w-[460px] max-w-[90%] bg-[#FFFBEC] rounded-[24px] shadow-[0px_24px_30px_rgba(62,39,34,0.3)] px-[34px] pt-[36px] pb-[24px] flex flex-col items-center">

        <div className="w-[74px] h-[74px] rounded-full bg-[#FFEDA1] flex items-center justify-center shrink-0">
          <img src={iconLocationPin} alt="" className="w-[36px] h-[36px]" />
        </div>

        <p className="mt-[16px] text-[23px] font-bold text-[#3e2722] text-center whitespace-nowrap" style={{ fontFamily: "MaruBuriOTF" }}>
          현재 위치를 알려주시겠어요?
        </p>

        <p className="mt-[8px] text-[15.5px] text-[#6a5d52] text-center leading-[24.8px]" style={{ fontFamily: "MaruBuriOTF" }}>
          내 주변 500m 안의 가는길을 추천하고,
          <br />
          출발지를 자동으로 채워드려요.
        </p>

        <div className="mt-[24px] flex flex-col gap-[11px] w-full">
          <button
            onClick={onAllow}
            className="h-[52px] rounded-[14px] bg-[#ED7A13] text-white text-[16px] font-bold shadow-[0px_2px_3px_rgba(62,39,34,0.1)] hover:opacity-90 transition-opacity"
            style={{ fontFamily: "Pretendard" }}
          >
            현재 위치 허용
          </button>
          <button
            onClick={onManual}
            className="h-[52px] rounded-[14px] bg-white border border-[#e0dbd3] text-[#6a5d52] text-[16px] font-bold hover:bg-[#fffdf5] transition-colors"
            style={{ fontFamily: "Pretendard" }}
          >
            동네 직접 설정
          </button>
        </div>

        <p className="mt-[16px] text-[12.5px] text-[#a89c8e]" style={{ fontFamily: "MaruBuriOTF" }}>
          위치 정보는 추천에만 쓰이고 저장되지 않아요
        </p>
      </div>
    </div>
  );
}
