import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

export function Register() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'passenger',
  });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();  // <-- Add this

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);
    try {
      const res = await fetch(`https://bus-tracker-production-93a5.up.railway.app/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMessage('✅ Registration successful! Redirecting to login...');
        setForm({
          name: '',
          username: '',
          email: '',
          password: '',
          role: 'passenger',
        });
        setTimeout(() => {
          navigate('/login');   // <-- Redirect here
        }, 1500);
      } else {
        setMessage(`❌ ${data.message || 'Something went wrong.'}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Register</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="passenger">Passenger</option>
        <option value="driver">Driver</option>
      </select>

      <button type="submit">Register</button>

      {message && (
        <p className={success ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}

      <p className="auth-toggle">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
