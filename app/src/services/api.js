import axios from "axios";
import { jwtDecode } from "jwt-decode";

// url for auth services
const TARGET_AUTH = import.meta.env.VITE_TARGET_AUTH;


// helper function to check if token is expired
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}


// create new axios instance
export const axiosClient = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


// axios instance for refreshing tokens
const refreshAxios = axios.create({
  baseURL: TARGET_AUTH,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


// intercepts axios instance for refreshing tokens. includes CSRF and credentials on requests
refreshAxios.interceptors.request.use((config) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrf_refresh_token=`);
  if (parts.length === 2) {
    const csrfToken = parts.pop().split(";").shift();
    if (csrfToken) {
      config.headers["X-CSRF-TOKEN"] = csrfToken;
    }
  }
  return config;
});


// attempt to refresh if token is missing or expired
let refreshPromise = null;

export const attempt_refresh = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (
    async () => {
      try {
        let token = localStorage.getItem("accessToken");

        if (!token || isTokenExpired(token)) {
          const res = await refreshAxios.post("/auth/refresh");
          token = res.data.tkn_acc;
          localStorage.setItem("accessToken", token);
        }

        return true;
      } catch (err) {
        console.error("[REFRESH FAILED]", err);
        localStorage.clear();
        return false;
      } finally {
        refreshPromise = null;
      }
    }
  )();

  return refreshPromise;
};


// interceptor to attach token on every requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// interceptors for responses, attemtps to silently refresh the token if received UNAUTHORIZED status code
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await attempt_refresh();
      if (refreshed) {
        const token = localStorage.getItem("accessToken");
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
