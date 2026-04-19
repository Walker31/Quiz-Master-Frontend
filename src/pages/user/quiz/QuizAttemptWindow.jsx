import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Timer as TimerIcon, 
  ChevronLeft, 
  ChevronRight, 
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  Fullscreen as FullscreenIcon,
  ExitToApp as ExitIcon,
  Menu as MenuIcon
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import attemptService from "@/services/attemptService";
import { useTheme } from "@/context/ThemeContext";

const QuizAttemptWindow = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]); // All questions
  const [currentSectionId, setCurrentSectionId] = useState(null); // Track current section
  const [currentIdx, setCurrentIdx] = useState(0); // Index within current section
  const [responses, setResponses] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ── Fullscreen Logic (Now triggered by button) ──────────────────────────────
  const handleStartExam = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    setHasStarted(true);
  };

  // ── Data Fetching ──────────────────────────────────────────────────────────
  const fetchAttempt = useCallback(async () => {
    try {
      const res = await attemptService.getAttemptDetails(attemptId);
      const attemptData = res.data;
      
      if (attemptData.status === "SUBMITTED") {
        navigate(`/student/result/${attemptId}`);
        return;
      }

      setAttempt(attemptData);
      
      if (!attemptData.quiz_info || !attemptData.quiz_info.sections) {
        console.error("Quiz info missing");
        return;
      }

      // Flatten sections into a single question list
      const allQs = attemptData.quiz_info.sections.flatMap(s => s.quiz_questions);
      console.log("DEBUG: All Questions Data:", allQs);
      setQuestions(allQs);
      
      // Initialize to first section
      if (attemptData.quiz_info.sections.length > 0) {
        setCurrentSectionId(attemptData.quiz_info.sections[0].id);
      }
      setCurrentIdx(0);

      // Map initial responses
      const respMap = {};
      attemptData.responses.forEach(r => {
        respMap[r.quiz_question] = r;
      });
      setResponses(respMap);

      // Timer calculation
      const durationSecs = attemptData.quiz_info.duration_mins * 60;
      const elapsed = attemptData.time_elapsed_secs;
      setTimeRemaining(Math.max(0, durationSecs - elapsed));

    } catch (e) {
      console.error("Failed to fetch attempt", e);
    } finally {
      setLoading(false);
    }
  }, [attemptId, navigate]);

  useEffect(() => {
    fetchAttempt();
  }, [fetchAttempt]);

  // ── Timer Logic ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeRemaining <= 0 || loading) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining, loading]);

  // ── SECTION LOGIC ──────────────────────────────────────────────────────────
  // Filter questions for current section
  const currentSectionQuestions = questions.filter(q => q.section === currentSectionId);
  const currentQ = currentSectionQuestions[currentIdx];
  const currentResp = currentQ ? responses[currentQ.id] : null;

  const handleSectionSwitch = (newSectionId) => {
    if (newSectionId === currentSectionId) return; // No change
    
    // Optionally show confirmation
    if (currentQ && currentResp?.selected_options?.length > 0) {
      if (!window.confirm("You have unsaved responses in this section. Continue switching?")) return;
    }
    
    setCurrentSectionId(newSectionId);
    setCurrentIdx(0); // Reset to first question in new section
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ── Interaction Logic ───────────────────────────────────────────────────────
  const handleOptionSelect = (optionId) => {
    const qId = currentQ.id;
    const prev = responses[qId] || { selected_options: [] };
    
    // Toggle for multiple choice, replace for single
    let newOptions = [optionId];
    if (currentQ.question_data?.q_type === 'MCQ_MULTIPLE') {
      newOptions = prev.selected_options?.includes(optionId)
        ? prev.selected_options.filter(id => id !== optionId)
        : [...(prev.selected_options || []), optionId];
    }

    const updated = { ...prev, selected_options: newOptions, quiz_question: qId };
    setResponses(prevMap => ({ ...prevMap, [qId]: updated }));
    
    // Save to server
    attemptService.updateResponse(attemptId, updated);
  };

  const handleStatusChange = async (status) => {
    const qId = currentQ.id;
    const resp = responses[qId] || { selected_options: [], quiz_question: qId };
    const updated = { ...resp, visit_status: status };
    
    setResponses(prev => ({ ...prev, [qId]: updated }));
    await attemptService.updateResponse(attemptId, updated);

    // Move to next question in same section
    if (currentIdx < currentSectionQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Move to next section if available
      const currentSecIdx = attempt?.quiz_info?.sections.findIndex(s => s.id === currentSectionId);
      if (currentSecIdx < attempt?.quiz_info?.sections.length - 1) {
        const nextSection = attempt.quiz_info.sections[currentSecIdx + 1];
        handleSectionSwitch(nextSection.id);
      }
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit the exam?")) return;
    try {
      await attemptService.submitAttempt(attemptId);
      navigate(`/student/result/${attemptId}`);
    } catch (e) {
      alert("Submission failed. Please check your connection.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-(--color-accent) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="theme-text-secondary font-medium">Initializing Exam Environment...</p>
        </div>
      </div>
    );
  }

  // ── START OVERLAY ──
  if (!hasStarted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020617] text-white p-6">
        <div className="max-w-md w-full bg-[#0f172a] rounded-4xl p-10 shadow-2xl border border-white/5 text-center">
          <div className="h-20 w-20 bg-(--color-accent) rounded-3xl mx-auto mb-8 flex items-center justify-center text-3xl font-black shadow-lg shadow-(--color-accent)/20">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-black mb-2">Welcome, {user?.username}</h2>
          <p className="text-white/50 text-sm mb-10">Candidate ID: {String(user?.id || '').slice(0, 8)}</p>
          
          <div className="space-y-4 mb-10 text-left bg-white/5 p-6 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3 text-xs font-bold text-emerald-400">
                <CheckCircleIcon fontSize="small" /> System Check Passed
             </div>
             <p className="text-[11px] text-white/40 leading-relaxed">
                By clicking "Enter Exam Portal", your browser will enter fullscreen mode and the timer will continue.
             </p>
          </div>

          <button 
            onClick={handleStartExam}
            className="w-full bg-(--color-accent) hover:bg-(--color-accent-dark) text-white py-4 rounded-2xl font-black tracking-wide shadow-xl shadow-(--color-accent)/20 transition-all active:scale-95"
          >
            ENTER EXAM PORTAL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      
      {/* ── HEADER ── */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-(--color-border) bg-white dark:bg-[#0f172a] px-6 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-(--color-accent) rounded flex items-center justify-center text-white font-black italic">QM</div>
            <h1 className="text-lg font-bold tracking-tight hidden md:block">
              {attempt?.quiz_info?.title}
            </h1>
          </div>
          <div className="h-8 w-px bg-(--color-border) hidden md:block" />
          <div className="flex items-center gap-2 text-sm font-medium theme-text-secondary">
             <TimerIcon fontSize="small" className="text-(--color-accent)" />
             <span className={`tabular-nums ${timeRemaining < 300 ? 'text-red-500 animate-pulse font-bold' : ''}`}>
               Time Left: {formatTime(timeRemaining)}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => document.documentElement.requestFullscreen()} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <FullscreenIcon fontSize="small" />
          </button>
          <button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all active:scale-95">
            Submit Exam
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left: Question Area */}
        <main className="flex flex-1 flex-col overflow-hidden bg-slate-50/50 dark:bg-transparent">
          
          {/* Section Tabs */}
          <div className="flex items-center gap-1 border-b border-(--color-border) bg-white dark:bg-[#0f172a]/50 px-6 py-2 overflow-x-auto">
            {attempt?.quiz_info?.sections.map((sec) => (
              <button 
                key={sec.id}
                onClick={() => handleSectionSwitch(sec.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
                  sec.id === currentSectionId 
                    ? 'bg-(--color-accent) text-white shadow-md' 
                    : 'theme-text-muted hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {sec.name}
                <span className="ml-2 text-[10px]">({sec.quiz_questions?.length || 0})</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Question Label */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-(--color-accent) uppercase tracking-widest">
                  Question {currentIdx + 1}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">
                    +{currentQ?.marks_correct ?? currentQ?.question_data?.marks_correct ?? 4} Marks
                  </span>
                  <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20">
                    {currentQ?.marks_wrong ?? currentQ?.question_data?.marks_wrong ?? -1} Negative
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-white dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-(--color-border) shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-slate-900 dark:text-white">
                  {currentQ?.question_data?.text || currentQ?.question_text || "Question content is loading..."}
                </h2>
                {currentQ?.question_data?.image && (
                  <div className="mt-6 rounded-2xl overflow-hidden border border-(--color-border)">
                    <img src={currentQ.question_data.image} alt="Question" className="max-w-full" />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid gap-4 mt-8">
                {currentQ?.question_data?.options?.map((opt) => {
                  const isSelected = currentResp?.selected_options.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      className={`flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 group relative ${
                        isSelected 
                          ? "border-(--color-accent) bg-(--color-accent)/5 shadow-md" 
                          : "border-transparent bg-white dark:bg-slate-900 shadow-sm hover:border-(--color-border) hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 font-bold text-sm transition-colors ${
                        isSelected 
                          ? "border-(--color-accent) bg-(--color-accent) text-white" 
                          : "border-(--color-border) group-hover:border-slate-400 theme-text-muted"
                      }`}>
                        {opt.label}
                      </div>
                      <span className="flex-1 text-base font-medium text-slate-800 dark:text-white">{opt.text}</span>
                      {isSelected && <CheckCircleIcon className="text-(--color-accent) animate-in zoom-in-50 duration-200" />}
                    </button>
                  );
                }) || (
                  <div className="text-center p-10 border-2 border-dashed border-(--color-border) rounded-3xl opacity-50">
                    <p className="text-sm font-bold">No options available for this question type.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <footer className="h-20 shrink-0 border-t border-(--color-border) bg-white dark:bg-[#0f172a] px-6 flex items-center justify-between shadow-2xl z-10">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleStatusChange('REVIEW')}
                className="flex items-center gap-2 border border-orange-500/50 text-orange-600 dark:text-orange-400 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all"
              >
                <FlagIcon fontSize="small" />
                <span className="hidden sm:inline">Mark for Review</span>
              </button>
              <button 
                onClick={() => {
                  const qId = currentQ.id;
                  setResponses(prev => ({ ...prev, [qId]: { ...prev[qId], selected_options: [] } }));
                  attemptService.updateResponse(attemptId, { quiz_question: qId, selected_options: [] });
                }}
                className="theme-text-muted px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                disabled={currentIdx === 0 && !attempt?.quiz_info?.sections.find((s, i) => s.id === currentSectionId && i > 0)}
                onClick={() => {
                  if (currentIdx > 0) {
                    setCurrentIdx(currentIdx - 1);
                  } else {
                    // Move to previous section
                    const currentSecIdx = attempt?.quiz_info?.sections.findIndex(s => s.id === currentSectionId);
                    if (currentSecIdx > 0) {
                      const prevSection = attempt.quiz_info.sections[currentSecIdx - 1];
                      setCurrentSectionId(prevSection.id);
                      setCurrentIdx(prevSection.quiz_questions?.length - 1 || 0);
                    }
                  }
                }}
                className="p-2.5 rounded-xl border border-(--color-border) theme-text-muted disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft />
              </button>
              <button 
                onClick={() => handleStatusChange('ANSWERED')}
                className="bg-(--color-accent) hover:bg-(--color-accent-dark) text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-(--color-accent)/20 transition-all active:scale-95 flex items-center gap-2"
              >
                Save & Next
                <ChevronRight fontSize="small" />
              </button>
            </div>
          </footer>
        </main>

        {/* Right Sidebar: Palette */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} absolute lg:relative right-0 top-0 bottom-0 z-20 w-80 shrink-0 flex flex-col bg-white dark:bg-[#0f172a] border-l border-(--color-border) transition-transform duration-300 ease-in-out`}>
          <div className="p-6 border-b border-(--color-border) bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-(--color-accent) flex items-center justify-center font-black text-white text-xl shadow-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="theme-heading text-sm font-bold truncate">{user?.username}</h4>
                <p className="text-[10px] theme-text-muted font-black uppercase tracking-widest">ID: {String(user?.id || '').slice(0, 8)}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-[11px] font-black theme-text-muted uppercase tracking-widest">Question Palette</h5>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{questions.length} Total</span>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => {
                const resp = responses[q.id];
                const isCurrent = idx === currentIdx && q.section === currentSectionId;
                let statusClass = "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600";
                
                if (resp?.visit_status === "ANSWERED") statusClass = "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20";
                else if (resp?.visit_status === "REVIEW") statusClass = "bg-orange-500 text-white shadow-lg shadow-orange-500/20";
                else if (resp?.visit_status === "VISITED") statusClass = "bg-red-500 text-white shadow-lg shadow-red-500/20";

                // Find index within section for display
                const sectionIdx = questions.filter(x => x.section === q.section).findIndex(x => x.id === q.id);

                return (
                  <button 
                    key={q.id}
                    onClick={() => {
                      // Switch section if needed
                      if (q.section !== currentSectionId) {
                        setCurrentSectionId(q.section);
                      }
                      // Find index within that section
                      const secQs = questions.filter(x => x.section === q.section);
                      const newIdx = secQs.findIndex(x => x.id === q.id);
                      setCurrentIdx(newIdx);
                    }}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black transition-all duration-200 ${statusClass} ${
                      isCurrent ? "ring-2 ring-(--color-accent) ring-offset-4 dark:ring-offset-[#0f172a] scale-110 z-10" : "hover:scale-105"
                    }`}
                    title={`${q.section} - Q${sectionIdx + 1}`}
                  >
                    {sectionIdx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-10 pt-10 border-t border-(--color-border) space-y-4">
               <h6 className="text-[10px] font-black theme-text-muted uppercase tracking-widest">Status Legend</h6>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    ['bg-emerald-500', 'Answered'],
                    ['bg-red-500', 'Not Answered'],
                    ['bg-orange-500', 'Review'],
                    ['bg-slate-100 dark:bg-slate-800', 'Not Visited'],
                  ].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-2">
                       <div className={`h-3 w-3 rounded-full ${color}`} />
                       <span className="text-[10px] font-bold theme-text-secondary">{label}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuizAttemptWindow;
