import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, {
  refreshAccessToken,
  setAccessToken as setApiAccessToken,
  setOnUnauthorized,
} from "@api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  const setAccessToken = useCallback((token) => {
    setApiAccessToken(token);
    setAccessTokenState(token || null);
  }, []);

  const clearAuth = useCallback(() => {
    setApiAccessToken(null);
    setAccessTokenState(null);
    setUserStatus(null);
  }, []);

  const markAuthActive = useCallback(() => {
    setUserStatus("ACTIVE");
  }, []);

  const syncAuth = useCallback(async () => {
    try {
      await refreshAccessToken();
      const res = await api.get("/api/auth/me");
      setUserStatus(res.data.status);
      return res.data;
    } catch {
      clearAuth();
      return null;
    }
  }, [clearAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // 서버 오류여도 클라이언트 상태는 정리
    }
    clearAuth();
  }, [clearAuth]);

  useEffect(() => {
    setOnUnauthorized(clearAuth);
    return () => setOnUnauthorized(null);
  }, [clearAuth]);

  const isLoggedIn = userStatus === "ACTIVE";

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userStatus,
        isLoggedIn,
        setAccessToken,
        syncAuth,
        markAuthActive,
        clearAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
