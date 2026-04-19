import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { quizService } from "@/services/quizService";
import { useTheme } from "@/context/ThemeContext";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function UserDashboard() {
  const [liveQuizzes, setLiveQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchLiveQuizzes = async () => {
      try {
        const response = await quizService.getLiveQuizzes();
        setLiveQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching live quizzes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveQuizzes();
  }, []);

  return (
    <main className="min-h-screen p-8 pt-24">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="theme-heading text-3xl font-black sm:text-4xl">Your Dashboard</h1>
            <p className="theme-text-muted mt-2">Ready for your next challenge?</p>
          </div>
          <NavLink to="/scores" className={`rounded-2xl border px-5 py-2.5 font-semibold transition ${isDark ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
            View My Scores
          </NavLink>
        </header>

        <section>
          <h2 className="theme-heading mb-6 text-xl font-bold">Upcoming & Live Quizzes</h2>
          {loading ? (
            <p className="theme-text-muted">Loading quizzes...</p>
          ) : liveQuizzes.length === 0 ? (
            <div className="theme-card rounded-3xl p-8 text-center">
              <p className="theme-text-muted">No live quizzes available at the moment. Check back later!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {liveQuizzes.map((quiz) => (
                <div key={quiz.id} className="theme-card relative flex flex-col overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur transition">
                  <div className="flex-1">
                    <span className="mb-4 inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
                      Live
                    </span>
                    <h3 className="theme-heading text-xl font-bold">{quiz.quiz_title}</h3>
                    <p className="theme-text-muted mt-2 text-sm flex items-center gap-1">
                      <AccessTimeIcon fontSize="small" /> {quiz.time_duration} mins
                    </p>
                    {quiz.remarks && <p className="theme-text-secondary mt-2 text-sm">{quiz.remarks}</p>}
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => navigate(`/take-quiz/${quiz.id}`)}
                      className="theme-btn-primary w-full rounded-xl px-4 py-2 flex items-center justify-center gap-2"
                    >
                      <PlayArrowIcon fontSize="small" /> Start Quiz
                    </button>
                  </div>
                  <div className="absolute -right-6 -top-6 -z-10 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl"></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default UserDashboard;
