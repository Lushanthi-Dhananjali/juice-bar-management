import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ServantList from './pages/ServantList';
import Buy from './pages/Buy';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/home" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/home" replace />}
          />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servants"
            element={
              <ProtectedRoute>
                <ServantList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy"
            element={
              <ProtectedRoute>
                <Buy />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to={user ? '/home' : '/login'} replace />} />
        </Routes>
      </div>

      {/* Footer across all pages when logged in */}
      {user && <Footer />}
    </div>
  );
}

export default App;