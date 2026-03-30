import { useNavigate } from "react-router-dom";

import iconExplore from "@/assets/icon-explore.svg";

export default function ExploreButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/explore")}
      className="flex items-center justify-center gap-2 flex-1 h-[54px] rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white font-medium text-base hover:bg-[rgba(255,255,255,0.2)] transition-colors"
    >
      <img src={iconExplore} alt="" className="w-[17px] h-[17px]" />
      둘러보기
    </button>
  );
}

export function HeaderExploreButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/explore")}
      className="px-4 py-1.5 rounded-full text-[#8b7e6a] text-sm hover:text-[#2c2417] transition-colors"
    >
      둘러보기
    </button>
  );
}
