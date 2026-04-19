import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "@/services/quizService";
import { useTheme } from "@/context/ThemeContext";
import SendIcon from '@mui/icons-material/Send';

function QuizTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        const quizRes = await quizService.getQuizDetails(id);
        const qRes = await quizService.getQuestions(id);
        setQuiz(quizRes.data);
        setQuestions(qRes.data);
        setTimeLeft(quizRes.data.time_duration * 60);
      } catch (error) {
        console.error("Error fetching quiz", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizAndQuestions();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && quiz && !loading) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleOptionSelect = (qId, optionNum) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionNum }));
  };

  const handleSubmit = async () => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) score += 1;
    });
    try {
      await quizService.submitScore({
        quiz: id,
        time_taken: (quiz.time_duration * 60) - timeLeft,
        max_marks: questions.length,
        total_scored: score,
      });
      navigate("/scores");
    } catch (error) {
      console.error("Submit failed", error);
    }
  };

  if (loading) return <div className="min-h-screen p-8 pt-24 theme-text">Loading...</div>;
  if (!quiz) return <div className="min-h-screen p-8 pt-24 theme-text">Quiz not found.</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <main className="min-h-screen p-8 pt-24">
      <div className="mx-auto max-w-3xl">
        <header className={`sticky top-20 z-10 mb-8 flex items-center justify-between rounded-2xl p-4 shadow-xl backdrop-blur ${isDark ? 'border border-slate-800 bg-slate-900/80' : 'border border-slate-200 bg-white/80'}`}>
          <div>
            <h1 className="theme-heading text-xl font-bold">{quiz.quiz_title}</h1>
            <p className="theme-text-muted text-sm">{questions.length} Questions</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-bold" style={{ color: 'var(--color-accent)' }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
            <button onClick={handleSubmit} className="theme-btn-primary rounded-xl px-4 py-2 font-bold flex items-center gap-1">
              <SendIcon fontSize="small" /> Submit
            </button>
          </div>
        </header>

        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q.id} className="theme-card rounded-3xl p-6 shadow-xl">
              <h3 className="theme-heading mb-4 text-lg font-semibold">
                <span className="mr-2" style={{ color: 'var(--color-accent)' }}>{index + 1}.</span> {q.question_statement}
              </h3>
              <div className="grid gap-3">
                {[1, 2, 3, 4].map((optNum) => {
                  const optText = q[`option_${optNum}`];
                  const isSelected = answers[q.id] === optNum;
                  return (
                    <button key={optNum} onClick={() => handleOptionSelect(q.id, optNum)}
                      className={`flex w-full items-center rounded-xl border p-4 text-left transition ${
                        isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 theme-heading'
                        : `theme-text-secondary hover:theme-card`
                      }`}
                      style={!isSelected ? { borderColor: 'var(--color-border)' } : undefined}
                    >
                      <span className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full text-xs border ${isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : ''}`}
                        style={!isSelected ? { borderColor: 'var(--color-text-muted)' } : undefined}>
                        {String.fromCharCode(64 + optNum)}
                      </span>
                      {optText}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default QuizTaking;
