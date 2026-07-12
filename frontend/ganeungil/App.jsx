import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Onboard_new from "./pages/home/Onboard_1.0";
import Onboard20 from "./pages/find-route/Onboard_2.0";
import Loading20 from "./pages/find-route/Loading_2.0";
import Onboard30 from "./pages/explore/Onboard_3.0";
import DiscoverPage from "./pages/discover/discover_page";
import LoginPage from "./pages/signup/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import LoginKakaoConnectingPage from "./pages/signup/LoginKakaoConnectingPage";
import KakaoConnectingPage from "./pages/signup/KakaoConnectingPage";
import TermsAgreementPage from "./pages/signup/TermsAgreementPage";
import SignupProfilePage from "./pages/signup/SignupProfilePage";
import SignupCompletePage from "./pages/signup/SignupCompletePage";
import MyPage from "./pages/mypage/MyPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import api from "./api/api";

function AppRoutes() {
  const { syncAuth } = useAuth();

  useEffect(() => {
    syncAuth();
  }, [syncAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Onboard_new />} />
          <Route path="/find-route" element={<Onboard20 />} />
          <Route path="/explore" element={<Onboard30 />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loading" element={<Loading20 />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/kakao-connecting" element={<KakaoConnectingPage />} />
          <Route path="/login/kakao-connecting" element={LoginKakaoConnectingPage}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
