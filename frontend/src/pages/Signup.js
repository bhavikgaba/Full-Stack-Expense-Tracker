import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import './AuthPages.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username || !email || !password) {
      setErrorMsg('All fields are required');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/signup', {
        username: username,
        email: email,
        password: password,
      });

      setSuccessMsg(response.data.message);
      // redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
          Fill in the details below to register.
        </p>

        {errorMsg && <div className="error-box">{errorMsg}</div>}
        {successMsg && <div className="success-box">{successMsg}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
