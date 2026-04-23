import React from 'react';

const HeaderBar = ({ attempt, user, timeRemaining, NTA, formatTime, onViewInstructions, onSubmit }) => {
  return (
    <div className="shrink-0 flex flex-col w-full font-sans">
      {/* Top Header Row */}
      <div className="flex h-[45px] w-full">
        {/* Left: Logo Area */}
        <div 
          className="w-[200px] flex items-center px-4" 
          style={{ backgroundColor: NTA.headerLogoBg }}
        >
          <span className="font-bold text-[#333] text-sm">Exam Portal</span>
        </div>
        
        {/* Right: Institute Area */}
        <div 
          className="flex-1 flex items-center justify-center relative"
          style={{ backgroundColor: '#4D8CCA' }}
        >
          <h1 className="text-white text-lg font-medium">
            {attempt?.quiz_info?.title || 'Assessment Examination Center'}
          </h1>
        </div>
      </div>

      {/* Profile & Timer Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-white border-b shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-500 uppercase font-bold">Candidate Name</span>
            <span className="text-sm font-bold text-[#147EB3]">
              {user?.username?.toUpperCase() || 'CANDIDATE'}
            </span>
          </div>
          <div className="flex flex-col ml-8">
            <span className="text-[11px] text-gray-500 uppercase font-bold">Exam Name</span>
            <span className="text-sm font-bold text-gray-700">
              {attempt?.quiz_info?.quiz_data?.category || 'MOCK EXAM'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-gray-500 uppercase font-bold">Time Left</span>
            <span className="text-lg font-bold text-gray-800 leading-none">
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onViewInstructions}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs font-medium text-gray-700 transition-colors"
            >
              Question Paper
            </button>
            <button 
              onClick={onViewInstructions}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs font-medium text-gray-700 transition-colors"
            >
              Instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBar;
