import React from 'react';

const ActionBar = ({ currentQ, currentIdx, sectionQuestionsLength, attemptId, NTA, onStatusChange, onClearResponse, onSubmit }) => {
  return (
    <footer 
      className="shrink-0 border-t bg-white px-4 py-3 flex items-center justify-between"
      style={{ borderColor: '#cccccc' }}
    >
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onStatusChange('REVIEW')}
          className="px-5 py-2 border border-[#147EB3] text-[#147EB3] hover:bg-blue-50 text-xs font-bold rounded shadow-sm transition-all"
        >
          Mark for Review & Next
        </button>
        <button 
          onClick={onClearResponse}
          className="px-5 py-2 border border-[#147EB3] text-[#147EB3] hover:bg-blue-50 text-xs font-bold rounded shadow-sm transition-all"
        >
          Clear Response
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onStatusChange('ANSWERED')}
          className="px-8 py-2 bg-[#147EB3] hover:bg-[#116b99] text-white text-xs font-bold rounded shadow-md transition-all"
        >
          Save & Next
        </button>
        {/* Submit is also in the sidebar, but we keep it here if needed or use a different style */}
        <button 
          onClick={onSubmit}
          className="px-8 py-2 bg-[#38A9EB] hover:bg-[#2e90c9] text-white text-xs font-bold rounded shadow-md transition-all"
        >
          Submit
        </button>
      </div>
    </footer>
  );
};

export default ActionBar;
