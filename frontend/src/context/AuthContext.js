import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  function login(tokenValue, userData) {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
