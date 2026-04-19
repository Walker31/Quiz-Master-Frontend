import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function NotFoundPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 ${
        isDark ? "bg-[#0f1419]" : "bg-linear-to-br from-[#f8f9fd] to-[#f0f4f9]"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse ${
            isDark ? "bg-blue-600" : "bg-blue-300"
          }`}
        ></div>
        <div
          className={`absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000 ${
            isDark ? "bg-purple-600" : "bg-purple-300"
          }`}
        ></div>
        <div
          className={`absolute -bottom-8 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000 ${
            isDark ? "bg-pink-600" : "bg-pink-300"
          }`}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-md">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div
            className={`relative w-40 h-40 flex items-center justify-center rounded-2xl ${
              isDark
                ? "bg-linear-to-br from-[#2d3748] to-[#1d2332]"
                : "bg-linear-to-br from-white to-[#f0f4f9]"
            } shadow-2xl`}
          >
            <ErrorIcon
              style={{ fontSize: 120, color: "var(--color-accent)" }}
            />
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-4">
          <h1 className="theme-heading text-7xl font-black mb-2">404</h1>
          <p className="text-2xl font-bold bg-linear-to-r from-(--color-accent) to-[#8b5cf6] bg-clip-text text-transparent">
            Page Not Found
          </p>
        </div>

        {/* Description */}
        <p className="theme-text-muted text-base mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg theme-text-secondary hover:bg-(--color-bg-tertiary) transition-colors border border-(--color-border) font-medium"
          >
            <ArrowBackIcon fontSize="small" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-(--color-accent) text-white hover:bg-(--color-accent-hover) transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            <HomeIcon fontSize="small" />
            Go to Home
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-(--color-border)">
          <p className="theme-text-muted text-sm mb-4">Quick Navigation</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "Subjects", path: "/admin/subjects" },
              { label: "Login", path: "/login" },
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="px-4 py-2 text-sm rounded-lg theme-bg-secondary theme-text-secondary hover:bg-(--color-accent-light) transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Text */}
        <p className="theme-text-muted text-xs mt-8">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
