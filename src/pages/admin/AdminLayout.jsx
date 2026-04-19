import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import {
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  Quiz as QuizIcon,
  BarChart as BarChartIcon,
  Print as PrintIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from "@mui/icons-material";

const sidebarLinks = [
  { to: "/admin", label: "Overview", icon: <DashboardIcon fontSize="small" />, end: true },
  { to: "/admin/subjects", label: "Subjects", icon: <MenuBookIcon fontSize="small" /> },
  { to: "/admin/question-paper", label: "Generate Paper", icon: <PrintIcon fontSize="small" /> },
  { to: "/admin/quizzes", label: "Quizzes", icon: <QuizIcon fontSize="small" /> },
  { to: "/admin/summary", label: "Analytics", icon: <BarChartIcon fontSize="small" /> },
];

function AdminLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = sidebarLinks.map((link) => (
    <NavLink
      key={link.label}
      to={link.to}
      end={link.end}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'
            : (isDark ? 'text-[#9ca3af] hover:text-white hover:bg-[#253044]' : 'text-[#5c6577] hover:text-[#1a1f36] hover:bg-[#eef0f5]')
        }`
      }
    >
      {link.icon}
      {link.label}
    </NavLink>
  ));

  return (
    <div className="flex min-h-screen">
      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      {/* Desktop: fixed below navbar. Mobile: full-height drawer that slides in. */}
      <aside
        className={`
          fixed top-0 md:top-14 bottom-0 w-64 md:w-60 border-r p-4 pt-5 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${isDark ? 'border-[#2d3748] bg-[#1d2332]' : 'border-[#e0e4ec] bg-white'}
          md:translate-x-0 md:left-0 md:z-30
          ${sidebarOpen ? 'translate-x-0 left-0 z-50' : '-translate-x-full left-0 z-50'}
        `}
      >
        {/* Mobile header inside sidebar */}
        <div>
          <div className="flex items-center justify-between mb-5 md:mb-4">
            <p className="theme-text-muted text-[11px] font-bold uppercase tracking-wider px-3">Admin Panel</p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-bg-tertiary)] theme-text-muted"
              aria-label="Close sidebar"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks}
          </nav>
        </div>

        <NavLink
          to="/login"
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-[#6b7280] hover:text-red-400 hover:bg-red-500/10' : 'text-[#8a92a6] hover:text-red-600 hover:bg-red-50'}`}
        >
          <LogoutIcon fontSize="small" /> Logout
        </NavLink>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-60 overflow-y-auto">
        {/* Mobile-only top bar with hamburger */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors
              ${isDark ? 'border-[#2d3748] text-white hover:bg-[#253044]' : 'border-[#e0e4ec] text-[#2c3345] hover:bg-[#eef0f5]'}`}
            aria-label="Open sidebar"
          >
            <MenuIcon fontSize="small" />
          </button>
          <span className="theme-heading text-sm font-semibold">Admin Panel</span>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
