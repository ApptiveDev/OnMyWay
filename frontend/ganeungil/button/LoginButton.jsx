import { useNavigate } from "react-router-dom";

const iconLogin = "https://www.figma.com/api/mcp/asset/56c2a05b-c139-4b23-960a-ddb6123de5a4";

export default function LoginButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/login")}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[#8b7e6a] text-sm hover:text-[#2c2417] transition-colors"
    >
      <img src={iconLogin} alt="" className="w-[15px] h-[15px]" />
      로그인
    </button>
  );
}
