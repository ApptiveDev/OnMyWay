import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await api.post("/api/auth/logout");
        localStorage.removeItem("accessToken");
        navigate("/");
      } catch (error) {
        console.error("로그아웃 실패:", error);
      }
    };

    logout();
  }, [navigate]);

  return <h1 className="logoutpage">로그아웃 중...</h1>;
}

export default LogoutPage;