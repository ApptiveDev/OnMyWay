import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Onboard_new from "./pages/home/Onboard_1.0";
import Onboard20 from "./pages/find-route/Onboard_2.0";
import Onboard30 from "./pages/explore/Onboard_3.0";
import DiscoverPage from "./pages/discover/discover_page";
import LoginPage from "./pages/signup/LoginPage";
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
        {/* find-route는 지도 기반 앱 화면이라 1440px 고정 프레임(Layout/ScaledFrame) 없이 전체 화면을 그대로 사용 */}
        <Route path="/find-route" element={<Onboard20 />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Onboard_new />} />
          <Route path="/explore" element={<Onboard30 />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
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
