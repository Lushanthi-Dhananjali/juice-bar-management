import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Buy = () => {
  const { user, isAdmin } = useAuth();

  // Menu items list from backend
  const [menuList, setMenuList] = useState([]);

  // Customer Cart State
  const [selectedJuiceId, setSelectedJuiceId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [completedBill, setCompletedBill] = useState(null);

  // Admin Order History State
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // Fetch Menu Items (for both Customer and Admin)
  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/menu');
      setMenuList(res.data);
      if (res.data.length > 0 && !selectedJuiceId) {
        setSelectedJuiceId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
    }
  };

  // Fetch Order Records (Admin Only)
  const fetchOrders = async () => {
    if (!isAdmin) return;
    setLoadingHistory(true);
    setHistoryError('');
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrderHistory(res.data);
      setLoadingHistory(false);
    } catch (err) {
      setHistoryError(err.response?.data?.message || 'Failed to fetch order history');
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchMenu();
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  // Customer: Add Item to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();

    const selectedItem = menuList.find((item) => item._id === selectedJuiceId);
    if (!selectedItem) return;

    const qtyNum = Number(quantity);
    if (qtyNum <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (qtyNum > selectedItem.numberOfItems) {
      alert(`Only ${selectedItem.numberOfItems} cups available in stock!`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.juiceId === selectedItem._id);

    if (existingIndex !== -1) {
      const newQty = cart[existingIndex].quantity + qtyNum;
      if (newQty > selectedItem.numberOfItems) {
        alert(`Cannot exceed available stock of ${selectedItem.numberOfItems} cups.`);
        return;
      }

      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity = newQty;
      updatedCart[existingIndex].subtotal = newQty * selectedItem.price;
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          juiceId: selectedItem._id,
          juiceName: selectedItem.name,
          price: selectedItem.price,
          quantity: qtyNum,
          subtotal: qtyNum * selectedItem.price,
        },
      ]);
    }

    setQuantity(1);
  };

  // Customer: Remove Item from Cart
  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Calculate Cart Total
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Customer: Confirm Buy & Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    try {
      const payload = {
        items: cart.map((item) => ({
          juiceName: item.juiceName,
          quantity: item.quantity,
        })),
      };

      await axios.post('http://localhost:5000/api/orders', payload);

      // Save receipt data
      setCompletedBill({
        customerName: user.name,
        items: [...cart],
        totalAmount,
        date: new Date().toLocaleString(),
      });

      // Reset cart and reload stock
      setCart([]);
      fetchMenu();
      if (isAdmin) fetchOrders();

      alert('Order placed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing your order');
    }
  };

  // Admin: Delete Order Record
  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this order record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`);
        setOrderHistory((prev) => prev.filter((order) => order._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting order');
      }
    }
  };

  return (
    <div className="container">
      {/* Page Header */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <h1 style={{ color: '#ff6b35', fontSize: '30px' }}>🛒 Fresh Juice Checkout</h1>
        <p style={{ color: '#718096' }}>Select your drinks, manage quantities, and complete purchase.</p>
      </div>

      {/* Checkout Grid: Left = Add to Cart, Right = Cart Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left Card: Drink Selector */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: '16px', color: '#2d3748' }}>🥤 Select Fresh Juice</h3>

          <form onSubmit={handleAddToCart}>
            <div className="form-group">
              <label>Available Drinks:</label>
              <select
                value={selectedJuiceId}
                onChange={(e) => setSelectedJuiceId(e.target.value)}
                required
              >
                {menuList.map((item) => (
                  <option key={item._id} value={item._id} disabled={item.numberOfItems <= 0}>
                    {item.name} - Rs. {item.price} ({item.numberOfItems > 0 ? `${item.numberOfItems} in stock` : 'Out of stock'})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity (Cups):</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
              🛒 Add to Cart
            </button>
          </form>
        </div>

        {/* Right Card: Real-time Cart */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ marginBottom: '16px', color: '#2d3748' }}>🧾 Your Cart Summary</h3>

          {cart.length === 0 ? (
            <p style={{ color: '#a0aec0', textAlign: 'center', marginTop: '30px' }}>Your cart is empty.</p>
          ) : (
            <>
              <table className="table-custom" style={{ marginTop: '0' }}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.juiceName}</td>
                      <td>{item.quantity}</td>
                      <td>Rs. {item.price}</td>
                      <td style={{ fontWeight: 'bold' }}>Rs. {item.subtotal}</td>
                      <td>
                        <button
                          onClick={() => handleRemoveFromCart(idx)}
                          className="btn-danger"
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Amount:</span>
                <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff6b35' }}>
                  Rs. {totalAmount}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary"
                style={{ marginTop: '20px', backgroundColor: '#38a169' }}
              >
                ✅ Confirm Buy & Checkout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generated Receipt Modal / Box */}
      {completedBill && (
        <div
          style={{
            marginTop: '36px',
            background: '#f7fafc',
            border: '2px dashed #48bb78',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3 style={{ textAlign: 'center', color: '#2f855a', marginBottom: '12px' }}>
            🎉 Purchase Receipt
          </h3>
          <p><strong>Customer:</strong> {completedBill.customerName}</p>
          <p><strong>Date & Time:</strong> {completedBill.date}</p>

          <table className="table-custom" style={{ margin: '16px 0' }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {completedBill.items.map((it, i) => (
                <tr key={i}>
                  <td>{it.juiceName}</td>
                  <td>{it.quantity}</td>
                  <td>Rs. {it.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold', color: '#276749' }}>
            Total Paid: Rs. {completedBill.totalAmount}
          </div>
        </div>
      )}

      {/* Admin-Only Customer Order History Section */}
      {isAdmin && (
        <div style={{ marginTop: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ color: '#2d3748', fontSize: '22px' }}>📑 All Customer Order Records (Admin View)</h2>
              <p style={{ color: '#718096', fontSize: '14px' }}>Overview of all purchases across the system.</p>
            </div>
            <button onClick={fetchOrders} className="btn-primary" style={{ width: 'auto', padding: '6px 14px' }}>
              🔄 Refresh Orders
            </button>
          </div>

          {historyError && (
            <div style={{ color: '#e53e3e', marginBottom: '12px' }}>{historyError}</div>
          )}

          {loadingHistory ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading order records...</p>
          ) : orderHistory.length === 0 ? (
            <p style={{ color: '#718096', textAlign: 'center', marginTop: '20px' }}>No orders placed yet.</p>
          ) : (
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Date & Time</th>
                  <th>Customer Name</th>
                  <th>Purchased Items</th>
                  <th>Total Amount</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((ord) => (
                  <tr key={ord._id}>
                    <td style={{ fontSize: '13px', color: '#4a5568' }}>
                      {new Date(ord.createdAt || ord.orderDate).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 'bold', color: '#2d3748' }}>{ord.customerName}</td>
                    <td>
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
                        {ord.items.map((i, k) => (
                          <li key={k} style={{ fontSize: '13px', marginBottom: '3px' }}>
                            🥤 <strong>{i.juiceName}</strong> × {i.quantity} (Rs. {i.subtotal})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ color: '#ff6b35', fontWeight: 'bold' }}>Rs. {ord.totalAmount}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteOrder(ord._id)}
                        className="btn-danger"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Buy;