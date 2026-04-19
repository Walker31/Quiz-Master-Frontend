import { useState, useEffect } from 'react';

// TODO: NTA-style quiz attempt window
export default function QuizAttemptWindow() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(10800); // 3 hours in seconds
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [sectionChangeModal, setSectionChangeModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (showInstructions) {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '40px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h1>Quiz Instructions</h1>
        <div style={{ marginTop: '30px', lineHeight: '1.8' }}>
          <h3>Before you start:</h3>
          <ul>
            <li>Read all instructions carefully</li>
            <li>You cannot pause or exit during the test</li>
            <li>Switching tabs will be monitored</li>
            <li>Make sure your internet connection is stable</li>
          </ul>
          <p style={{ marginTop: '20px', color: '#c0392b' }}>
            <strong>Note:</strong> Once you start, you cannot go back to review instructions.
          </p>
        </div>
        <div style={{ marginTop: '40px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
          <button
            onClick={() => setShowInstructions(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0a2a6e',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            I Agree, Start Test
          </button>
        </div>
      </div>
    );
  }

  // NTA-style main attempt interface
  return (
    <div style={{ backgroundColor: '#f5f6fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0a2a6e', color: '#fff', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
          <div>NTA — Quiz Master Exam</div>
          <div>Arjun Kumar · Roll: 240110012345</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', backgroundColor: '#122d74', padding: '8px 0' }}>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Paper</div>
            <div style={{ fontSize: '13px', fontWeight: '500', marginTop: '4px' }}>JEE Main #1</div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Time Remaining</div>
            <div style={{ fontSize: '13px', fontWeight: '500', marginTop: '4px', color: '#ffd700' }}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Answered</div>
            <div style={{ fontSize: '13px', fontWeight: '500', marginTop: '4px' }}>12 / 90</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Marked</div>
            <div style={{ fontSize: '13px', fontWeight: '500', marginTop: '4px' }}>2</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Section Tabs */}
        <div style={{ backgroundColor: '#1a3a80', width: '110px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          {['Physics', 'Chemistry', 'Maths'].map((section, idx) => (
            <div
              key={idx}
              onClick={() => setSectionChangeModal(true)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.6)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: idx === 0 ? '#0a2a6e' : 'transparent',
                color: idx === 0 ? '#ffd700' : 'rgba(255,255,255,0.6)',
                borderLeft: idx === 0 ? '3px solid #ffd700' : 'none',
                paddingLeft: idx === 0 ? '9px' : '12px',
              }}
            >
              <div>{section}</div>
              <div style={{ fontSize: '9px', marginTop: '2px', opacity: 0.7 }}>12 / 30</div>
            </div>
          ))}
        </div>

        {/* Questions Area */}
        <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Question Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#0a2a6e', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
              Question 3 of 30
            </span>
            <span style={{ backgroundColor: '#c8950a', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '10px' }}>
              MCQ — Single Correct
            </span>
            <button
              onClick={() => setMarkedForReview((prev) => new Set([...prev, currentQuestion]))}
              style={{
                backgroundColor: '#7b1fa2',
                color: '#fff',
                padding: '5px 12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Mark for review
            </button>
          </div>

          {/* Question Card */}
          <div style={{ backgroundColor: '#fff', border: '1px solid #dde2f0', borderRadius: '6px', padding: '14px 16px' }}>
            <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#1a1a1a', fontFamily: 'Georgia, serif', marginBottom: '12px' }}>
              A body of mass 2 kg starts from rest and moves under a force F = (4 + 2t) N along a straight line. The velocity of the
              body at t = 3 s is:
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['A', 'B', 'C', 'D'].map((opt) => (
                <div
                  key={opt}
                  onClick={() => setResponses((prev) => ({ ...prev, [currentQuestion]: opt }))}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '9px 12px',
                    border: responses[currentQuestion] === opt ? '1.5px solid #0a2a6e' : '1px solid #c8d0e0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: responses[currentQuestion] === opt ? '#dce8f8' : '#fff',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: responses[currentQuestion] === opt ? 'none' : '1.5px solid #0a2a6e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: responses[currentQuestion] === opt ? '#0a2a6e' : '#fff',
                      color: responses[currentQuestion] === opt ? '#fff' : '#0a2a6e',
                      flexShrink: 0,
                    }}
                  >
                    {opt}
                  </div>
                  <div style={{ fontSize: '13px', color: '#1a1a1a' }}>{opt}. {9 + (opt.charCodeAt(0) - 65)} m/s</div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Actions */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '7px 16px', backgroundColor: '#fff', border: '1px solid #aaa', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                Clear response
              </button>
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                style={{ padding: '7px 16px', backgroundColor: '#fff', border: '1px solid #0a2a6e', color: '#0a2a6e', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
              >
                Save & next
              </button>
            </div>
            <button
              onClick={() => setShowSubmitModal(true)}
              style={{ padding: '7px 16px', backgroundColor: '#c0392b', border: 'none', color: '#fff', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
            >
              Submit paper
            </button>
          </div>
        </div>

        {/* Question Palette */}
        <div style={{ width: '180px', flexShrink: 0, backgroundColor: '#fff', borderLeft: '1px solid #dde2f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #dde2f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0a2a6e', color: '#ffd700', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              AK
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '500' }}>Arjun Kumar</div>
              <div style={{ fontSize: '10px', color: '#888' }}>Batch A</div>
            </div>
          </div>
          <div style={{ padding: '6px 12px', fontSize: '10px', fontWeight: '500', color: '#555', backgroundColor: '#f5f6fa', borderBottom: '1px solid #dde2f0', textTransform: 'uppercase' }}>
            Physics palette
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px', padding: '8px' }}>
            {Array.from({ length: 20 }).map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: idx === currentQuestion ? '#0a2a6e' : idx < 10 ? '#1a7a3a' : '#e8eaf0',
                  color: idx === currentQuestion ? '#ffd700' : idx < 10 ? '#fff' : '#555',
                  border: idx === currentQuestion ? '1px solid #ffd700' : 'none',
                }}
              >
                {idx + 1}
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 12px', borderTop: '1px solid #dde2f0', marginTop: 'auto', fontSize: '10px', color: '#555' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#1a7a3a' }}></div>
              Answered
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#e8eaf0', border: '1px solid #aaa' }}></div>
              Not visited
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#7b1fa2' }}></div>
              Marked for review
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#0a2a6e', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            style={{ padding: '6px 16px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentQuestion(Math.min(29, currentQuestion + 1))}
            style={{ padding: '6px 16px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
          >
            Next →
          </button>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Tab switches logged: 0 · Auto-saves every 30s</div>
        <button
          onClick={() => setShowSubmitModal(true)}
          style={{ padding: '6px 16px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', backgroundColor: '#c8950a', border: 'none', color: '#1a0f00', fontWeight: '500' }}
        >
          Submit paper
        </button>
      </div>

      {/* Section Change Modal */}
      {sectionChangeModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', maxWidth: '400px' }}>
            <h3>Switch Section?</h3>
            <p style={{ marginTop: '10px', color: '#666' }}>You are moving to Chemistry. Are you sure?</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setSectionChangeModal(false)}
                style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setSectionChangeModal(false)}
                style={{ padding: '8px 16px', backgroundColor: '#0a2a6e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', maxWidth: '400px' }}>
            <h3>Submit Paper?</h3>
            <p style={{ marginTop: '10px', color: '#666' }}>You have 18 unanswered questions. Are you sure you want to submit?</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowSubmitModal(false)}
                style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => window.location.href = '/student/result'}
                style={{ padding: '8px 16px', backgroundColor: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
