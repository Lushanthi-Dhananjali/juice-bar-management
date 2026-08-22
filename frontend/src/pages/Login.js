import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    role: 'customer', // default selection
  });
  const [errorMessage, setErrorMessage] = useState('');

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.password) {
      setErrorMessage('Please fill in both Name and Password.');
      return;
    }

    const result = await login({
      name: formData.name.trim(),
      password: formData.password,
      role: formData.role,
    });

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#ff6b35' }}>
          🍹 Juice Bar Login
        </h2>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fed7d7',
              color: '#9b2c2c',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selector: Admin or Customer */}
          <div className="form-group">
            <label htmlFor="role">Login As:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ fontWeight: 'bold' }}
            >
              <option value="customer">👤 Customer</option>
              <option value="admin">🔑 Admin</option>
            </select>
          </div>

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">User Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#ff6b35', fontWeight: 'bold' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;