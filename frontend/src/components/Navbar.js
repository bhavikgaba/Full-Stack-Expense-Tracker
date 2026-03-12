import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">💰 Expense Tracker</span>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/expenses" className="nav-link">Expenses</Link>
        <Link to="/analytics" className="nav-link">Analytics</Link>
      </div>
      <div className="navbar-right">
        <span className="welcome-text">Welcome, {user?.username}!</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
