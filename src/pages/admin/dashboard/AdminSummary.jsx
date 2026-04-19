import { useState, useEffect } from "react";
import { analyticsService } from "@/services/analyticsService";
import { useTheme } from "@/context/ThemeContext";

function AdminSummary() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getPerformance();
        setScores(res.data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="theme-text-muted">Loading...</p>;

  // Compute aggregates
  const totalAttempts = scores.length;
  const avgScore = scores.length
    ? Math.round(scores.reduce((sum, s) => sum + (s.total_scored / s.max_marks) * 100, 0) / scores.length)
    : 0;
  const topScore = scores.length
    ? Math.max(...scores.map((s) => Math.round((s.total_scored / s.max_marks) * 100)))
    : 0;

  // Per-quiz breakdown
  const quizMap = {};
  scores.forEach((s) => {
    const title = s.quiz?.quiz_title || "Unknown";
    if (!quizMap[title]) quizMap[title] = { attempts: 0, totalPct: 0 };
    quizMap[title].attempts += 1;
    quizMap[title].totalPct += (s.total_scored / s.max_marks) * 100;
  });
  const quizBreakdown = Object.entries(quizMap).map(([title, d]) => ({
    title, attempts: d.attempts, avg: Math.round(d.totalPct / d.attempts),
  })).sort((a, b) => b.attempts - a.attempts);

  return (
    <>
      <div className="mb-8">
        <h1 className="theme-heading text-2xl font-bold">Analytics</h1>
        <p className="theme-text-muted text-sm mt-1">Performance across all students</p>
      </div>

      {/* Top-level metrics */}
      <div className="grid gap-5 sm:grid-cols-3 mb-10">
        {[
          { label: "Total Attempts", value: totalAttempts },
          { label: "Average Score", value: `${avgScore}%` },
          { label: "Top Score", value: `${topScore}%` },
        ].map((m) => (
          <div key={m.label} className="theme-card rounded-2xl p-5">
            <p className="theme-text-muted text-xs font-medium uppercase tracking-wider">{m.label}</p>
            <p className="theme-heading text-3xl font-bold mt-2">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Quiz breakdown */}
      {quizBreakdown.length > 0 && (
        <div className="theme-card rounded-2xl p-5 mb-10">
          <p className="theme-heading font-semibold mb-4">Per-Quiz Breakdown</p>
          <div className="space-y-3">
            {quizBreakdown.map((q) => (
              <div key={q.title} className="flex items-center gap-4">
                <span className="theme-heading text-sm font-medium w-48 truncate">{q.title}</span>
                <div className="flex-1">
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div className="h-full rounded-full" style={{ width: `${q.avg}%`, backgroundColor: 'var(--color-accent)' }} />
                  </div>
                </div>
                <span className="theme-text-muted text-xs w-10 text-right">{q.avg}%</span>
                <span className="theme-text-muted text-xs w-20 text-right">{q.attempts} attempt{q.attempts !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scores table */}
      <div className="theme-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <p className="theme-heading font-semibold">All Scores</p>
        </div>
        {scores.length === 0 ? (
          <div className="p-8 text-center"><p className="theme-text-muted">No scores recorded yet.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="theme-table-head text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Student</th>
                  <th className="px-5 py-3 text-left font-semibold">Quiz</th>
                  <th className="px-5 py-3 text-left font-semibold">Score</th>
                  <th className="px-5 py-3 text-left font-semibold">%</th>
                  <th className="px-5 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {scores.map((s) => {
                  const pct = Math.round((s.total_scored / s.max_marks) * 100);
                  return (
                    <tr key={s.id}>
                      <td className="px-5 py-3 theme-heading font-medium">{s.user?.username || "—"}</td>
                      <td className="px-5 py-3 theme-text-secondary">{s.quiz?.quiz_title || "—"}</td>
                      <td className="px-5 py-3 font-medium" style={{ color: 'var(--color-accent)' }}>{s.total_scored}/{s.max_marks}</td>
                      <td className="px-5 py-3 theme-text-secondary">{pct}%</td>
                      <td className="px-5 py-3 theme-text-muted">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminSummary;
