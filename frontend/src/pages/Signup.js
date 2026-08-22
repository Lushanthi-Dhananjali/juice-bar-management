import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    role: 'customer', // default role
    password: '',
    adminPin: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const { signup, loading } = useAuth();
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

    // 1. Basic validation
    if (!formData.name.trim() || !formData.age || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (Number(formData.age) <= 0) {
      setErrorMessage('Please enter a valid age.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // 2. Admin PIN validation if role is Admin
    if (formData.role === 'admin') {
      if (!formData.adminPin || formData.adminPin.trim().length !== 4) {
        setErrorMessage('Admin signup requires a valid 4-digit security PIN.');
        return;
      }
    }

    // 3. Call AuthContext signup method
    const result = await signup({
      name: formData.name.trim(),
      age: Number(formData.age),
      role: formData.role,
      password: formData.password,
      adminPin: formData.role === 'admin' ? formData.adminPin.trim() : undefined,
    });

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#ff6b35' }}>
          🍹 Create an Account
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
          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
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

          {/* Age Input */}
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role">Sign Up As:</label>
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

          {/* Dynamic 4-Digit Security PIN Field (Visible ONLY when Admin is chosen) */}
          {formData.role === 'admin' && (
            <div
              className="form-group"
              style={{
                backgroundColor: '#fffaf0',
                border: '1px solid #feebc8',
                padding: '12px',
                borderRadius: '6px',
              }}
            >
              <label htmlFor="adminPin" style={{ color: '#c05621' }}>
                🔒 Admin 4-Digit Security PIN:
              </label>
              <input
                type="password"
                id="adminPin"
                name="adminPin"
                placeholder="Enter 4-digit PIN"
                maxLength="4"
                value={formData.adminPin}
                onChange={handleChange}
                required
              />
              <small style={{ color: '#7b341e', display: 'block', marginTop: '4px' }}>
                Company verification PIN required to register as Admin.
              </small>
            </div>
          )}

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Create Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 6 characters"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '14px' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#ff6b35', fontWeight: 'bold' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;