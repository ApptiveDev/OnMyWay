import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboard_new from "./components/Onboard_new";
import LoginPage from "./LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import api from "./api/api";

function AppRoutes() {
  const { setAccessToken } = useAuth();

  useEffect(() => {
    api.post("/api/auth/refresh")
      .then((res) => {
        setAccessToken(res.data.accessToken);
      })
      .catch(() => {
        // 쿠키 없음 = 비로그인 상태, 무시
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboard_new />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
