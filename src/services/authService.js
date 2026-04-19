import apiClient from "./api";

// ── New v1 endpoints ──────────────────────────────────────────────────────────
const V1 = {
  LOGIN:    "/api/v1/auth/login/",
  REGISTER: "/api/v1/auth/register/",
  LOGOUT:   "/api/v1/auth/logout/",
  REFRESH:  "/api/v1/auth/refresh/",
  ME:       "/api/v1/auth/me/",
};

/**
 * Persists auth tokens + user to localStorage.
 * New API returns: { access, refresh, user }
 */
function persist(data) {
  localStorage.setItem("authToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);
  localStorage.setItem("userData", JSON.stringify(data.user));
}

function clear() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userData");
}

export const authService = {
  /**
   * Login — returns { access, refresh, user }
   */
  login: async (username, password) => {
    try {
      const { data } = await apiClient.post(V1.LOGIN, { username, password });
      persist(data);
      return data;          // { access, refresh, user: { id, username, role, ... } }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Register — same response shape as login
   * role defaults to 'STUDENT' on the backend; passing it is optional.
   */
  register: async ({ username, email, password, password2, first_name, last_name, phone = "" }) => {
    try {
      const { data } = await apiClient.post(V1.REGISTER, {
        username, email, password, password2: password2 || password,
        first_name, last_name, phone,
      });
      persist(data);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout — blacklists the refresh token on the server, then clears localStorage.
   */
  logout: async () => {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) await apiClient.post(V1.LOGOUT, { refresh });
    } catch (_) {
      // Ignore server errors — we still clear local state
    } finally {
      clear();
    }
  },

  /**
   * Fetch the current user's profile from /me/.
   */
  getMe: async () => {
    const { data } = await apiClient.get(V1.ME);
    return data;
  },

  /**
   * Update the current user's profile (PATCH /me/).
   */
  updateMe: async (payload) => {
    const { data } = await apiClient.patch(V1.ME, payload);
    localStorage.setItem("userData", JSON.stringify(data));
    return data;
  },

  // ── Helpers ──────────────────────────────────────────────────────────────────
  getToken:        () => localStorage.getItem("authToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  isAuthenticated: () => !!localStorage.getItem("authToken"),
  getUser:         () => {
    const raw = localStorage.getItem("userData");
    return raw ? JSON.parse(raw) : null;
  },
};

export default authService;
