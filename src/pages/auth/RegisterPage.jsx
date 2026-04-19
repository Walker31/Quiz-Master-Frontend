import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "@/services/authService";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // role defaults to 'STUDENT' on backend
      const data = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      // data = { access, refresh, user }
      setSuccess(true);
      setFormData({ username: "", email: "", password: "", first_name: "", last_name: "" });
      
      console.log("Registration successful:", data);
      
      // Route based on role
      const role = data.user?.role;
      if (role === "ADMIN" || role === "SUPERADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Handle DRF validation errors
      if (typeof err === "object" && err !== null) {
        const msgs = Object.values(err).flat();
        setError(msgs.join(" ") || "Registration failed. Please try again.");
      } else {
        setError(err || "Registration failed. Please try again.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-81px)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section className="space-y-6">
        <span className="theme-badge inline-flex items-center rounded-full px-4 py-2 text-sm">
          Join the community
        </span>
        <h1 className="theme-heading text-4xl font-black tracking-tight sm:text-5xl">
          Create an account to track your progress.
        </h1>
        <p className="theme-text-secondary max-w-xl text-lg leading-8">
          Sign up to unlock detailed stats, review your quiz history, and continue your learning journey.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Track Performance", "Keep a detailed history of your scores."],
            ["Seamless Sync", "Access your quizzes from any device."],
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
              Registration successful! You can now log in.
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="first_name">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                className="theme-input w-full rounded-2xl px-4 py-3 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="last_name">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
                className="theme-input w-full rounded-2xl px-4 py-3 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className="theme-input w-full rounded-2xl px-4 py-3 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="theme-input w-full rounded-2xl px-4 py-3 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="theme-text-secondary mb-2 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="theme-input w-full rounded-2xl px-4 py-3 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="theme-btn-primary mt-2 w-full rounded-2xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p className="theme-text-muted text-center text-sm">
            Already have an account? <NavLink to="/login" className="theme-link">Log in</NavLink>
          </p>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
