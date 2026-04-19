import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement forgot password API call
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1>Forgot Password</h1>
      
      {submitted ? (
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <p>Password reset link sent to {email}</p>
          <button onClick={() => navigate('/login')} style={{ marginTop: '10px' }}>
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0a2a6e', color: '#fff' }}>
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
}
