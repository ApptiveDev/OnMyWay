import { useNavigate } from "react-router-dom";

const iconFind = "https://www.figma.com/api/mcp/asset/5360215b-dbc1-41f2-b010-bd2c8428cdd5";

export default function FindRouteButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/find-route")}
      className="flex items-center justify-center gap-2 flex-1 h-[54px] rounded-full bg-[#e8c36a] text-[#2c2417] font-medium text-base hover:bg-[#d4a94f] transition-colors"
    >
      <img src={iconFind} alt="" className="w-[17px] h-[17px]" />
      길찾기
    </button>
  );
}

export function HeaderFindRouteButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/find-route")}
      className="px-4 py-1.5 rounded-full text-[#8b7e6a] text-sm hover:text-[#2c2417] transition-colors"
    >
      길찾기
    </button>
  );
}
