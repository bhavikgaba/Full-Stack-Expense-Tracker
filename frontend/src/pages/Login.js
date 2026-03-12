import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg('');

    // simple validation
    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: email,
        password: password,
      });

      const data = response.data;
      // save token and user info
      login(data.token, { username: data.username, email: data.email });
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>
          Welcome back! Please login to your account.
        </p>

        {errorMsg && (
          <div className="error-box">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
