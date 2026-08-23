import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAdmin } = useAuth();

  const [bestJuices, setBestJuices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Juice Modal State (Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Edit Price Modal State (Admin)
  const [editingJuice, setEditingJuice] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`,
    },
  });

  const fetchBestJuices = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/best-juices');
      setBestJuices(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load juices from server');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestJuices();
  }, []);

  // Admin: Add new juice
  const handleAddJuice = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price) {
      alert('Please provide juice name and price.');
      return;
    }

    if (!imageFile) {
      alert('Please select an image file from your PC.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('price', price);
    formData.append('image', imageFile);

    try {
      await axios.post('http://localhost:5000/api/best-juices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`,
        },
      });

      setName('');
      setPrice('');
      setImageFile(null);
      setShowAddModal(false);
      fetchBestJuices();
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading and adding juice');
    }
  };

  // Admin: Update Price
  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/best-juices/${editingJuice._id}`,
        { price: Number(editPrice) },
        getAuthConfig()
      );
      setEditingJuice(null);
      setEditPrice('');
      fetchBestJuices();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating price');
    }
  };

  // Admin: Delete Juice (Syncs to Menu Page)
  const handleDeleteJuice = async (id) => {
    if (window.confirm('Are you sure you want to delete this juice?')) {
      try {
        await axios.delete(`http://localhost:5000/api/best-juices/${id}`, getAuthConfig());
        fetchBestJuices();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting juice');
      }
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  return (
    <div className="container">
      {/* Header Banner */}
      <div style={{ textAlign: 'center', margin: '20px 0 30px' }}>
        <h1 style={{ color: '#ff6b35', fontSize: '32px', marginBottom: '8px' }}>
          🌟 Our Best Juices
        </h1>
        <p style={{ color: '#718096' }}>
          Handcrafted daily from 100% natural, farm-fresh organic fruits.
        </p>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 20px', marginTop: '16px' }}
          >
            ➕ Add New Juice (Admin)
          </button>
        )}
      </div>

      {error && <div style={{ color: '#e53e3e', textAlign: 'center' }}>{error}</div>}

      {/* Juices Grid */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading juices...</p>
      ) : bestJuices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          <h3>No juices added yet.</h3>
          {isAdmin ? (
            <p>Click "Add New Juice" above to upload a juice with a photo from your PC.</p>
          ) : (
            <p>Please check back soon for our fresh juice selection!</p>
          )}
        </div>
      ) : (
        <div className="card-grid">
          {bestJuices.map((juice) => (
            <div key={juice._id} className="card">
              <img
                src={getFullImageUrl(juice.imageUrl)}
                alt={juice.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <h3 style={{ margin: '12px 0 6px', fontSize: '18px' }}>{juice.name}</h3>
              <p style={{ color: '#ff6b35', fontWeight: 'bold', fontSize: '16px' }}>
                Rs. {juice.price}
              </p>

              {isAdmin && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setEditingJuice(juice);
                      setEditPrice(juice.price);
                    }}
                    style={{
                      background: '#3182ce',
                      color: 'white',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ✏️ Change Price
                  </button>
                  <button
                    onClick={() => handleDeleteJuice(juice._id)}
                    className="btn-danger"
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Admin Add Juice Modal */}
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
          <div className="auth-card" style={{ margin: 0, width: '90%', maxWidth: '450px' }}>
            <h3>Add New Juice</h3>
            <form onSubmit={handleAddJuice} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Juice Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Avocado juice"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price (Rs.):</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 250"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload Photo from PC:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  style={{ padding: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary">
                  Save & Upload
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

      {/* Admin Edit Price Modal */}
      {editingJuice && (
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
            <h3>Change Price for {editingJuice.name}</h3>
            <form onSubmit={handleUpdatePrice} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>New Price (Rs.):</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary">
                  Update Price
                </button>
                <button
                  type="button"
                  onClick={() => setEditingJuice(null)}
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

      {/* About Section */}
      <div
        style={{
          marginTop: '50px',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ color: '#2d3748', marginBottom: '14px' }}>🍹 About Our Juice Bar</h2>
        <p style={{ lineHeight: '1.7', color: '#4a5568' }}>
          Welcome to <strong>Fresh Juice Bar</strong>! Enjoy fresh, delicious natural juices prepared directly on order.
        </p>
      </div>
    </div>
  );
};

export default Home;