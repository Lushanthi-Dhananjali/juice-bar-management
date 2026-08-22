import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // State for Change Admin PIN Modal
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinData, setPinData] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePinChange = (e) => {
    setPinData({
      ...pinData,
      [e.target.name]: e.target.value,
    });
    setPinError('');
    setPinSuccess('');
  };

  const handleUpdatePinSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation checks
    if (!pinData.currentPin || !pinData.newPin || !pinData.confirmPin) {
      setPinError('Please fill in all PIN fields.');
      return;
    }

    if (pinData.newPin.length !== 4 || isNaN(pinData.newPin)) {
      setPinError('New PIN must be exactly 4 numeric digits.');
      return;
    }

    if (pinData.newPin !== pinData.confirmPin) {
      setPinError('New PIN and Confirm PIN do not match.');
      return;
    }

    if (pinData.currentPin === pinData.newPin) {
      setPinError('New PIN must be different from current PIN.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put('http://localhost:5000/api/auth/update-pin', {
        currentPin: pinData.currentPin,
        newPin: pinData.newPin,
      });

      setLoading(false);
      setPinSuccess(res.data.message || 'PIN updated successfully!');
      setPinData({ currentPin: '', newPin: '', confirmPin: '' });

      // Automatically close modal after 1.5 seconds
      setTimeout(() => {
        setShowPinModal(false);
        setPinSuccess('');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setPinError(err.response?.data?.message || 'Failed to update Admin PIN.');
    }
  };

  if (!user) return null; // Do not display navbar on login/signup

  return (
    <>
      <nav className="navbar">
        <div>
          <Link to="/home" style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'none' }}>
            🍹 Fresh Juice Bar
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <Link to="/home">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/servants">Servant List</Link>
          <Link to="/buy">Buy Page</Link>

          <div className="nav-user">
            <span>{user.name}</span>
            <span
              className="badge"
              style={{
                backgroundColor: isAdmin ? '#2b6cb0' : '#38a169',
                color: 'white',
              }}
            >
              {user.role}
            </span>

            {/* Admin-Only Change PIN Button */}
            {isAdmin && (
              <button
                onClick={() => {
                  setShowPinModal(true);
                  setPinError('');
                  setPinSuccess('');
                }}
                style={{
                  background: '#d69e2e',
                  color: 'white',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}
              >
                🔑 Change PIN
              </button>
            )}

            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Admin Change PIN Modal */}
      {showPinModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <div className="auth-card" style={{ margin: 0, width: '90%', maxWidth: '380px' }}>
            <h3 style={{ marginBottom: '16px', color: '#2d3748', textAlign: 'center' }}>
              🔒 Update Admin Security PIN
            </h3>

            {pinError && (
              <div
                style={{
                  backgroundColor: '#fed7d7',
                  color: '#9b2c2c',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  fontSize: '13px',
                }}
              >
                {pinError}
              </div>
            )}

            {pinSuccess && (
              <div
                style={{
                  backgroundColor: '#c6f6d5',
                  color: '#22543d',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  fontSize: '13px',
                }}
              >
                {pinSuccess}
              </div>
            )}

            <form onSubmit={handleUpdatePinSubmit}>
              <div className="form-group">
                <label>Current 4-Digit PIN:</label>
                <input
                  type="password"
                  name="currentPin"
                  maxLength="4"
                  value={pinData.currentPin}
                  onChange={handlePinChange}
                  placeholder="e.g. 9393"
                  required
                />
              </div>

              <div className="form-group">
                <label>New 4-Digit PIN:</label>
                <input
                  type="password"
                  name="newPin"
                  maxLength="4"
                  value={pinData.newPin}
                  onChange={handlePinChange}
                  placeholder="e.g. 1234"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New PIN:</label>
                <input
                  type="password"
                  name="confirmPin"
                  maxLength="4"
                  value={pinData.confirmPin}
                  onChange={handlePinChange}
                  placeholder="e.g. 1234"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ backgroundColor: '#d69e2e' }}
                >
                  {loading ? 'Updating...' : 'Update PIN'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  style={{
                    background: '#a0aec0',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;