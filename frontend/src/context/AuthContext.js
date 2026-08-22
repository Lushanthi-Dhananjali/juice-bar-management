import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Custom hook to easily consume the AuthContext in any component
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // 1. Initialize user from localStorage if it exists
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('juice_bar_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Set default Axios Authorization header whenever user/token changes
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  // 3. Signup function
  const signup = async ({ name, age, role, password, adminPin }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        age,
        role,
        password,
        adminPin: role === 'admin' ? adminPin : undefined,
      });

      const userData = res.data;
      setUser(userData);
      localStorage.setItem('juice_bar_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      return { success: false, message };
    }
  };

  // 4. Login function
  const login = async ({ name, password, role }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        name,
        password,
        role,
      });

      const userData = res.data;
      setUser(userData);
      localStorage.setItem('juice_bar_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // 5. Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('juice_bar_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};