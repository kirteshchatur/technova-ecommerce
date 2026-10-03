import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('technova_token');
    const storedUser = localStorage.getItem('technova_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Verify with backend
        api.getMe()
          .then(res => {
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('technova_user', JSON.stringify(res.user));
            }
          })
          .catch(() => {
            logout();
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('technova_token', res.token);
      localStorage.setItem('technova_user', JSON.stringify(res.user));
      setUser(res.user);
      addToast(`Welcome back, ${res.user.name}!`);
      return res.user;
    }
  };

  const register = async (name, email, password, phone) => {
    const res = await api.register({ name, email, password, phone });
    if (res.success && res.token) {
      localStorage.setItem('technova_token', res.token);
      localStorage.setItem('technova_user', JSON.stringify(res.user));
      setUser(res.user);
      addToast('Account created successfully!');
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('technova_token');
    localStorage.removeItem('technova_user');
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const updateProfile = async (data) => {
    const res = await api.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('technova_user', JSON.stringify(res.user));
      addToast('Profile updated successfully.');
      return res.user;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
