import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Menu = () => {
  const { user, isAdmin } = useAuth();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for editing a menu item stock / price (Admin)
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: '',
    numberOfItems: '',
  });

  // State for manual Add Menu Item Modal (Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    numberOfItems: '',
  });

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`,
    },
  });

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/menu');
      setMenuItems(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch menu items');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Admin: Add Menu Item manually
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/menu',
        {
          name: newItem.name.trim(),
          price: Number(newItem.price),
          numberOfItems: Number(newItem.numberOfItems),
        },
        getAuthConfig()
      );
      setNewItem({ name: '', price: '', numberOfItems: '' });
      setShowAddModal(false);
      fetchMenuItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding menu item');
    }
  };

  // Admin: Update Stock or Price
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/menu/${editingItem._id}`,
        {
          name: editFormData.name.trim(),
          price: Number(editFormData.price),
          numberOfItems: Number(editFormData.numberOfItems),
        },
        getAuthConfig()
      );
      setEditingItem(null);
      fetchMenuItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating menu item');
    }
  };

  // Admin: Delete Menu Item (Syncs to Home Page)
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/${id}`, getAuthConfig());
        fetchMenuItems();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting menu item');
      }
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
        <div>
          <h1 style={{ color: '#ff6b35', fontSize: '28px' }}>📋 Juice Bar Menu & Inventory</h1>
          <p style={{ color: '#718096', marginTop: '4px' }}>
            All juices added from the Home page are automatically synchronized here with live stock levels.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '10px 18px' }}
          >
            ➕ Add Menu Item (Admin)
          </button>
        )}
      </div>

      {error && <div style={{ color: '#e53e3e', marginBottom: '16px' }}>{error}</div>}

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading menu items...</p>
      ) : menuItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          <h3>No menu items available.</h3>
          <p>Add juices from the Home page or click "Add Menu Item" above.</p>
        </div>
      ) : (
        <table className="table-custom">
          <thead>
            <tr>
              <th>#</th>
              <th>Juice Name</th>
              <th>Price (Rs.)</th>
              <th>Available Stock</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td style={{ fontWeight: '600' }}>{item.name}</td>
                <td style={{ color: '#ff6b35', fontWeight: 'bold' }}>Rs. {item.price}</td>
                <td>{item.numberOfItems} cups</td>
                <td>
                  {item.numberOfItems > 0 ? (
                    <span style={{ color: '#2f855a', fontWeight: 'bold', fontSize: '13px' }}>
                      ● In Stock
                    </span>
                  ) : (
                    <span style={{ color: '#e53e3e', fontWeight: 'bold', fontSize: '13px' }}>
                      ● Out of Stock
                    </span>
                  )}
                </td>

                {isAdmin && (
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setEditFormData({
                            name: item.name,
                            price: item.price,
                            numberOfItems: item.numberOfItems,
                          });
                        }}
                        style={{
                          background: '#3182ce',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        ✏️ Edit Stock
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="btn-danger"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
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

      {/* Admin Add Item Modal */}
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
            <h3>Add New Juice to Menu</h3>
            <form onSubmit={handleAddItem} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Juice Name:</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Passion Fruit"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (Rs.):</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="e.g. 350"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity (Cups):</label>
                <input
                  type="number"
                  value={newItem.numberOfItems}
                  onChange={(e) => setNewItem({ ...newItem, numberOfItems: e.target.value })}
                  placeholder="e.g. 25"
                  min="0"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary">
                  Save Item
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

      {/* Admin Edit Stock Modal */}
      {editingItem && (
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
            <h3>Edit Stock: {editingItem.name}</h3>
            <form onSubmit={handleUpdateItem} style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Juice Name:</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (Rs.):</label>
                <input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Available Stock (Cups):</label>
                <input
                  type="number"
                  value={editFormData.numberOfItems}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, numberOfItems: e.target.value })
                  }
                  min="0"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary">
                  Update Stock
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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

export default Menu;