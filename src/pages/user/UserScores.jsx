import { useState, useEffect } from "react";
import { quizService } from "@/services/quizService";
import { useTheme } from "@/context/ThemeContext";

function UserScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await quizService.getScores();
        setScores(response.data);
      } catch (error) {
        console.error("Error fetching scores", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) return <div className="min-h-screen p-8 pt-24 theme-text">Loading...</div>;

  return (
    <main className="min-h-screen p-8 pt-24">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <h1 className="theme-heading text-3xl font-black sm:text-4xl">My Scores & Summary</h1>
          <p className="theme-text-muted mt-2">Review your past performance</p>
        </header>

        {scores.length === 0 ? (
          <div className="theme-card rounded-3xl p-8 text-center">
            <p className="theme-text-muted">You haven't taken any quizzes yet.</p>
          </div>
        ) : (
          <div className="theme-card overflow-hidden rounded-3xl shadow-xl">
            <table className="w-full text-left text-sm theme-text-secondary">
              <thead className="theme-table-head text-xs uppercase">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Quiz Title</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Date Taken</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Time Taken</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Score</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Percentage</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: 'var(--color-border)' }} className="divide-y">
                {scores.map((score) => {
                  const percentage = Math.round((score.total_scored / score.max_marks) * 100);
                  return (
                    <tr key={score.id} className="transition" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-6 py-4 font-medium theme-heading">{score.quiz ? score.quiz.quiz_title : 'Unknown'}</td>
                      <td className="px-6 py-4">{new Date(score.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{score.time_taken ? `${Math.floor(score.time_taken/60)}m ${score.time_taken%60}s` : 'N/A'}</td>
                      <td className="px-6 py-4 font-bold" style={{ color: 'var(--color-accent)' }}>{score.total_scored} / {score.max_marks}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-12">{percentage}%</span>
                          <div className={`h-2 w-24 overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                            <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: 'var(--color-accent)' }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default UserScores;
