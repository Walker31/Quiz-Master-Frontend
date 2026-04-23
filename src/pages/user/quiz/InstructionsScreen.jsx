import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructionsScreen = ({ attempt, user, NTA, onStartExam }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const trapezoidClip = 'polygon(20% 0, 80% 0, 100% 35%, 100% 100%, 0 100%, 0 35%)';
  const reverseTrapezoidClip = 'polygon(0 0, 100% 0, 100% 65%, 80% 100%, 20% 100%, 0 65%)';

  const renderHeader = () => (
    <div className="shrink-0 flex flex-col w-full font-sans">
      <div className="flex h-[45px] w-full">
        <div className="w-[200px] flex items-center px-4" style={{ backgroundColor: '#E5E5E5' }}>
          <span className="font-bold text-[#333] text-sm">Exam Portal</span>
        </div>
        <div className="flex-1 flex items-center justify-between px-6 relative" style={{ backgroundColor: '#4D8CCA' }}>
          <h1 className="text-white text-lg font-medium">
            {attempt?.quiz_info?.title || 'Assessment Examination Center'}
          </h1>
          <div className="h-[45px] w-[45px] bg-white border-l border-gray-300 flex items-center justify-center overflow-hidden">
            <span className="text-2xl text-gray-400">👤</span>
          </div>
        </div>
      </div>
      <div className="bg-[#147EB3] text-white px-4 py-1 text-xs font-bold shadow-sm flex items-center justify-between">
        <span>Instructions</span>
        <span className="text-[10px] opacity-80">GATE 2024 Mock System</span>
      </div>
    </div>
  );

  const renderPage1 = () => (
    <div className="flex-1 overflow-y-auto p-6 text-[13px] text-gray-800 leading-relaxed font-sans bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center font-bold text-base mb-4 underline">General Instructions:</h2>
        
        <p className="font-bold mb-2">1. Total duration of examination is {attempt?.quiz_info?.duration_mins} minutes.</p>
        <p className="mb-4">2. The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</p>
        
        <p className="font-bold mb-2">3. The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</p>
        
        <div className="space-y-3 mb-6 ml-4">
          <div className="flex items-center gap-4">
            <span className="w-9 h-8 border border-gray-400 bg-white flex items-center justify-center font-bold text-xs">1</span>
            <span>You have not visited the question yet.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-9 h-8 text-white flex items-center justify-center font-bold text-xs" style={{ backgroundColor: '#ED1C24', clipPath: reverseTrapezoidClip }}>2</span>
            <span>You have not answered the question.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-9 h-8 text-white flex items-center justify-center font-bold text-xs" style={{ backgroundColor: '#70AD47', clipPath: trapezoidClip }}>3</span>
            <span>You have answered the question.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-9 h-9 text-white flex items-center justify-center font-bold text-xs rounded-full" style={{ backgroundColor: '#7030A0' }}>4</span>
            <span>You have NOT answered the question, but have marked the question for review.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="w-9 h-9 text-white flex items-center justify-center font-bold text-xs rounded-full" style={{ backgroundColor: '#7030A0' }}>5</span>
              <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-[#70AD47] border border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold">✓</div>
            </div>
            <span>The question(s) "Answered and Marked for Review" will be considered for evaluation.</span>
          </div>
        </div>

        <p className="mb-4">The Marked for Review status for a question simply indicates that you would like to look at that question again. If a question is answered and Marked for Review, your answer for that question will be considered in the evaluation.</p>
        
        <h3 className="font-bold mb-2">Navigating to a Question:</h3>
        <p className="mb-2">4. To answer a question, do the following:</p>
        <ul className="list-decimal ml-8 space-y-1 mb-4">
          <li>Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
          <li>Click on <b>Save & Next</b> to save your answer for the current question and then go to the next question.</li>
          <li>Click on <b>Mark for Review & Next</b> to save your answer for the current question, mark it for review, and then go to the next question.</li>
        </ul>
      </div>
    </div>
  );

  const renderPage2 = () => (
    <div className="flex-1 overflow-y-auto p-6 text-[13px] text-gray-800 leading-relaxed font-sans bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center font-bold text-base mb-4 underline">Other Important Instructions:</h2>
        
        <div className="border border-gray-300 p-4 mb-6 bg-gray-50">
          <p className="font-bold mb-2 uppercase text-[#147EB3]">Paper Specific Instructions:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>This mock exam consists of {attempt?.quiz_info?.sections?.length} sections.</li>
            <li>Each correct answer carries <span className="text-green-600 font-bold">+{attempt?.quiz_info?.sections?.[0]?.quiz_questions?.[0]?.question_data?.marks_correct || 4} marks</span>.</li>
            <li>Each incorrect answer carries <span className="text-red-600 font-bold">{attempt?.quiz_info?.sections?.[0]?.quiz_questions?.[0]?.question_data?.marks_wrong || -1} mark(s)</span>.</li>
            <li>No marks will be awarded for unattempted questions.</li>
          </ul>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex items-start gap-3 bg-blue-50 p-4 border border-blue-200 rounded">
            <input 
              type="checkbox" 
              id="declaration" 
              className="mt-1 cursor-pointer w-4 h-4" 
              checked={hasConfirmed}
              onChange={(e) => setHasConfirmed(e.target.checked)}
            />
            <label htmlFor="declaration" className="cursor-pointer select-none font-medium text-[12px] text-gray-700 leading-tight">
              I have read and understood all the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of any prohibited gadgets such as mobile phones, Bluetooth devices, any type of watch, etc. and other prohibited materials inside the examination hall. I shall abide by the rules and regulations of the examination.
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F2F2F2]">
      {renderHeader()}

      {page === 1 ? renderPage1() : renderPage2()}

      <div className="shrink-0 p-4 bg-white border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-600 uppercase">View In:</span>
          <select className="border border-gray-300 text-[11px] px-2 py-1 outline-none bg-white">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => page === 1 ? navigate('/student/dashboard') : setPage(1)}
            className="px-6 py-2 border border-gray-400 text-gray-700 font-bold text-sm hover:bg-gray-100 shadow-sm"
          >
            {page === 1 ? 'CANCEL' : 'PREVIOUS'}
          </button>

          {page === 1 ? (
            <button 
              onClick={() => setPage(2)}
              className="px-10 py-2 bg-[#147EB3] text-white font-bold text-sm hover:bg-[#0c6b99] shadow-md uppercase"
            >
              NEXT
            </button>
          ) : (
            <button 
              onClick={onStartExam}
              disabled={!hasConfirmed}
              className={`px-10 py-2 font-bold text-sm shadow-md uppercase transition-all ${
                hasConfirmed 
                  ? 'bg-[#147EB3] text-white hover:bg-[#0c6b99]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              I am ready to begin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructionsScreen;
