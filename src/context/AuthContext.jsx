import { createContext, useContext, useEffect, useState } from "react";
import authService from "@/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const token    = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (_) {
        localStorage.removeItem("userData");
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Called after a successful login or register.
   * `data` = { access, refresh, user } from the v1 API.
   */
  const login = (data) => {
    localStorage.setItem("authToken",    data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("userData",     JSON.stringify(data.user));
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.logout();   // blacklists token on server
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Refresh user profile from /me/ (e.g. after avatar upload).
   */
  const refreshUser = async () => {
    try {
      const updated = await authService.getMe();
      localStorage.setItem("userData", JSON.stringify(updated));
      setUser(updated);
    } catch (_) {}
  };

  // ── Role helpers ─────────────────────────────────────────────────────────────
  const isAdmin      = user?.role === "ADMIN" || user?.role === "SUPERADMIN";
  const isSuperAdmin = user?.role === "SUPERADMIN";
  const isStudent    = user?.role === "STUDENT";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        isSuperAdmin,
        isStudent,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
