import React from 'react';

const QuestionDisplay = ({ currentQ, currentIdx, sectionQuestionsLength, currentResp, NTA, onOptionSelect }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white m-2 border rounded shadow-sm flex flex-col">
      {/* Question Header */}
      <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
        <span className="font-bold text-gray-700">Question No. {currentIdx + 1}</span>
      </div>

      <div className="p-6 font-sans">
        {/* Question Text */}
        <div className="mb-8">
          <p className="text-[15px] text-[#2b2b2b] leading-relaxed whitespace-pre-wrap">
            {currentQ?.question_data?.text || currentQ?.question_text || "Loading question..."}
          </p>
          {currentQ?.question_data?.image && (
            <div className="mt-4 rounded border p-2 bg-white inline-block">
              <img src={currentQ.question_data.image} alt="Question" className="max-w-full h-auto" />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4 ml-2">
          {currentQ?.question_data?.options?.map((opt, index) => {
            const isSelected = currentResp?.selected_options?.includes(opt.id);
            return (
              <label
                key={opt.id}
                className="flex items-start gap-3 group cursor-pointer"
              >
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    checked={isSelected}
                    onChange={() => onOptionSelect(opt.id)}
                    className="w-4 h-4 cursor-pointer accent-[#147EB3]"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[14px] text-[#333] group-hover:text-black transition-colors">
                    {opt.text}
                  </span>
                  {opt.image && (
                    <div className="mt-2">
                      <img src={opt.image} alt={`Option ${index + 1}`} className="max-w-full h-auto border rounded" />
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
