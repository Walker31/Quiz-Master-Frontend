import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { attemptService } from "@/services/attemptService";
import { analyticsService } from "@/services/analyticsService";

// Icons
import {
  EmojiEvents as EmojiEventsIcon,
  Timer as TimerIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Home as HomeIcon,
  Replay as ReplayIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";

export default function QuizResultPage() {
  const { id: attemptId } = useParams();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await attemptService.getAttemptDetails(attemptId);
        setAttempt(res.data);
        
        // Also fetch leaderboard for this quiz
        const lbRes = await analyticsService.getLeaderboard(res.data.quiz);
        setLeaderboard(lbRes.data);
      } catch (e) {
        console.error("Failed to load result", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-(--color-accent) border-t-transparent animate-spin" />
        <p className="theme-text-muted font-medium">Generating your score report...</p>
      </div>
    );
  }

  if (!attempt) return null;

  const scorePercentage = (attempt.marks_obtained / attempt.total_marks) * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      
      {/* ── Main Score Section ── */}
      <div className="theme-card p-10 relative overflow-hidden mb-8">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-(--color-accent)/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          {/* Progress Ring */}
          <div className="relative h-48 w-48 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96" cy="96" r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="96" cy="96" r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={552.92}
                strokeDashoffset={552.92 - (552.92 * scorePercentage) / 100}
                className="text-(--color-accent) transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black theme-heading">{Math.round(scorePercentage)}%</span>
              <span className="text-[10px] font-bold theme-text-muted uppercase tracking-widest">Score</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-black uppercase tracking-widest mb-4">
              <EmojiEventsIcon fontSize="inherit" /> Exam Completed
            </div>
            <h1 className="theme-heading text-4xl font-black mb-2">Excellent Effort!</h1>
            <p className="theme-text-muted text-lg mb-8 max-w-lg">
              You have successfully completed the <strong>{attempt.quiz_info.title}</strong>. 
              Here is your detailed performance breakdown.
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Link
                to={`/student/review/${attemptId}`}
                className="theme-btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <VisibilityIcon fontSize="small" /> Review Solutions
              </Link>
              <Link
                to="/student/dashboard"
                className="px-8 py-3 rounded-xl border border-(--color-border) theme-text-secondary font-bold hover:bg-(--color-bg-tertiary) transition-all flex items-center gap-2"
              >
                <HomeIcon fontSize="small" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="theme-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
            <AssignmentTurnedInIcon />
          </div>
          <p className="theme-heading text-2xl font-black">{attempt.marks_obtained} / {attempt.total_marks}</p>
          <p className="text-[11px] font-bold theme-text-muted uppercase tracking-widest mt-1">Total Marks</p>
        </div>
        <div className="theme-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
            <TrendingUpIcon />
          </div>
          <p className="theme-heading text-2xl font-black">{attempt.rank || "N/A"}</p>
          <p className="text-[11px] font-bold theme-text-muted uppercase tracking-widest mt-1">Current Rank</p>
        </div>
        <div className="theme-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
            <TimerIcon />
          </div>
          <p className="theme-heading text-2xl font-black">{Math.floor(attempt.time_elapsed_secs / 60)}m {attempt.time_elapsed_secs % 60}s</p>
          <p className="text-[11px] font-bold theme-text-muted uppercase tracking-widest mt-1">Time Taken</p>
        </div>
        <div className="theme-card p-6 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
            <EmojiEventsIcon />
          </div>
          <p className="theme-heading text-2xl font-black">{Math.round(attempt.percentile || 0)}th</p>
          <p className="text-[11px] font-bold theme-text-muted uppercase tracking-widest mt-1">Percentile</p>
        </div>
      </div>

      {/* ── Lower Section ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Section Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="theme-card p-8">
            <h3 className="theme-heading text-xl font-bold mb-6 flex items-center gap-2">
              <AssignmentTurnedInIcon className="text-(--color-accent)" />
              Answer Analysis
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-green-500/5 border border-green-500/10 text-center">
                <p className="text-2xl font-black text-green-600">{attempt.correct_count}</p>
                <p className="text-[10px] font-bold text-green-600/70 uppercase">Correct</p>
              </div>
              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-center">
                <p className="text-2xl font-black text-red-600">{attempt.wrong_count}</p>
                <p className="text-[10px] font-bold text-red-600/70 uppercase">Incorrect</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-500/10 text-center">
                <p className="text-2xl font-black theme-text-muted">{attempt.skipped_count}</p>
                <p className="text-[10px] font-bold theme-text-muted/70 uppercase">Skipped</p>
              </div>
            </div>

            {/* Placeholder for Sectional Progress Bars */}
            <div className="mt-10 space-y-6">
              {attempt.quiz_info.sections?.map(section => (
                <div key={section.id}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold theme-heading">{section.name}</span>
                    <span className="text-[10px] font-bold theme-text-muted uppercase tracking-widest">In Progress...</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-(--color-accent) w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers (Leaderboard) */}
        <div className="theme-card p-8">
          <h3 className="theme-heading text-lg font-bold mb-6 flex items-center gap-2">
            <EmojiEventsIcon className="text-yellow-500" />
            Top Performers
          </h3>
          <div className="space-y-4">
            {leaderboard.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-(--color-bg-secondary) transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${idx < 3 ? "bg-yellow-500 text-white" : "bg-slate-200 dark:bg-slate-800 theme-text-muted"}`}>
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold theme-heading">{user.username}</p>
                    <p className="text-[9px] theme-text-muted uppercase">{user.time}s taken</p>
                  </div>
                </div>
                <span className="text-xs font-black theme-text-accent">{user.score}</span>
              </div>
            ))}
            {leaderboard.length === 0 && <p className="text-center py-10 theme-text-muted text-xs">No other participants yet.</p>}
          </div>
          
          <button className="w-full mt-6 py-3 rounded-xl border border-(--color-border) theme-text-muted text-[10px] font-bold uppercase tracking-widest hover:bg-(--color-bg-tertiary) transition-all">
            View Full Leaderboard
          </button>
        </div>
      </div>

    </div>
  );
}
