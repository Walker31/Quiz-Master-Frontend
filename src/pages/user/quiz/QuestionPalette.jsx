import React from 'react';
import { Close as CloseIcon } from "@mui/icons-material";

const badgeBase = {
  width: 32,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 700,
  lineHeight: 1,
};

const QuestionPalette = ({
  isSidebarOpen,
  onCloseSidebar,
  onSubmit,
  user,
  questions,
  sections = [],
  currentSectionId,
  responses,
  currentIdx,
  onQuestionSelect
}) => {
  const sectionQuestions = questions.filter((q) => q.section === currentSectionId);
  const currentSectionName = sections.find((s) => s.id === currentSectionId)?.name || 'General Aptitude';

  let answered = 0;
  let notAnswered = 0;
  let notVisited = 0;
  let marked = 0;
  let answeredMarked = 0;

  sectionQuestions.forEach((q) => {
    const resp = responses[q.id];
    const isAnswered = Boolean(resp?.selected_options?.length);
    const isMarked = Boolean(resp?.marked_for_review);

    if (!resp || resp.visit_status === 'NOT_VISITED') {
      notVisited += 1;
      return;
    }

    if (isMarked && isAnswered) {
      answeredMarked += 1;
    } else if (isMarked) {
      marked += 1;
    } else if (isAnswered) {
      answered += 1;
    } else {
      notAnswered += 1;
    }
  });

  const trapezoidClip = 'polygon(20% 0, 80% 0, 100% 35%, 100% 100%, 0 100%, 0 35%)';
  const reverseTrapezoidClip = 'polygon(0 0, 100% 0, 100% 65%, 80% 100%, 20% 100%, 0 65%)';

  return (
    <aside
      className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} absolute lg:relative right-0 top-0 bottom-0 z-20 shrink-0 flex flex-col border-l transition-transform duration-300 overflow-hidden shadow-xl font-sans`}
      style={{ width: '300px', borderColor: '#cccccc', backgroundColor: '#F8FBFF' }}
    >
      <div className="absolute right-2 top-2 lg:hidden">
        <button onClick={onCloseSidebar} className="p-1 rounded bg-white border border-gray-300 shadow-sm">
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {/* Candidate Profile Section */}
      <div className="p-4 bg-white border-b flex items-start gap-3">
        <div className="w-16 h-20 bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
          <div className="text-4xl text-gray-400">👤</div>
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <p className="text-[14px] font-bold text-[#147EB3] truncate leading-tight">
            {user?.username || 'Candidate Name'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Legend Section */}
        <div className="p-3 bg-white border-b">
          <div className="grid grid-cols-2 gap-y-3 gap-x-2">
            <div className="flex items-center gap-2">
              <span style={{ ...badgeBase, background: '#70AD47', clipPath: trapezoidClip }}>{answered}</span>
              <span className="text-[11px] font-medium text-gray-700">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ ...badgeBase, background: '#ED1C24', clipPath: reverseTrapezoidClip }}>{notAnswered}</span>
              <span className="text-[11px] font-medium text-gray-700">Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ ...badgeBase, background: '#FFFFFF', color: '#333', border: '1px solid #999' }}>{notVisited}</span>
              <span className="text-[11px] font-medium text-gray-700">Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ ...badgeBase, background: '#7030A0', borderRadius: '50%' }}>{marked}</span>
              <span className="text-[11px] font-medium text-gray-700">Marked for Review</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="relative shrink-0">
              <span style={{ ...badgeBase, background: '#7030A0', borderRadius: '50%' }}>{answeredMarked}</span>
              <div className="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-[#70AD47] border border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">✓</div>
            </div>
            <span className="text-[10px] font-medium text-gray-600 leading-tight">Answered & Marked for Review (will be considered for evaluation)</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="bg-[#147EB3] text-white px-4 py-1.5 text-xs font-bold shadow-sm uppercase tracking-wider">
          {currentSectionName}
        </div>

        {/* Question Palette Grid Area */}
        <div className="p-3" style={{ backgroundColor: '#E4EDF7' }}>
          <p className="text-[11px] font-bold text-gray-600 mb-2 uppercase">Choose a Question</p>
          <div className="grid grid-cols-5 gap-2 pb-2">
            {sectionQuestions.map((q, qIdx) => {
              const resp = responses[q.id];
              const isCurrent = qIdx === currentIdx;
              const isAnswered = Boolean(resp?.selected_options?.length);
              const isMarked = Boolean(resp?.marked_for_review);

              let status = 'notVisited';
              if (!resp || resp.visit_status === 'NOT_VISITED') status = 'notVisited';
              else if (isMarked && isAnswered) status = 'answeredMarked';
              else if (isMarked) status = 'marked';
              else if (isAnswered) status = 'answered';
              else status = 'notAnswered';

              let style = {
                width: '42px',
                height: '38px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.1s',
                position: 'relative'
              };

              let shapeStyle = {};
              if (status === 'answered') {
                shapeStyle = { backgroundColor: '#70AD47', color: 'white', clipPath: trapezoidClip };
              } else if (status === 'notAnswered') {
                shapeStyle = { backgroundColor: '#ED1C24', color: 'white', clipPath: reverseTrapezoidClip };
              } else if (status === 'marked') {
                shapeStyle = { backgroundColor: '#7030A0', color: 'white', borderRadius: '50%' };
              } else if (status === 'answeredMarked') {
                shapeStyle = { backgroundColor: '#7030A0', color: 'white', borderRadius: '50%' };
              } else {
                shapeStyle = { backgroundColor: 'white', color: '#333', border: '1px solid #999' };
              }

              return (
                <button
                  key={q.id}
                  onClick={() => onQuestionSelect(qIdx)}
                  className="flex items-center justify-center relative group"
                  style={style}
                >
                  <div 
                    className={`w-full h-full flex items-center justify-center transition-transform ${isCurrent ? 'scale-110 shadow-lg' : 'hover:scale-105'}`} 
                    style={{
                      ...shapeStyle,
                      border: isCurrent ? '2px solid #000' : shapeStyle.border
                    }}
                  >
                    {qIdx + 1}
                  </div>
                  {status === 'answeredMarked' && (
                    <div className="absolute right-0 bottom-0 w-3.5 h-3.5 bg-[#70AD47] border border-white rounded-full flex items-center justify-center text-[7px] text-white font-bold shadow-sm">✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer Buttons */}
      <div className="p-4 bg-white border-t flex flex-col gap-2 shadow-inner">
        <button
          onClick={onSubmit}
          className="w-full py-2 bg-[#147EB3] hover:bg-[#0c6b99] text-white text-sm font-bold shadow-md transition-all rounded-sm uppercase tracking-wide"
        >
          Submit
        </button>
      </div>
    </aside>
  );
};

export default QuestionPalette;
