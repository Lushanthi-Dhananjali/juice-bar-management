import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ServantList = () => {
  const { user, isAdmin } = useAuth();

  const [servants, setServants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Servant Modal State (Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  // Edit Servant Modal State (Admin)
  const [editingServant, setEditingServant] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`,
    },
  });

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
      await axios.post(
        'http://localhost:5000/api/servants',
        { name: name.trim(), age: Number(age) },
        getAuthConfig()
      );
      setName('');
      setAge('');
      setShowAddModal(false);
      fetchServants();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding servant');
    }
  };

  // Admin: Update Servant Name and Age
  const handleUpdateServant = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/servants/${editingServant._id}`,
        {
          name: editName.trim(),
          age: Number(editAge),
        },
        getAuthConfig()
      );
      setEditingServant(null);
      fetchServants();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating servant');
    }
  };

  // Admin: Delete Servant
  const handleDeleteServant = async (id) => {
    if (window.confirm('Are you sure you want to delete this servant?')) {
      try {
        await axios.delete(`http://localhost:5000/api/servants/${id}`, getAuthConfig());
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
          <h1 style={{ color: '#ff6b35', fontSize: '28px' }}>🧑‍🍳 Juice Bar Servants List</h1>
          <p style={{ color: '#718096', marginTop: '4px' }}>
            Meet our dedicated team preparing fresh drinks every day.
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
        <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading servants...</p>
      ) : servants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          <h3>No servants registered yet.</h3>
          {isAdmin && <p>Click "Add New Servant" above to register a team member.</p>}
        </div>
      ) : (
        <table className="table-custom">
          <thead>
            <tr>
              <th>#</th>
              <th>Servant Name</th>
              <th>Age</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {servants.map((servant, index) => (
              <tr key={servant._id}>
                <td>{index + 1}</td>
                <td style={{ fontWeight: '600' }}>{servant.name}</td>
                <td>{servant.age} years old</td>

                {isAdmin && (
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingServant(servant);
                          setEditName(servant.name);
                          setEditAge(servant.age);
                        }}
                        style={{
                          background: '#3182ce',
                          color: 'white',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        ✏️ Edit Details
                      </button>
                      <button
                        onClick={() => handleDeleteServant(servant._id)}
                        className="btn-danger"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Admin Add Modal */}
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
          <div className="auth-card" style={{ margin: 0, width: '90%', maxWidth: '420px' }}>
            <h3>Add New Servant</h3>
            <form onSubmit={handleAddServant} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 24"
                  min="16"
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

      {/* Admin Edit Modal */}
      {editingServant && (
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
          <div className="auth-card" style={{ margin: 0, width: '90%', maxWidth: '420px' }}>
            <h3>Edit Servant Details</h3>
            <form onSubmit={handleUpdateServant} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  min="16"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary">
                  Update Details
                </button>
                <button
                  type="button"
                  onClick={() => setEditingServant(null)}
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