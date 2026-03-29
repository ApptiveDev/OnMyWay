import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Onboard_new from "./pages/home/Onboard_1.0";
import Onboard20 from "./pages/find-route/Onboard_2.0";
import Onboard30 from "./pages/explore/Onboard_3.0";
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
        <Route element={<Layout />}>
          <Route path="/" element={<Onboard_new />} />
          <Route path="/find-route" element={<Onboard20 />} />
          <Route path="/explore" element={<Onboard30 />} />
        </Route>
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
