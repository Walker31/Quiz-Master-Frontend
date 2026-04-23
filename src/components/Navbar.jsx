import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState, useRef, useEffect } from "react";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isDark = theme === "dark";
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Hide navbar on exam attempt and result pages
  const noNavbarRoutes = ['/student/attempt/', '/student/result/'];
  const shouldHideNavbar = noNavbarRoutes.some(route => location.pathname.includes(route));

  if (shouldHideNavbar) {
    return null;
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    window.location.href = "/login";
  };

  const baseLink = "px-4 py-2 text-sm font-semibold rounded-lg transition-colors";
  const activeLink = isDark
    ? "bg-[var(--color-accent-light)] text-[var(--color-accent)]"
    : "bg-[var(--color-accent-light)] text-[var(--color-accent)]";
  const inactiveLink = "theme-text-secondary hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)]";

  return (
    <header className="theme-backdrop sticky top-0 z-50 border-b border-(--color-border)">
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-accent) text-base font-black text-white shadow-sm group-hover:shadow-md transition-shadow">
              Q
            </div>
            <p className="theme-heading text-lg font-bold tracking-tight">
              QuizMaster
            </p>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
              Practice
            </NavLink>
            <NavLink to="/scores" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
              Leaderboard
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors border-(--color-border) hover:bg-(--color-bg-tertiary) theme-text-secondary"
            aria-label="Toggle Theme"
          >
            {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </button>

          {isAuthenticated ? (
            // User menu dropdown
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors border-(--color-border) hover:bg-(--color-bg-tertiary) theme-text-secondary"
                aria-label="User Menu"
              >
                <AccountCircleIcon fontSize="small" />
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg border border-(--color-border) shadow-lg z-50 ${isDark ? 'bg-[#1d2332]' : 'bg-white'}`}>
                  <div className="p-3 border-b border-(--color-border)">
                    <p className="text-sm font-semibold theme-text-primary">User Menu</p>
                  </div>
                  <nav className="p-2 space-y-1">
                    <NavLink
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors theme-text-secondary hover:text-(--color-accent) hover:bg-(--color-bg-tertiary)"
                    >
                      <AccountCircleIcon fontSize="small" />
                      Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors theme-text-secondary hover:text-(--color-accent) hover:bg-(--color-bg-tertiary)"
                    >
                      <SettingsIcon fontSize="small" />
                      Settings
                    </NavLink>
                  </nav>
                  <div className="p-2 border-t border-(--color-border)">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-(--color-danger) hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogoutIcon fontSize="small" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Login/Signup buttons
            <div className="flex items-center gap-3 border-l border-(--color-border) pl-3">
              <NavLink to="/login" className="text-sm font-semibold theme-text-secondary transition hover:text-(--color-accent)">
                Log In
              </NavLink>
              <NavLink to="/register" className="theme-btn-primary px-4 py-2 text-sm">
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
