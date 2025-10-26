import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../../../config';

export function Login() {
  const [form, setForm] = useState({
    identifier: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // 👈 Add this line

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);
    try {
      const res = await fetch(`https://bus-tracker-production-93a5.up.railway.app/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage('✅ Login successful!');
        localStorage.setItem('token', data.token); // if using token
        localStorage.setItem('user', JSON.stringify(data.user)); // optional

        // 👇 Redirect after 1 second
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessage(`❌ ${data.message || 'Invalid credentials'}`);
      }
    } catch (err) {
      setMessage('❌ Server error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>

      <img className='image' src="images/logo.png" alt="" />

      <input
        name="identifier"
        placeholder="Username or Email"
        value={form.identifier}
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

      <button type="submit">Login</button>

      {message && (
        <p className={success ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}

      <p className="auth-toggle">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
