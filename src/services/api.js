import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const redirectToLogin = () => {
  window.location.replace("/login");
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach access token ──────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 with refresh + retry ─────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh/`,
          { refresh: refreshToken }
        );
        localStorage.setItem("authToken", data.access);
        apiClient.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        processQueue(null, data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        redirectToLogin();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
