import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ExpenseList from './pages/ExpenseList';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';

// this component checks if user is logged in
function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Navbar />
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Navbar />
                <ExpenseList />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Navbar />
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
