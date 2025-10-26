import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Register } from '../RegisterPage/RegisterPage';
import { Login } from '../LoginPage/LoginPage';

export function Auth() {
  return (
    <Router>
      <div className="auth-container">
        <nav className="auth-nav">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
