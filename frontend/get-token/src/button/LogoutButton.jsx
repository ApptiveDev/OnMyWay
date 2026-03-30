import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // 경로 맞게 수정

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <span>로그아웃</span>
    </button>
  );
}

export default LogoutButton;