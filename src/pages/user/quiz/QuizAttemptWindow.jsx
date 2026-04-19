import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Timer as TimerIcon, 
  ChevronLeft, 
  ChevronRight, 
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import attemptService from "@/services/attemptService";

const QuizAttemptWindow = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // NTA JEE Standard Colors
  const NTA_COLORS = {
    primary: '#0a2a6e',      // Deep navy blue
    accent: '#c8950a',       // Gold
    success: '#1a7a3a',      // Green
    warning: '#f5a623',      // Orange
    danger: '#c0392b',       // Red
    lightBg: '#f5f6fa',      // Light background
    lightBorder: '#dde2f0',  // Light border
  };

  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ── Fullscreen Management ──────────────────────────────────────────────────
  const handleEnterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen({ navigationUI: "hide" });
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      }
      setHasStarted(true);
    } catch (err) {
      console.error("Fullscreen error:", err);
      setHasStarted(true);
    }
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
      
      if (!attemptData.quiz_info?.sections) {
        console.error("Quiz info missing");
        return;
      }

      const allQs = attemptData.quiz_info.sections.flatMap(s => s.quiz_questions || []);
      setQuestions(allQs);
      
      if (attemptData.quiz_info.sections.length > 0) {
        setCurrentSectionId(attemptData.quiz_info.sections[0].id);
      }
      setCurrentIdx(0);

      const respMap = {};
      attemptData.responses?.forEach(r => {
        respMap[r.quiz_question] = r;
      });
      setResponses(respMap);

      const durationSecs = attemptData.quiz_info.duration_mins * 60;
      const elapsed = attemptData.time_elapsed_secs || 0;
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

  // ── Timer Logic ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeRemaining <= 0 || loading || !hasStarted) return;
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
  }, [timeRemaining, loading, hasStarted]);

  // ── Section & Question Logic ──────────────────────────────────────────────
  const currentSectionQuestions = questions.filter(q => q.section === currentSectionId);
  const currentQ = currentSectionQuestions[currentIdx];
  const currentResp = currentQ ? responses[currentQ.id] : null;

  const handleSectionSwitch = (newSectionId) => {
    if (newSectionId === currentSectionId) return;
    if (currentQ && currentResp?.selected_options?.length > 0) {
      if (!window.confirm("You have unsaved responses. Switch section?")) return;
    }
    setCurrentSectionId(newSectionId);
    setCurrentIdx(0);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionId) => {
    const qId = currentQ.id;
    const prev = responses[qId] || { selected_options: [] };
    
    let newOptions = [optionId];
    if (currentQ.question_data?.q_type === 'MCQ_MULTIPLE') {
      newOptions = prev.selected_options?.includes(optionId)
        ? prev.selected_options.filter(id => id !== optionId)
        : [...(prev.selected_options || []), optionId];
    }

    const updated = { ...prev, selected_options: newOptions, quiz_question: qId };
    setResponses(prev => ({ ...prev, [qId]: updated }));
    attemptService.updateResponse(attemptId, updated);
  };

  const handleStatusChange = async (status) => {
    const qId = currentQ.id;
    const resp = responses[qId] || { selected_options: [], quiz_question: qId };
    const updated = { ...resp, visit_status: status };
    
    setResponses(prev => ({ ...prev, [qId]: updated }));
    await attemptService.updateResponse(attemptId, updated);

    if (currentIdx < currentSectionQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
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
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: NTA_COLORS.lightBg }}>
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#666' }} className="font-medium">Initializing Exam...</p>
        </div>
      </div>
    );
  }

  // ── START SCREEN ──────────────────────────────────────────────────────────
  if (!hasStarted) {
    return (
      <div className="flex h-screen items-center justify-center p-4" style={{ backgroundColor: NTA_COLORS.primary }}>
        <div className="max-w-md w-full rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: 'white', borderLeft: `6px solid ${NTA_COLORS.accent}` }}>
          <div 
            className="h-16 w-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-black text-2xl shadow-lg" 
            style={{ backgroundColor: NTA_COLORS.primary }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          
          <h2 className="text-xl font-bold mb-1 text-center" style={{ color: NTA_COLORS.primary }}>
            Welcome, {user?.username}
          </h2>
          <p className="text-gray-500 text-sm mb-8 text-center">Candidate ID: {String(user?.id || '').slice(0, 8)}</p>
          
          <div className="space-y-3 mb-8 p-4 rounded-lg" style={{ backgroundColor: NTA_COLORS.lightBg }}>
            <div className="flex items-center gap-2 text-xs font-bold text-green-700">
              <CheckCircleIcon fontSize="small" /> Ready to Start
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Click below to enter fullscreen mode. The exam timer will begin immediately.
            </p>
          </div>

          <button 
            onClick={handleEnterFullscreen}
            className="w-full py-3 rounded-lg font-bold text-white tracking-wide shadow-lg transition-all active:scale-95"
            style={{ backgroundColor: NTA_COLORS.primary }}
          >
            ENTER EXAM
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN EXAM INTERFACE ──────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: 'white' }}>
      
      {/* ── HEADER ── */}
      <header 
        className="flex h-14 shrink-0 items-center justify-between px-6 shadow-sm"
        style={{ backgroundColor: NTA_COLORS.primary, color: 'white' }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-bold hidden md:block">{attempt?.quiz_info?.title}</h1>
          <div className="text-[11px] font-bold opacity-70 hidden md:block">•</div>
          <div className="flex items-center gap-1 text-sm font-bold">
            <TimerIcon fontSize="small" />
            <span style={{ color: timeRemaining < 300 ? NTA_COLORS.danger : 'inherit' }}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleSubmit} 
            className="px-4 py-2 text-xs font-bold rounded-lg transition-colors"
            style={{ backgroundColor: NTA_COLORS.danger, color: 'white' }}
          >
            SUBMIT
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="lg:hidden p-2 opacity-70 hover:opacity-100"
          >
            <MenuIcon fontSize="small" />
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Question Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          
          {/* Section Tabs */}
          <div 
            className="flex items-center gap-1 px-6 py-2 overflow-x-auto border-b"
            style={{ borderColor: NTA_COLORS.lightBorder, backgroundColor: NTA_COLORS.lightBg }}
          >
            {attempt?.quiz_info?.sections.map((sec) => (
              <button 
                key={sec.id}
                onClick={() => handleSectionSwitch(sec.id)}
                className={`px-3 py-2 text-xs font-bold uppercase whitespace-nowrap rounded transition-all ${
                  sec.id === currentSectionId 
                    ? 'text-white shadow-md' 
                    : 'text-gray-600 hover:bg-white/50'
                }`}
                style={{
                  backgroundColor: sec.id === currentSectionId ? NTA_COLORS.primary : 'transparent'
                }}
              >
                {sec.name} ({sec.quiz_questions?.length || 0})
              </button>
            ))}
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Question Number & Marks */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: NTA_COLORS.primary }}>
                  Question {currentIdx + 1} of {currentSectionQuestions.length}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded border border-green-300">
                    +{currentQ?.marks_correct ?? 4}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded border border-red-300">
                    {currentQ?.marks_wrong ?? -1}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div 
                className="p-6 rounded-xl shadow-sm border"
                style={{ backgroundColor: 'white', borderColor: NTA_COLORS.lightBorder }}
              >
                <h2 className="text-lg font-bold leading-relaxed">
                  {currentQ?.question_data?.text || currentQ?.question_text || "Loading question..."}
                </h2>
                {currentQ?.question_data?.image && (
                  <div className="mt-4 rounded-lg overflow-hidden border" style={{ borderColor: NTA_COLORS.lightBorder }}>
                    <img src={currentQ.question_data.image} alt="Question" className="max-w-full" />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ?.question_data?.options?.map((opt) => {
                  const isSelected = currentResp?.selected_options?.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      className={`flex items-center gap-4 w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected 
                          ? 'shadow-md' 
                          : 'shadow-sm hover:shadow-md'
                      }`}
                      style={{
                        borderColor: isSelected ? NTA_COLORS.primary : NTA_COLORS.lightBorder,
                        backgroundColor: isSelected ? `${NTA_COLORS.primary}08` : 'white'
                      }}
                    >
                      <div 
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded font-bold text-sm"
                        style={{
                          backgroundColor: isSelected ? NTA_COLORS.primary : 'white',
                          color: isSelected ? 'white' : NTA_COLORS.primary,
                          border: `1px solid ${NTA_COLORS.primary}`
                        }}
                      >
                        {opt.label}
                      </div>
                      <span className="flex-1 font-medium">{opt.text}</span>
                      {isSelected && <CheckCircleIcon style={{ color: NTA_COLORS.primary }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <footer 
            className="h-16 shrink-0 border-t px-6 flex items-center justify-between"
            style={{ borderColor: NTA_COLORS.lightBorder, backgroundColor: NTA_COLORS.lightBg }}
          >
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleStatusChange('REVIEW')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                style={{ 
                  borderColor: NTA_COLORS.warning,
                  border: `2px solid ${NTA_COLORS.warning}`,
                  color: NTA_COLORS.warning,
                  backgroundColor: `${NTA_COLORS.warning}08`
                }}
              >
                <FlagIcon fontSize="small" />
                <span className="hidden sm:inline">Mark for Review</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                disabled={currentIdx === 0}
                onClick={() => {
                  if (currentIdx > 0) {
                    setCurrentIdx(currentIdx - 1);
                  }
                }}
                className="p-2 rounded-lg border transition-colors disabled:opacity-30"
                style={{ borderColor: NTA_COLORS.lightBorder }}
              >
                <ChevronLeft />
              </button>
              
              <button 
                onClick={() => handleStatusChange('ANSWERED')}
                className="px-6 py-2 rounded-lg font-bold text-xs text-white shadow-md transition-colors"
                style={{ backgroundColor: NTA_COLORS.primary }}
              >
                Save & Next
              </button>
            </div>
          </footer>
        </main>

        {/* Right Sidebar: Question Palette */}
        <aside 
          className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} absolute lg:relative right-0 top-0 bottom-0 z-20 w-72 shrink-0 flex flex-col border-l transition-transform duration-300 overflow-hidden`}
          style={{ borderColor: NTA_COLORS.lightBorder, backgroundColor: 'white' }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b" style={{ borderColor: NTA_COLORS.lightBorder }}>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs font-black uppercase" style={{ color: NTA_COLORS.primary }}>
                Questions
              </h5>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-black text-sm"
                style={{ backgroundColor: NTA_COLORS.primary }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 text-xs">
                <p className="font-bold truncate">{user?.username}</p>
                <p className="text-gray-500 text-[10px]">ID: {String(user?.id || '').slice(0, 6)}</p>
              </div>
            </div>
          </div>

          {/* Palette Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const resp = responses[q.id];
                const isCurrent = q.section === currentSectionId && idx === currentIdx;
                const sectionIdx = questions.filter(x => x.section === q.section).findIndex(x => x.id === q.id);
                
                let bgColor = '#f0f0f0';
                let textColor = '#666';
                
                if (resp?.visit_status === 'ANSWERED') {
                  bgColor = NTA_COLORS.success;
                  textColor = 'white';
                } else if (resp?.visit_status === 'REVIEW') {
                  bgColor = NTA_COLORS.warning;
                  textColor = 'white';
                } else if (resp?.visit_status === 'VISITED') {
                  bgColor = NTA_COLORS.danger;
                  textColor = 'white';
                }

                return (
                  <button 
                    key={q.id}
                    onClick={() => {
                      if (q.section !== currentSectionId) {
                        setCurrentSectionId(q.section);
                      }
                      const secQs = questions.filter(x => x.section === q.section);
                      const newIdx = secQs.findIndex(x => x.id === q.id);
                      setCurrentIdx(newIdx);
                    }}
                    className={`flex h-9 items-center justify-center rounded font-bold text-xs transition-all ${
                      isCurrent ? 'ring-2 scale-110' : ''
                    }`}
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      ringColor: isCurrent ? NTA_COLORS.primary : 'transparent'
                    }}
                    title={`${q.section} - Q${sectionIdx + 1}`}
                  >
                    {sectionIdx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t text-[10px]" style={{ borderColor: NTA_COLORS.lightBorder }}>
              <p className="font-bold mb-3" style={{ color: NTA_COLORS.primary }}>STATUS</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: NTA_COLORS.success }}></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: NTA_COLORS.danger }}></div>
                  <span className="text-gray-600">Not Ans.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: NTA_COLORS.warning }}></div>
                  <span className="text-gray-600">Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded border" style={{ backgroundColor: '#f0f0f0', borderColor: '#ccc' }}></div>
                  <span className="text-gray-600">Not Visited</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuizAttemptWindow;
