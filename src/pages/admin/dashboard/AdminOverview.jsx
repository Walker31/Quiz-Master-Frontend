import { useTheme } from "@/context/ThemeContext";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function AdminOverview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const stats = [
    { name: "Total Quizzes", value: "12", change: "+2 this week", up: true, icon: <QuizIcon />, color: "#2b73d0", bg: "rgba(43,115,208,0.12)" },
    { name: "Active Students", value: "148", change: "+12%", up: true, icon: <PeopleIcon />, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
    { name: "Completion Rate", value: "84%", change: "-2%", up: false, icon: <CheckCircleOutlinedIcon />, color: "#27ae60", bg: "rgba(39,174,96,0.12)" },
    { name: "Avg. Time / Quiz", value: "14m", change: "+1m", up: false, icon: <AccessTimeIcon />, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  ];

  const weeklyData = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 80 },
    { day: "Wed", value: 45 },
    { day: "Thu", value: 90 },
    { day: "Fri", value: 70 },
    { day: "Sat", value: 55 },
    { day: "Sun", value: 40 },
  ];
  const maxVal = Math.max(...weeklyData.map(d => d.value));

  const recentActivity = [
    { id: 1, user: "Alice M.", initials: "AM", action: "completed", target: "Intro to Physics", time: "2 hours ago", status: "success" },
    { id: 2, user: "John D.", initials: "JD", action: "scored 95% on", target: "Calculus 101", time: "4 hours ago", status: "success" },
    { id: 3, user: "Sarah K.", initials: "SK", action: "started", target: "World History", time: "5 hours ago", status: "pending" },
    { id: 4, user: "Mike R.", initials: "MR", action: "failed", target: "Organic Chemistry", time: "6 hours ago", status: "failed" },
  ];

  const topPerformers = [
    { rank: 1, name: "Alice M.", initials: "AM", score: 2480, quizzes: 24 },
    { rank: 2, name: "John D.", initials: "JD", score: 2210, quizzes: 21 },
    { rank: 3, name: "Sarah K.", initials: "SK", score: 1980, quizzes: 19 },
  ];

  const statusColors = {
    success: { dot: "var(--color-success)", bg: isDark ? "rgba(39,174,96,0.15)" : "rgba(39,174,96,0.1)", text: "var(--color-success)" },
    pending: { dot: "#f59e0b", bg: isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.1)", text: "#f59e0b" },
    failed: { dot: "var(--color-danger)", bg: isDark ? "rgba(231,76,60,0.15)" : "rgba(231,76,60,0.1)", text: "var(--color-danger)" },
  };

  const avatarColors = ["#2b73d0", "#8b5cf6", "#27ae60", "#f59e0b", "#e74c3c"];

  return (
    <>
      {/* Welcome Banner */}
      <div
        className="rounded-xl p-6 mb-8 relative overflow-hidden"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1e3a5f 0%, #253044 50%, #1d2332 100%)"
            : "linear-gradient(135deg, #2b73d0 0%, #4a90e2 50%, #6ba5ec 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="100" fill="white"/></svg>
        </div>
        <div className="absolute bottom-0 right-20 w-32 h-32 opacity-5">
          <svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="100" fill="white"/></svg>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold mb-1">Welcome back, Admin 👋</h1>
            <p className="text-white/70 text-sm">Here's what's happening with your quizzes today.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-white/15 text-white border border-white/20 hover:bg-white/25 transition-colors backdrop-blur-sm">
            <AddIcon fontSize="small" /> Create Quiz
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s) => (
          <div key={s.name} className="theme-card p-5 group hover:translate-y-[-2px] transition-transform duration-200">
            <div className="flex items-start justify-between mb-4">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{
                backgroundColor: s.up ? (isDark ? "rgba(39,174,96,0.15)" : "rgba(39,174,96,0.1)") : (isDark ? "rgba(231,76,60,0.15)" : "rgba(231,76,60,0.1)"),
                color: s.up ? "var(--color-success)" : "var(--color-danger)",
              }}>
                {s.up ? <TrendingUpIcon style={{ fontSize: 14 }} /> : <TrendingDownIcon style={{ fontSize: 14 }} />}
                {s.change}
              </div>
            </div>
            <p className="theme-heading text-3xl font-bold">{s.value}</p>
            <p className="theme-text-muted text-sm mt-1">{s.name}</p>
          </div>
        ))}
      </div>

      {/* Charts + Activity Row */}
      <div className="grid gap-5 lg:grid-cols-5 mb-8">
        {/* Weekly Activity Chart */}
        <div className="theme-card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="theme-heading text-base font-semibold">Weekly Activity</h2>
              <p className="theme-text-muted text-xs mt-0.5">Quiz submissions this week</p>
            </div>
            <div className="flex gap-2">
              {["This Week", "Last Week"].map((label, i) => (
                <button
                  key={label}
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                  style={{
                    backgroundColor: i === 0 ? "var(--color-accent-light)" : "transparent",
                    color: i === 0 ? "var(--color-accent)" : "var(--color-text-muted)",
                    border: i === 0 ? "none" : "1px solid var(--color-border)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-3 h-44">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="theme-text-muted text-xs font-semibold">{d.value}</span>
                <div
                  className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
                  style={{
                    height: `${(d.value / maxVal) * 100}%`,
                    background: d.value === maxVal
                      ? "linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)"
                      : (isDark ? "rgba(74,144,226,0.25)" : "rgba(43,115,208,0.15)"),
                    minHeight: "12px",
                  }}
                />
                <span className="theme-text-muted text-xs">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="theme-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <EmojiEventsIcon style={{ color: "#f59e0b", fontSize: 20 }} />
              <h2 className="theme-heading text-base font-semibold">Top Performers</h2>
            </div>
            <button className="theme-link text-xs font-medium flex items-center gap-1">
              View all <ArrowForwardIcon style={{ fontSize: 14 }} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {topPerformers.map((p, i) => (
              <div
                key={p.rank}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-[var(--color-bg-card-hover)]"
                style={{ border: "1px solid var(--color-border)" }}
              >
                <span className="text-sm font-bold theme-text-muted w-5 text-center">#{p.rank}</span>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: avatarColors[i] }}
                >
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="theme-heading text-sm font-semibold">{p.name}</p>
                  <p className="theme-text-muted text-xs">{p.quizzes} quizzes completed</p>
                </div>
                <div className="text-right">
                  <p className="theme-heading text-sm font-bold">{p.score.toLocaleString()}</p>
                  <p className="theme-text-muted text-xs">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="theme-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="theme-heading text-base font-semibold">Recent Activity</h2>
          <button className="theme-link text-sm font-medium flex items-center gap-1">
            View all <ArrowForwardIcon style={{ fontSize: 16 }} />
          </button>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {recentActivity.map((a) => {
            const sc = statusColors[a.status];
            return (
              <div key={a.id} className="px-5 py-4 flex items-center gap-4 hover:bg-[var(--color-bg-card-hover)] transition-colors">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: avatarColors[a.id % avatarColors.length] }}
                >
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="theme-text text-sm">
                    <span className="theme-heading font-semibold">{a.user}</span>{' '}
                    <span className="theme-text-secondary">{a.action}</span>{' '}
                    <span className="theme-link font-medium">{a.target}</span>
                  </p>
                  <p className="theme-text-muted text-xs mt-0.5">{a.time}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0"
                  style={{ backgroundColor: sc.bg, color: sc.text }}
                >
                  {a.status === "success" ? "Completed" : a.status === "pending" ? "In Progress" : "Failed"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default AdminOverview;
