import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "@/services/quizService";
import { attemptService } from "@/services/attemptService";
import { useAuth } from "@/context/AuthContext";

// Icons
import { 
  AccessTime as AccessTimeIcon,
  HelpOutlined as HelpOutlinedIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  CheckCircleOutlined as CheckCircleOutlinedIcon,
  InfoOutlined as InfoOutlinedIcon,
  ErrorOutlined as ErrorOutlinedIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";

import { useNotification } from "@/context/NotificationContext";

export default function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSnackbar, showConfirm } = useNotification();
  
  const [quiz, setQuiz] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, attemptRes] = await Promise.all([
          quizService.getQuizDetails(id),
          attemptService.getAttempts({ quiz: id })
        ]);
        setQuiz(quizRes.data);
        // Assuming the response is a list or has a count
        setAttemptCount(attemptRes.data.count || attemptRes.data.length || 0);
      } catch (e) {
        setError("Failed to load quiz details. It might be unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStartAttempt = async () => {
    showConfirm(
      "Start Exam",
      "Are you sure you want to start the exam? The timer will begin immediately as soon as the exam window opens.",
      async () => {
        setStarting(true);
        try {
          const res = await attemptService.startAttempt(id);
          const attemptId = res.data?.id;
          
          if (!attemptId) {
            throw new Error("Invalid response from server: Missing Attempt ID");
          }

          const url = `/student/attempt/${attemptId}`;
          
          // Open in a new dedicated browser window (like Ctrl+N)
          const width = window.screen.availWidth;
          const height = window.screen.availHeight;
          const examWindow = window.open(
            url, 
            "_blank", 
            `width=${width},height=${height},menubar=no,status=no,toolbar=no,location=no,scrollbars=yes,resizable=yes`
          );
          
          if (!examWindow) {
            showSnackbar("Please allow pop-ups for this site to start the exam.", "warning");
            setStarting(false);
            return;
          }
          
          // Navigate the main window back to dashboard
          navigate('/student/dashboard');
        } catch (e) {
          showSnackbar(e.response?.data?.detail || "Failed to start attempt. Please try again.", "error");
          setStarting(false);
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-(--color-accent) border-t-transparent animate-spin" />
        <p className="theme-text-muted font-medium">Fetching exam details...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-10 theme-card text-center">
        <ErrorOutlinedIcon className="text-red-500 mb-4" sx={{ fontSize: 64 }} />
        <h2 className="theme-heading text-2xl font-bold mb-2">Oops!</h2>
        <p className="theme-text-muted mb-6">{error || "Quiz not found."}</p>
        <button onClick={() => navigate("/student/dashboard")} className="theme-btn-primary px-8 py-2.5">
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quiz Info & Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="theme-card p-8 border-l-8 border-(--color-accent)">
            <div className="flex items-center gap-3 theme-text-accent text-xs font-black uppercase tracking-widest mb-3">
              <SchoolIcon fontSize="inherit" />
              {quiz.exam_type_name || "Competitive Exam"}
            </div>
            <h1 className="theme-heading text-4xl font-black mb-4">{quiz.title}</h1>
            <p className="theme-text-muted text-lg leading-relaxed">
              {quiz.instructions || "Please read all instructions carefully before starting. This exam consists of multiple sections and strict proctoring is enabled."}
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-(--color-bg-tertiary)/50 border border-(--color-border)">
                <AccessTimeIcon className="text-blue-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase theme-text-muted">Duration</p>
                  <p className="theme-heading font-black">{quiz.duration_mins} Minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-(--color-bg-tertiary)/50 border border-(--color-border)">
                <HelpOutlinedIcon className="text-purple-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase theme-text-muted">Questions</p>
                  <p className="theme-heading font-black">{quiz.question_count} Items</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-(--color-bg-tertiary)/50 border border-(--color-border)">
                <AssignmentIcon className="text-green-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase theme-text-muted">Total Marks</p>
                  <p className="theme-heading font-black">{quiz.question_count * 4} Marks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="theme-card p-8">
            <h3 className="theme-heading text-xl font-bold mb-6 flex items-center gap-2">
              <InfoOutlinedIcon className="text-(--color-accent)" />
              Exam Regulations
            </h3>
            <div className="space-y-4">
              {[
                "Candidates must not switch tabs or minimize the browser window.",
                "The exam will be auto-submitted when the timer reaches zero.",
                "Each question carries +4 for correct and -1 for incorrect answers.",
                "Ensure a stable internet connection for the entire duration.",
                "Once started, the attempt cannot be paused or resumed later."
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircleOutlinedIcon className="text-green-500 mt-0.5" fontSize="small" />
                  <span className="theme-text-secondary leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: User Check & Start */}
        <div className="space-y-6">
          <div className="theme-card p-6 bg-linear-to-br from-(--color-accent) to-(--color-accent-hover) text-white border-none shadow-xl">
            <h3 className="text-lg font-bold mb-2">Ready to start?</h3>
            <p className="text-white/80 text-xs mb-6">Verify your details and begin the attempt.</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase opacity-70">Candidate</span>
                <span className="text-sm font-bold">{user?.username}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/10 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase opacity-70">Attempts</span>
                <span className="text-sm font-bold">{attemptCount} / {quiz.max_attempts}</span>
              </div>
            </div>

            {attemptCount >= quiz.max_attempts ? (
              <div className="flex flex-col gap-3">
                <button
                  disabled
                  className="w-full bg-white/20 text-white/50 py-4 rounded-xl font-black text-sm cursor-not-allowed border border-white/10"
                >
                  MAX ATTEMPTS REACHED
                </button>
                <p className="text-center text-[10px] font-bold text-white/90 bg-black/20 py-1 rounded-full px-2">
                  You have exhausted all allowed attempts for this exam.
                </p>
              </div>
            ) : (
              <button
                onClick={handleStartAttempt}
                disabled={starting}
                className="w-full bg-white text-(--color-accent) hover:bg-slate-100 py-4 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 group"
              >
                {starting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-(--color-accent) border-t-transparent animate-spin rounded-full" />
                    Starting Session...
                  </>
                ) : (
                  <>
                    Start Exam Now <ArrowForwardIcon fontSize="small" className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="theme-card p-6 border-dashed border-2">
            <h4 className="theme-heading text-sm font-bold mb-4">Subject Breakdown</h4>
            <div className="space-y-3">
              {quiz.sections?.map(section => (
                <div key={section.id} className="flex items-center justify-between p-3 rounded-xl bg-(--color-bg-secondary)">
                  <span className="text-xs font-bold theme-heading">{section.name}</span>
                  <span className="text-[10px] theme-text-muted px-2 py-1 rounded bg-(--color-bg-tertiary)">{section.max_questions} Qs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
