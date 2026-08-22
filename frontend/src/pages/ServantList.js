import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ServantList = () => {
  const { isAdmin } = useAuth();

  const [servants, setServants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for adding a new servant (Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newServant, setNewServant] = useState({
    name: '',
    age: '',
  });

  // Fetch all servants from backend
  const fetchServants = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/servants');
      setServants(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch servants list');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServants();
  }, []);

  // Admin: Add Servant
  const handleAddServant = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/servants', {
        name: newServant.name.trim(),
        age: Number(newServant.age),
      });
      setNewServant({ name: '', age: '' });
      setShowAddModal(false);
      fetchServants();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding servant');
    }
  };

  // Admin: Delete Servant
  const handleDeleteServant = async (id) => {
    if (window.confirm('Are you sure you want to remove this servant from the roster?')) {
      try {
        await axios.delete(`http://localhost:5000/api/servants/${id}`);
        fetchServants();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting servant');
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
        <div>
          <h1 style={{ color: '#ff6b35', fontSize: '28px' }}>👥 Staff & Servants</h1>
          <p style={{ color: '#718096', marginTop: '4px' }}>
            Meet our dedicated team preparing and serving your fresh juices.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 18px' }}
          >
            ➕ Add New Servant (Admin)
          </button>
        )}
      </div>

      {error && <div style={{ color: '#e53e3e', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading staff members...</p>
      ) : servants.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#718096' }}>
          <p>No servants registered yet.</p>
        </div>
      ) : (
        <table className="table-custom">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>Servant Name</th>
              <th>Age</th>
              {isAdmin && <th style={{ width: '120px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {servants.map((servant, index) => (
              <tr key={servant._id}>
                <td>{index + 1}</td>
                <td style={{ fontWeight: '600' }}>{servant.name}</td>
                <td>{servant.age} years old</td>

                {/* Admin Action */}
                {isAdmin && (
                  <td>
                    <button
                      onClick={() => handleDeleteServant(servant._id)}
                      className="btn-danger"
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Admin Add Servant Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div className="auth-card" style={{ margin: 0, width: '90%', maxWidth: '400px' }}>
            <h3>Add New Servant</h3>
            <form onSubmit={handleAddServant} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={newServant.name}
                  onChange={(e) => setNewServant({ ...newServant, name: e.target.value })}
                  placeholder="e.g. Ruwan Silva"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  value={newServant.age}
                  onChange={(e) => setNewServant({ ...newServant, age: e.target.value })}
                  placeholder="e.g. 24"
                  min="18"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary">
                  Save Servant
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
    </div>
  );
};

export default ServantList;