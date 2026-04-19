import { useState, useEffect } from "react";
import { quizService } from "@/services/quizService";
import { contentService } from "@/services/contentService";
import { useTheme } from "@/context/ThemeContext";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function ManageQuizzes() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [showAddQ, setShowAddQ] = useState(null);
  const [quizForm, setQuizForm] = useState({ quiz_title: "", subject: "", chapter: "", date_of_quiz: "", time_duration: "", remarks: "" });
  const [qForm, setQForm] = useState({ question_statement: "", option_1: "", option_2: "", option_3: "", option_4: "", correct_option: 1 });

  const fetchData = async () => {
    try {
      const [qzRes, sRes, cRes] = await Promise.all([
        quizService.getQuizzes(), 
        contentService.getSubjects(), 
        contentService.getChapters(),
      ]);
      setQuizzes(qzRes.data); setSubjects(sRes.data); setChapters(cRes.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const fetchQuestions = async (quizId) => {
    try {
      const res = await quizService.getQuizDetails(quizId);
      const sections = res.data.sections || [];
      const allQs = sections.flatMap(s => s.quiz_questions);
      setQuestions((prev) => ({ ...prev, [quizId]: allQs }));
    } catch (e) { console.error(e); }
  };

  const toggleExpand = (quizId) => {
    if (expanded === quizId) { setExpanded(null); return; }
    setExpanded(quizId);
    if (!questions[quizId]) fetchQuestions(quizId);
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      await quizService.createQuiz({ ...quizForm, time_duration: parseInt(quizForm.time_duration) });
      setShowAddQuiz(false);
      setQuizForm({ quiz_title: "", subject: "", chapter: "", date_of_quiz: "", time_duration: "", remarks: "" });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleToggleLive = async (quiz) => {
    try { await quizService.toggleLive(quiz.id, !quiz.is_live); fetchData(); } catch (e) { console.error(e); }
  };

  const handleDeleteQuiz = async (id) => {
    if (!confirm("Delete this quiz and all its questions?")) return;
    try { await quizService.deleteQuiz(id); fetchData(); } catch (e) { console.error(e); }
  };

  const handleAddQuestion = async (e, quizId) => {
    e.preventDefault();
    try {
      await quizService.createQuestion({ ...qForm, quiz: quizId, correct_option: parseInt(qForm.correct_option) });
      setShowAddQ(null);
      setQForm({ question_statement: "", option_1: "", option_2: "", option_3: "", option_4: "", correct_option: 1 });
      fetchQuestions(quizId);
    } catch (e) { console.error(e); }
  };

  const handleDeleteQuestion = async (qId, quizId) => {
    try { await quizService.deleteQuestion(qId); fetchQuestions(quizId); } catch (e) { console.error(e); }
  };

  const subjectName = (id) => subjects.find((s) => s.id === id)?.name || "—";
  const chapterName = (id) => chapters.find((c) => c.id === id)?.name || "—";

  if (loading) return <p className="theme-text-muted">Loading...</p>;

  const inputCls = "theme-input w-full rounded-lg px-3 py-2 text-sm";
  const labelCls = "theme-text-secondary text-xs font-medium block mb-1";

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="theme-heading text-2xl font-bold">Quizzes</h1>
          <p className="theme-text-muted text-sm mt-1">{quizzes.length} quizzes total</p>
        </div>
        <button onClick={() => setShowAddQuiz(true)} className="theme-btn-primary flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <AddIcon fontSize="small" /> Add Quiz
        </button>
      </div>

      {/* Add quiz form */}
      {showAddQuiz && (
        <form onSubmit={handleAddQuiz} className="theme-card rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="theme-heading font-semibold">New Quiz</p>
            <button type="button" onClick={() => setShowAddQuiz(false)}><CloseIcon fontSize="small" className="theme-text-muted" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelCls}>Title</label><input value={quizForm.quiz_title} onChange={(e) => setQuizForm({ ...quizForm, quiz_title: e.target.value })} required className={inputCls} /></div>
            <div><label className={labelCls}>Date</label><input type="date" value={quizForm.date_of_quiz} onChange={(e) => setQuizForm({ ...quizForm, date_of_quiz: e.target.value })} required className={inputCls} /></div>
            <div>
              <label className={labelCls}>Subject</label>
              <select value={quizForm.subject} onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })} required className={inputCls}>
                <option value="">Select</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Chapter</label>
              <select value={quizForm.chapter} onChange={(e) => setQuizForm({ ...quizForm, chapter: e.target.value })} required className={inputCls}>
                <option value="">Select</option>
                {chapters.filter((c) => !quizForm.subject || c.subject === parseInt(quizForm.subject)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Duration (min)</label><input type="number" value={quizForm.time_duration} onChange={(e) => setQuizForm({ ...quizForm, time_duration: e.target.value })} required className={inputCls} /></div>
            <div><label className={labelCls}>Remarks</label><input value={quizForm.remarks} onChange={(e) => setQuizForm({ ...quizForm, remarks: e.target.value })} className={inputCls} /></div>
          </div>
          <button type="submit" className="theme-btn-primary rounded-lg px-4 py-2 text-sm">Create Quiz</button>
        </form>
      )}

      {quizzes.length === 0 ? (
        <div className="theme-card rounded-2xl p-10 text-center"><p className="theme-text-muted">No quizzes yet.</p></div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => {
            const isOpen = expanded === quiz.id;
            const qs = questions[quiz.id] || [];
            return (
              <div key={quiz.id} className="theme-card rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => toggleExpand(quiz.id)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={(e) => { e.stopPropagation(); handleToggleLive(quiz); }}
                      className={`shrink-0 ${quiz.is_live ? 'text-emerald-500' : 'theme-text-muted'}`}
                      title={quiz.is_live ? 'Live — click to set offline' : 'Offline — click to go live'}>
                      <FiberManualRecordIcon fontSize="small" />
                    </button>
                    <div className="min-w-0">
                      <p className="theme-heading text-sm font-semibold truncate">{quiz.quiz_title}</p>
                      <p className="theme-text-muted text-xs flex items-center gap-2">
                        {subjectName(quiz.subject)} · {chapterName(quiz.chapter)}
                        <span className="flex items-center gap-0.5"><AccessTimeIcon style={{ fontSize: 14 }} /> {quiz.time_duration}m</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz.id); }}
                      className="p-1.5 rounded-md transition hover:bg-red-500/10 text-red-500/60 hover:text-red-500">
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                    {isOpen ? <ExpandLessIcon fontSize="small" className="theme-text-muted" /> : <ExpandMoreIcon fontSize="small" className="theme-text-muted" />}
                  </div>
                </div>

                {isOpen && (
                  <div className={`px-5 pb-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between py-3">
                      <p className="theme-text-muted text-xs font-semibold uppercase tracking-wider">{qs.length} Question{qs.length !== 1 ? 's' : ''}</p>
                      <button onClick={() => setShowAddQ(quiz.id)}
                        className={`flex items-center gap-1 text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        <AddIcon fontSize="small" /> Add
                      </button>
                    </div>

                    {qs.map((q, i) => (
                      <div key={q.id} className={`rounded-lg px-4 py-3 mb-2 text-sm ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="theme-text"><span className="theme-text-muted mr-1">{i+1}.</span> {q.question_statement}</p>
                          <button onClick={() => handleDeleteQuestion(q.id, quiz.id)} className="shrink-0 p-1 rounded transition hover:bg-red-500/10 text-red-500/60 hover:text-red-500">
                            <DeleteOutlineIcon fontSize="small" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-2 text-xs theme-text-muted">
                          {[1,2,3,4].map((n) => (
                            <span key={n} className={q.correct_option === n ? (isDark ? 'text-emerald-400 font-medium' : 'text-emerald-600 font-medium') : ''}>
                              {String.fromCharCode(64+n)}. {q[`option_${n}`]}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {showAddQ === quiz.id && (
                      <form onSubmit={(e) => handleAddQuestion(e, quiz.id)} className={`rounded-lg p-4 mt-2 space-y-3 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <div><label className={labelCls}>Question</label><textarea value={qForm.question_statement} onChange={(e) => setQForm({ ...qForm, question_statement: e.target.value })} required rows={2} className={inputCls} /></div>
                        <div className="grid gap-2 grid-cols-2">
                          {[1,2,3,4].map((n) => (
                            <div key={n}><label className={labelCls}>Option {n}</label><input value={qForm[`option_${n}`]} onChange={(e) => setQForm({ ...qForm, [`option_${n}`]: e.target.value })} required className={inputCls} /></div>
                          ))}
                        </div>
                        <div><label className={labelCls}>Correct Option</label>
                          <select value={qForm.correct_option} onChange={(e) => setQForm({ ...qForm, correct_option: e.target.value })} className={inputCls}>
                            {[1,2,3,4].map((n) => <option key={n} value={n}>Option {n}</option>)}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="theme-btn-primary rounded-lg px-4 py-2 text-sm">Add Question</button>
                          <button type="button" onClick={() => setShowAddQ(null)} className="theme-text-muted text-sm">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default ManageQuizzes;
