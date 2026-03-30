//로직처리페이지, 사용자에게는 보이지않음

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const loginProcess = async () => {
      try {
        const res = await api.post("/api/auth/refresh");
        const token = res.data.accessToken;

        localStorage.setItem("accessToken", token);

        navigate("/");
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    loginProcess();
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}

export default OAuthCallback;