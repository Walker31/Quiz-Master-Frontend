import React from 'react';

const CandidateLoginScreen = ({ user, NTA, onSignIn }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F2F2F2] font-sans">
      {/* Dual Section Header */}
      <div className="shrink-0 flex flex-col w-full shadow-sm">
        <div className="flex h-[45px] w-full">
          {/* Left: Logo Area */}
          <div 
            className="w-[200px] flex items-center px-4" 
            style={{ backgroundColor: '#E5E5E5' }}
          >
            <span className="font-bold text-[#333] text-sm">Exam Portal</span>
          </div>
          
          {/* Right: Institute Area */}
          <div 
            className="flex-1 flex items-center justify-center relative"
            style={{ backgroundColor: '#4D8CCA' }}
          >
            <h1 className="text-white text-lg font-medium tracking-wide">
              Assessment Examination Center
            </h1>
          </div>
        </div>
      </div>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[800px] flex flex-col lg:flex-row bg-white border border-gray-300 shadow-xl overflow-hidden">
          
          {/* Left Side: System Info */}
          <div className="lg:w-[40%] flex flex-col border-r border-gray-200">
            <div className="p-4 border-b bg-gray-50">
              <p className="text-[14px] font-bold text-gray-700">System Name :</p>
              <p className="text-sm text-[#147EB3] font-bold">LAB-01-PC-042</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8FBFF]">
              <div className="w-24 h-32 bg-gray-100 border border-gray-300 flex items-center justify-center mb-4 shadow-inner">
                <span className="text-6xl text-gray-400">👤</span>
              </div>
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Candidate Photo</p>
            </div>
          </div>

          {/* Right Side: Mock Login Form */}
          <div className="lg:w-[60%] flex flex-col">
            <div className="bg-[#147EB3] text-white px-6 py-2 text-sm font-bold shadow-sm">
              Candidate Login
            </div>
            
            <div className="flex-1 p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase mb-1 block">Candidate ID</label>
                  <div className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-bold text-gray-700 shadow-inner">
                    {user?.username?.toUpperCase() || 'CANDIDATE_001'}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-600 uppercase mb-1 block">Password</label>
                  <div className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-bold text-gray-700 shadow-inner">
                    ••••••••
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-4">
                <button
                  onClick={onSignIn}
                  className="w-full py-2.5 bg-[#147EB3] hover:bg-[#0c6b99] text-white font-bold text-sm shadow-md transition-all uppercase tracking-wide"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 p-3 bg-white border-t border-gray-300 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        Powered by QuizMaster Exam Portal
      </footer>
    </div>
  );
};

export default CandidateLoginScreen;
