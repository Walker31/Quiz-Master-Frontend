import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/authService";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = await authService.login(formData.username, formData.password);

      // data = { access, refresh, user: { id, username, role, ... } }
      login(data);   // store tokens + user in context + localStorage

      setSuccess(true);
      setFormData({ username: "", password: "" });

      // Route based on role (replaces old is_staff check)
      const role = data.user?.role;
      if (role === "ADMIN" || role === "SUPERADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Handle DRF validation errors (can be object or string)
      if (typeof err === "object" && err !== null) {
        const msgs = Object.values(err).flat();
        setError(msgs.join(" ") || "Login failed. Please try again.");
      } else {
        setError(err || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section className="space-y-6">
        <span className="theme-badge inline-flex items-center rounded-full px-4 py-2 text-sm">
          Welcome back
        </span>
        <h1 className="theme-heading text-4xl font-black tracking-tight sm:text-5xl">
          Sign in to continue your quiz journey.
        </h1>
        <p className="theme-text-secondary max-w-xl text-lg leading-8">
          Access your dashboard, review scores, and keep learning from where you left off.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Secure access", "Login through a clean, modern form."],
            ["Quick navigation", "Jump back to the landing page anytime."],
          ].map(([title, text]) => (
            <div key={title} className="theme-card rounded-3xl p-5">
              <h2 className="theme-heading text-lg font-semibold">{title}</h2>
              <p className="theme-text-secondary mt-2 text-sm leading-6">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="theme-card rounded-4xl p-6 shadow-2xl backdrop-blur sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
              Login successful! Redirecting...
            </div>
          )}

          <div>
            <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="theme-input w-full rounded-2xl px-4 py-3 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="theme-input w-full rounded-2xl px-4 py-3 pr-12 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="theme-text-muted absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-blue-500"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </button>
            </div>
          </div>

          <div className="theme-text-muted flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded" disabled={loading} />
              Remember me
            </label>
            <a href="#" className="theme-link">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="theme-btn-primary w-full rounded-2xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p className="theme-text-muted text-center text-sm">
            New here? <NavLink to="/register" className="theme-link">Sign up</NavLink>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
