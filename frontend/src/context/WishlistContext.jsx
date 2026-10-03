import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      const local = localStorage.getItem('technova_guest_wishlist');
      if (local) {
        try {
          setWishlist(JSON.parse(local));
        } catch (e) {
          setWishlist([]);
        }
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('technova_guest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const res = await api.getWishlist();
      if (res.success) {
        setWishlist(res.wishlist || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId || item.product_id === productId);
  };

  const toggleWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        const res = await api.toggleWishlist(product.id);
        if (res.success) {
          await fetchWishlist();
          addToast(res.message);
        }
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      setWishlist(prev => {
        const exists = prev.some(item => item.id === product.id);
        if (exists) {
          addToast('Removed from wishlist.', 'info');
          return prev.filter(item => item.id !== product.id);
        } else {
          addToast('Added to wishlist!');
          return [...prev, product];
        }
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        await api.removeFromWishlist(productId);
        await fetchWishlist();
        addToast('Removed from wishlist.', 'info');
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      setWishlist(prev => prev.filter(item => item.id !== productId));
      addToast('Removed from wishlist.', 'info');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
