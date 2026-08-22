import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Page Placeholders (We will build these in Phase 6 & 7)
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ServantList from './pages/ServantList';
import Buy from './pages/Buy';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes (Accessible by both Customer & Admin) */}
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

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;