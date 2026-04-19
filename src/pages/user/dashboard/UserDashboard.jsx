import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { quizService } from "@/services/quizService";
import { analyticsService } from "@/services/analyticsService";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

// Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, statRes] = await Promise.all([
          quizService.getQuizzes({ status: 'PUBLISHED' }),
          analyticsService.getStudentPerformance()
        ]);
        // Handle DRF pagination (results key) or direct array
        setQuizzes(quizRes.data.results || quizRes.data || []);
        setStats(statRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen p-6 pt-24 lg:p-12 lg:pt-32 bg-linear-to-b from-transparent to-(--color-bg-tertiary)/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Welcome Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 theme-text-accent text-xs font-black uppercase tracking-widest mb-2">
              <div className="h-1 w-6 bg-(--color-accent) rounded-full" />
              Student Portal
            </div>
            <h1 className="theme-heading text-4xl font-black sm:text-5xl tracking-tight">
              Welcome back, <span className="text-(--color-accent)">{user?.username}</span> 👋
            </h1>
            <p className="theme-text-muted mt-3 text-lg max-w-md">
              You have {quizzes.length} active assignments waiting for you. Ready to improve your score?
            </p>
          </div>
          
          <div className="flex gap-3">
            <NavLink to="/student/attempts" className="theme-card flex items-center gap-2 px-6 py-3 font-bold text-sm hover:border-(--color-accent) transition-all">
              <AssignmentIcon fontSize="small" /> My History
            </NavLink>
            <NavLink to="/student/analytics" className="theme-btn-primary flex items-center gap-2 px-6 py-3 font-bold text-sm shadow-lg shadow-(--color-accent)/20">
              <TrendingUpIcon fontSize="small" /> Performance
            </NavLink>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="theme-card p-6 bg-linear-to-br from-blue-500/5 to-transparent border-blue-500/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Total Exams</p>
            <h4 className="theme-heading text-3xl font-black">{stats?.total_exams || 0}</h4>
          </div>
          <div className="theme-card p-6 bg-linear-to-br from-emerald-500/5 to-transparent border-emerald-500/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Avg. Score</p>
            <h4 className="theme-heading text-3xl font-black">{Math.round(stats?.avg_percentage || 0)}%</h4>
          </div>
          <div className="theme-card p-6 bg-linear-to-br from-purple-500/5 to-transparent border-purple-500/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-1">Global Rank</p>
            <h4 className="theme-heading text-3xl font-black">#--</h4>
          </div>
        </div>

        {/* Available Quizzes */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="theme-heading text-2xl font-black flex items-center gap-3">
              <EmojiEventsIcon className="text-yellow-500" /> 
              Active Assignments
            </h2>
            <NavLink to="/student/all-quizzes" className="text-xs font-black theme-text-accent hover:underline flex items-center gap-1">
              View All <ChevronRightIcon fontSize="inherit" />
            </NavLink>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="theme-card h-64 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
              ))}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="theme-card rounded-3xl p-16 text-center border-dashed border-2">
              <div className="h-16 w-16 rounded-full bg-(--color-bg-tertiary) flex items-center justify-center mx-auto mb-4">
                <AssignmentIcon className="theme-text-muted" />
              </div>
              <h3 className="theme-heading text-xl font-bold mb-2">No active quizzes</h3>
              <p className="theme-text-muted max-w-xs mx-auto text-sm">
                There are no exams assigned to your batch right now. Check back soon or contact your administrator.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(quizzes) && quizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="group theme-card relative flex flex-col overflow-hidden rounded-3xl p-8 hover:translate-y-[-4px] transition-all duration-300 hover:shadow-2xl hover:shadow-(--color-accent)/10 border-(--color-border) hover:border-(--color-accent-light)"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        Live Now
                      </span>
                      <span className="text-[10px] font-black theme-text-muted uppercase tracking-widest">
                        {quiz.exam_type_name || "Exam"}
                      </span>
                    </div>
                    <h3 className="theme-heading text-2xl font-black leading-tight group-hover:text-(--color-accent) transition-colors">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold theme-text-secondary">
                        <AccessTimeIcon fontSize="inherit" className="text-blue-500" />
                        {quiz.duration_mins}m
                      </div>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <div className="flex items-center gap-1.5 text-xs font-bold theme-text-secondary">
                        <AssignmentIcon fontSize="inherit" className="text-purple-500" />
                        {quiz.question_count} Qs
                      </div>
                    </div>
                  </div>
                  <div className="mt-10">
                    <button
                      onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                      className="theme-btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm shadow-lg shadow-(--color-accent)/10"
                    >
                      View Instructions <ChevronRightIcon fontSize="small" />
                    </button>
                  </div>
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
