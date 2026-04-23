import React from 'react';

const SectionTabs = ({ sections, currentSectionId, onSectionSwitch, questions, currentQ, NTA }) => {
  return (
    <div className="shrink-0 flex flex-col bg-white border-b" style={{ borderColor: NTA.lightBorder }}>
      {/* Section Tabs */}
      <div className="flex items-center gap-1 px-4 pt-2">
        {sections.map((sec, idx) => {
          const isActive = sec.id === currentSectionId;
          return (
            <div key={sec.id} className="relative flex flex-col items-center">
              <button 
                onClick={() => onSectionSwitch(sec.id)}
                className={`px-4 py-1.5 text-sm font-bold transition-all border ${
                  isActive 
                    ? 'text-white' 
                    : 'bg-white text-[#147EB3] border-[#147EB3] hover:bg-blue-50'
                }`}
                style={{
                  backgroundColor: isActive ? '#147EB3' : 'white',
                  borderColor: isActive ? '#147EB3' : '#147EB3',
                  borderRadius: '3px 3px 0 0'
                }}
              >
                {sec.name || ['Physics', 'Chemistry', 'Math'][idx]}
              </button>
              {isActive && (
                <div 
                  className="absolute -bottom-[6px] border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent"
                  style={{ borderTopColor: '#147EB3' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Question Info Bar */}
      <div className="px-4 py-1 bg-[#147EB3] flex items-center justify-between text-white text-xs font-bold mt-[1px]">
        <div className="flex items-center gap-4">
          <span className="uppercase tracking-wider">Sections</span>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 bg-white text-[#147EB3] flex items-center justify-center rounded-full text-[10px]">i</span>
            <span>Question Type: {currentQ?.question_data?.q_type === 'MCQ_SINGLE' ? 'Multiple Choice Question' : 'Numeric/Subjective'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Marks for correct answer <span className="text-yellow-200">{currentQ?.question_data?.marks_correct ?? 4}</span> | Negative Marks <span className="text-yellow-200">{currentQ?.question_data?.marks_wrong ?? -1}</span></span>
        </div>
      </div>
    </div>
  );
};

export default SectionTabs;
