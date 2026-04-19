import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Timer as TimerIcon, 
  ChevronLeft, 
  ChevronRight, 
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Description as DocumentIcon
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import attemptService from "@/services/attemptService";

const QuizAttemptWindow = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Official NTA JEE Colors
  const NTA = {
    primary: '#0a2a6e',           // Navy blue
    secondary: '#1a4da0',         // Secondary navy
    accent: '#c8950a',            // Gold
    success: '#1a7a3a',           // Green
    warning: '#f5a623',           // Orange
    danger: '#c0392b',            // Red
    instructionBg: '#fdf3d6',     // Light gold
    instructionBorder: '#c8950a', // Gold border
    lightBg: '#f5f6fa',           // Light gray
    lightBorder: '#dde2f0',       // Light border
    white: '#ffffff',
    text: '#1a1a1a',
    lightText: '#666666',
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
  const [showInstructions, setShowInstructions] = useState(true);

  // ── Fullscreen Management ──────────────────────────────────────────────────
  const handleEnterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen({ navigationUI: "hide" });
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
    setShowInstructions(false);
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
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: NTA.lightBg }}>
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: NTA.lightText }} className="font-medium">Loading Exam...</p>
        </div>
      </div>
    );
  }

  // ── INSTRUCTIONS & START SCREEN ──────────────────────────────────────────
  if (showInstructions) {
    return (
      <div className="flex h-screen items-center justify-center p-4" style={{ backgroundColor: NTA.white }}>
        <div className="max-w-2xl w-full rounded-lg shadow-xl" style={{ backgroundColor: NTA.white, border: `2px solid ${NTA.lightBorder}` }}>
          {/* Header */}
          <div className="p-8 border-b" style={{ borderColor: NTA.lightBorder, backgroundColor: NTA.lightBg }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <DocumentIcon style={{ color: NTA.primary, fontSize: '32px' }} />
              <h1 className="text-2xl font-bold" style={{ color: NTA.primary }}>
                {attempt?.quiz_info?.title}
              </h1>
            </div>
            <p className="text-center text-sm" style={{ color: NTA.lightText }}>
              Candidate: {user?.username} | ID: {String(user?.id || '').slice(0, 8)}
            </p>
          </div>

          {/* Instructions Box */}
          <div className="p-8" style={{ backgroundColor: NTA.instructionBg, borderLeft: `8px solid ${NTA.instructionBorder}` }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: NTA.primary }}>
              EXAM INSTRUCTIONS
            </h2>
            
            <div className="space-y-3 text-sm mb-6" style={{ color: NTA.text }}>
              <div className="flex gap-3">
                <span className="font-bold">•</span>
                <p>You have <span className="font-bold">{attempt?.quiz_info?.duration_mins} minutes</span> to complete the exam</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">•</span>
                <p>Each correct answer carries <span className="font-bold">+{currentQ?.marks_correct || 4} marks</span></p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">•</span>
                <p>Each wrong answer carries <span className="font-bold">{currentQ?.marks_wrong || -1} mark(s)</span></p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">•</span>
                <p>You can switch between sections and review your answers at any time</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">•</span>
                <p>Mark questions for review to revisit them later</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold">•</span>
                <p>The exam will auto-submit when time expires</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 rounded" style={{ backgroundColor: NTA.white, borderLeft: `4px solid ${NTA.warning}` }}>
              <TimerIcon style={{ color: NTA.warning }} />
              <p className="text-xs font-bold" style={{ color: NTA.warning }}>
                Please ensure you have a stable internet connection before proceeding
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end p-8">
            <button 
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2 rounded font-bold text-sm transition-all"
              style={{ 
                backgroundColor: NTA.lightBg, 
                color: NTA.primary,
                border: `1px solid ${NTA.lightBorder}`
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleEnterFullscreen}
              className="px-8 py-2 rounded font-bold text-sm text-white transition-all active:scale-95"
              style={{ backgroundColor: NTA.primary }}
            >
              START EXAM
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN EXAM INTERFACE ──────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: NTA.white }}>
      
      {/* ── HEADER WITH METADATA ── */}
      <header className="shrink-0 shadow-sm" style={{ backgroundColor: NTA.primary, color: NTA.white, padding: '12px 24px' }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm font-bold">{attempt?.quiz_info?.title}</h1>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-1.5 text-xs font-bold rounded transition-all"
            style={{ backgroundColor: NTA.danger, color: NTA.white }}
          >
            SUBMIT
          </button>
        </div>
        
        {/* Metadata Grid */}
        <div className="grid grid-cols-4 gap-4 text-[11px]">
          <div>
            <p className="opacity-70 text-xs">Exam</p>
            <p className="font-bold">JEE (Main)</p>
          </div>
          <div>
            <p className="opacity-70 text-xs">Time Remaining</p>
            <p className="font-bold" style={{ color: timeRemaining < 300 ? NTA.danger : NTA.accent }}>
              {formatTime(timeRemaining)}
            </p>
          </div>
          <div>
            <p className="opacity-70 text-xs">Total Marks</p>
            <p className="font-bold">{attempt?.quiz_info?.total_marks || 300}</p>
          </div>
          <div>
            <p className="opacity-70 text-xs">Candidate</p>
            <p className="font-bold">{user?.username?.toUpperCase()}</p>
          </div>
        </div>
      </header>

      {/* ── SECTION TABS ── */}
      <div 
        className="flex items-center gap-1 px-6 py-2 overflow-x-auto border-b shrink-0"
        style={{ borderColor: NTA.lightBorder, backgroundColor: NTA.lightBg }}
      >
        {attempt?.quiz_info?.sections.map((sec, idx) => (
          <button 
            key={sec.id}
            onClick={() => handleSectionSwitch(sec.id)}
            className={`px-4 py-2 text-xs font-bold uppercase whitespace-nowrap rounded transition-all ${
              sec.id === currentSectionId 
                ? 'text-white shadow-md' 
                : 'text-gray-600 hover:bg-white/50'
            }`}
            style={{
              backgroundColor: sec.id === currentSectionId ? NTA.primary : 'transparent'
            }}
          >
            {['Physics', 'Chemistry', 'Math'][idx] || sec.name} <span className="opacity-70">({sec.quiz_questions?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Question Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          
          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Question Number & Meta */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: NTA.lightBorder }}>
                <div>
                  <p className="text-xs font-bold opacity-70" style={{ color: NTA.primary }}>
                    QUESTION {currentIdx + 1} OF {currentSectionQuestions.length}
                  </p>
                  <p className="text-xs opacity-60" style={{ color: NTA.lightText }}>
                    {['Physics', 'Chemistry', 'Math'][attempt?.quiz_info?.sections.findIndex(s => s.id === currentSectionId)] || 'Section'} - Question {currentIdx + 1}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-center" style={{ backgroundColor: NTA.success, color: NTA.white, padding: '4px 8px', borderRadius: '4px' }}>
                    <p className="text-[9px] font-bold opacity-80">Correct</p>
                    <p className="text-xs font-bold">+{currentQ?.marks_correct ?? 4}</p>
                  </div>
                  <div className="text-center" style={{ backgroundColor: NTA.danger, color: NTA.white, padding: '4px 8px', borderRadius: '4px' }}>
                    <p className="text-[9px] font-bold opacity-80">Wrong</p>
                    <p className="text-xs font-bold">{currentQ?.marks_wrong ?? -1}</p>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h2 className="text-lg leading-relaxed font-serif" style={{ color: NTA.text }}>
                  {currentQ?.question_data?.text || currentQ?.question_text || "Loading question..."}
                </h2>
                {currentQ?.question_data?.image && (
                  <div className="mt-4 rounded-lg overflow-hidden border" style={{ borderColor: NTA.lightBorder }}>
                    <img src={currentQ.question_data.image} alt="Question" className="max-w-full" />
                  </div>
                )}
              </div>

              {/* Options - 2 Column Grid per NTA Standard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ?.question_data?.options?.map((opt) => {
                  const isSelected = currentResp?.selected_options?.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id)}
                      className={`flex gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected 
                          ? 'shadow-md' 
                          : 'shadow-sm hover:shadow-md'
                      }`}
                      style={{
                        borderColor: isSelected ? NTA.primary : NTA.lightBorder,
                        backgroundColor: isSelected ? `${NTA.primary}08` : NTA.white
                      }}
                    >
                      <div 
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded font-bold text-sm"
                        style={{
                          backgroundColor: isSelected ? NTA.primary : NTA.white,
                          color: isSelected ? NTA.white : NTA.primary,
                          border: `2px solid ${NTA.primary}`
                        }}
                      >
                        {opt.label}
                      </div>
                      <span className="flex-1 font-medium" style={{ color: NTA.text }}>{opt.text}</span>
                      {isSelected && <CheckCircleIcon style={{ color: NTA.primary, fontSize: '20px' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <footer 
            className="h-16 shrink-0 border-t px-6 flex items-center justify-between flex-wrap gap-4"
            style={{ borderColor: NTA.lightBorder, backgroundColor: NTA.lightBg }}
          >
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleStatusChange('REVIEW')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                style={{ 
                  borderColor: NTA.warning,
                  border: `2px solid ${NTA.warning}`,
                  color: NTA.warning,
                  backgroundColor: `${NTA.warning}08`
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
                style={{ borderColor: NTA.lightBorder }}
              >
                <ChevronLeft />
              </button>
              
              <button 
                onClick={() => handleStatusChange('ANSWERED')}
                className="px-6 py-2 rounded-lg font-bold text-xs text-white transition-colors"
                style={{ backgroundColor: NTA.primary }}
              >
                Save & Next
              </button>
            </div>
          </footer>
        </main>

        {/* Right Sidebar: Question Palette */}
        <aside 
          className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} absolute lg:relative right-0 top-0 bottom-0 z-20 w-72 shrink-0 flex flex-col border-l transition-transform duration-300 overflow-hidden`}
          style={{ borderColor: NTA.lightBorder, backgroundColor: NTA.white }}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b" style={{ borderColor: NTA.lightBorder, backgroundColor: NTA.lightBg }}>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs font-bold uppercase" style={{ color: NTA.primary }}>
                Question Navigator
              </h5>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <CloseIcon fontSize="small" />
              </button>
            </div>
          </div>

          {/* Palette Grid - 5 Columns per NTA Standard */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.filter(q => q.section === currentSectionId).map((q, qIdx) => {
                const resp = responses[q.id];
                const isCurrent = qIdx === currentIdx;
                const qNum = qIdx + 1;
                
                let bgColor = NTA.white;
                let textColor = NTA.lightText;
                let borderColor = NTA.lightBorder;
                
                if (resp?.visit_status === 'ANSWERED') {
                  bgColor = NTA.success;
                  textColor = NTA.white;
                  borderColor = NTA.success;
                } else if (resp?.visit_status === 'REVIEW') {
                  bgColor = NTA.warning;
                  textColor = NTA.white;
                  borderColor = NTA.warning;
                } else if (resp?.visit_status === 'VISITED') {
                  bgColor = NTA.danger;
                  textColor = NTA.white;
                  borderColor = NTA.danger;
                }

                return (
                  <button 
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(qIdx);
                    }}
                    className={`flex h-9 items-center justify-center rounded font-bold text-xs transition-all ${
                      isCurrent ? 'ring-2 scale-110 shadow-lg' : ''
                    }`}
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      border: `1px solid ${borderColor}`,
                      outlineColor: isCurrent ? NTA.primary : 'transparent',
                      outlineWidth: isCurrent ? '2px' : '0px',
                      outlineOffset: isCurrent ? '2px' : '0px'
                    }}
                    title={`Q${qNum}`}
                  >
                    {qNum}
                  </button>
                );
              })}
            </div>

            {/* Status Legend - NTA Standard */}
            <div className="border-t pt-4" style={{ borderColor: NTA.lightBorder }}>
              <p className="text-xs font-bold mb-3" style={{ color: NTA.primary }}>STATUS</p>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded" style={{ backgroundColor: NTA.success }}></div>
                  <span style={{ color: NTA.lightText }}>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded" style={{ backgroundColor: NTA.warning }}></div>
                  <span style={{ color: NTA.lightText }}>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded" style={{ backgroundColor: NTA.danger }}></div>
                  <span style={{ color: NTA.lightText }}>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border" style={{ backgroundColor: NTA.white, borderColor: NTA.lightBorder }}></div>
                  <span style={{ color: NTA.lightText }}>Not Visited</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t text-[10px]" style={{ borderColor: NTA.lightBorder, backgroundColor: NTA.lightBg }}>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden w-full py-2 px-3 rounded font-bold text-white"
              style={{ backgroundColor: NTA.primary }}
            >
              Close Navigator
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuizAttemptWindow;
