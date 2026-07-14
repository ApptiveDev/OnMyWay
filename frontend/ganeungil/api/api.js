import axios from "axios";

let accessToken = null;
let refreshPromise = null;
let onUnauthorized = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getAccessToken() {
  return accessToken;
}

export function setOnUnauthorized(callback) {
  onUnauthorized = callback;
}

const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    if (status === 401 && (url.includes("/api/auth/refresh") || accessToken)) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = api
    .post("/api/auth/refresh")
    .then((res) => {
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export default api;
