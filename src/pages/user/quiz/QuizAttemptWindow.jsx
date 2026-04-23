import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import attemptService from "@/services/attemptService";
import CandidateLoginScreen from "./CandidateLoginScreen";
import InstructionsScreen from "./InstructionsScreen";
import HeaderBar from "./HeaderBar";
import SectionTabs from "./SectionTabs";
import QuestionDisplay from "./QuestionDisplay";
import ActionBar from "./ActionBar";
import QuestionPalette from "./QuestionPalette";
import { ConfirmDialog, SnackbarNotification, SummaryDialog } from "./Dialogs";

const QuizAttemptWindow = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Official Digialm (TCS iON) Colors
  const NTA = {
    headerLogoBg: '#E5E5E5',       // Light gray for logo area
    headerInstBg: '#1C4E80',       // Dark blue for institute area
    primary: '#147EB3',           // Digialm Blue
    secondary: '#38A9EB',         // Light Blue (Submit)
    success: '#70AD47',           // Green (Answered)
    danger: '#ED1C24',            // Red (Not Answered)
    marked: '#7030A0',            // Violet (Marked)
    white: '#ffffff',
    text: '#1a1a1a',
    lightText: '#666666',
    mainBg: '#F2F2F2',
    paletteBg: '#F8FBFF',
    lightBorder: '#cccccc',
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
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCandidateLogin, setShowCandidateLogin] = useState(true);

  // ── Dialog & Snackbar States ──────────────────────────────────────────────
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning' // 'warning' | 'error' | 'success'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' // 'success' | 'error' | 'warning' | 'info'
  });
  const [showSummary, setShowSummary] = useState(false);

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

  const handleSectionSwitch = (newSectionId) => {
    if (newSectionId === currentSectionId) return;
    if (currentQ && currentResp?.selected_options?.length > 0) {
      setConfirmDialog({
        open: true,
        title: 'Unsaved Responses',
        message: 'You have unsaved responses in this section. Do you want to switch to another section?',
        type: 'warning',
        onConfirm: () => {
          setCurrentSectionId(newSectionId);
          setCurrentIdx(0);
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      });
    } else {
      setCurrentSectionId(newSectionId);
      setCurrentIdx(0);
    }
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
    attemptService.saveResponse(attemptId, updated);
  };

  const handleStatusChange = async (status) => {
    const qId = currentQ.id;
    const resp = responses[qId] || { selected_options: [], quiz_question: qId };
    
    let updated = { ...resp, quiz_question: qId };
    
    if (status === 'REVIEW') {
      // Mark for Review - toggle marked_for_review flag
      updated.marked_for_review = !updated.marked_for_review;
    } else if (status === 'ANSWERED') {
      // Save & Next - set status to ANSWERED
      updated.visit_status = 'ANSWERED';
    }
    
    setResponses(prev => ({ ...prev, [qId]: updated }));
    await attemptService.saveResponse(attemptId, updated);

    // Auto-advance to next question only for Save & Next
    if (status === 'ANSWERED') {
      if (currentIdx < currentSectionQuestions.length - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        const currentSecIdx = attempt?.quiz_info?.sections.findIndex(s => s.id === currentSectionId);
        if (currentSecIdx < attempt?.quiz_info?.sections.length - 1) {
          const nextSection = attempt.quiz_info.sections[currentSecIdx + 1];
          handleSectionSwitch(nextSection.id);
        }
      }
    }
  };

  const handleSubmit = async () => {
    setShowSummary(true);
  };

  const handleFinalSubmit = async () => {
    try {
      await attemptService.submitAttempt(attemptId);
      setShowSummary(false);
      setSnackbar({
        open: true,
        message: 'Exam submitted successfully!',
        severity: 'success'
      });
      setTimeout(() => {
        navigate(`/student/result/${attemptId}`);
      }, 1500);
    } catch (e) {
      setShowSummary(false);
      setSnackbar({
        open: true,
        message: 'Submission failed. Please check your connection and try again.',
        severity: 'error'
      });
    }
  };

  // ── Section & Question Logic ────────────────────────────────────────────────
  const currentSectionQuestions = questions.filter(q => q.section === currentSectionId);
  const currentQ = currentSectionQuestions[currentIdx];
  const currentResp = currentQ ? responses[currentQ.id] : null;

  // ── When current question changes, mark as visited ──
  useEffect(() => {
    if (currentQ && !responses[currentQ.id]) {
      // First time visiting this question
      const newResp = { 
        quiz_question: currentQ.id, 
        selected_options: [],
        visit_status: 'VISITED'
      };
      setResponses(prev => ({ ...prev, [currentQ.id]: newResp }));
      attemptService.saveResponse(attemptId, newResp);
    }
  }, [currentQ?.id, attemptId, responses]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: NTA.mainBg }}>
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#147EB3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: NTA.text }} className="font-medium">Loading Exam...</p>
        </div>
      </div>
    );
  }

  // ── CANDIDATE LOGIN SCREEN ──────────────────────────────────────────────
  if (showCandidateLogin) {
    return (
      <CandidateLoginScreen 
        user={user}
        NTA={NTA}
        onSignIn={() => {
          setShowCandidateLogin(false);
          setShowInstructions(true);
        }}
      />
    );
  }

  // ── INSTRUCTIONS & START SCREEN ──────────────────────────────────────────
  if (showInstructions) {
    return (
      <InstructionsScreen 
        attempt={attempt}
        user={user}
        NTA={NTA}
        onStartExam={handleEnterFullscreen}
      />
    );
  }

  // ── MAIN EXAM INTERFACE ──────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: NTA.mainBg }}>
      
      {/* ── TOP HEADER BAR ── */}
      <HeaderBar 
        attempt={attempt}
        user={user}
        timeRemaining={timeRemaining}
        NTA={NTA}
        formatTime={formatTime}
        onViewInstructions={() => setShowInstructions(true)}
        onSubmit={handleSubmit}
      />

      {/* ── SECTION TABS & METADATA ── */}
      <SectionTabs 
        sections={attempt?.quiz_info?.sections || []}
        currentSectionId={currentSectionId}
        onSectionSwitch={handleSectionSwitch}
        questions={questions}
        currentQ={currentQ}
        NTA={NTA}
      />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Question Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          
          {/* Question Content */}
          <QuestionDisplay 
            currentQ={currentQ}
            currentIdx={currentIdx}
            sectionQuestionsLength={currentSectionQuestions.length}
            currentResp={currentResp}
            NTA={NTA}
            onOptionSelect={handleOptionSelect}
          />

          {/* Bottom Action Bar */}
          <ActionBar 
            currentQ={currentQ}
            currentIdx={currentIdx}
            sectionQuestionsLength={currentSectionQuestions.length}
            attemptId={attemptId}
            NTA={NTA}
            onStatusChange={handleStatusChange}
            onClearResponse={async () => {
              if (currentQ) {
                const qId = currentQ.id;
                const updated = { 
                  quiz_question: qId, 
                  selected_options: [],
                  marked_for_review: false,
                  visit_status: 'VISITED'
                };
                setResponses(prev => ({ ...prev, [qId]: updated }));
                await attemptService.saveResponse(attemptId, updated);
                setSnackbar({
                  open: true,
                  message: 'Response cleared',
                  severity: 'info'
                });
              }
            }}
            onSubmit={handleSubmit}
          />
        </main>

        {/* Right Sidebar: Question Palette */}
        <QuestionPalette 
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          onSubmit={handleSubmit}
          user={user}
          questions={questions}
          sections={attempt?.quiz_info?.sections || []}
          currentSectionId={currentSectionId}
          responses={responses}
          currentIdx={currentIdx}
          onQuestionSelect={(qIdx) => setCurrentIdx(qIdx)}
        />
      </div>

      {/* ── CONFIRMATION DIALOG ── */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        NTA={NTA}
      />

      {/* ── EXAM SUMMARY DIALOG ── */}
      <SummaryDialog
        open={showSummary}
        sections={attempt?.quiz_info?.sections || []}
        responses={responses}
        questions={questions}
        onClose={() => setShowSummary(false)}
        onConfirm={handleFinalSubmit}
        NTA={NTA}
      />

      {/* ── SNACKBAR NOTIFICATIONS ── */}
      <SnackbarNotification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default QuizAttemptWindow;
