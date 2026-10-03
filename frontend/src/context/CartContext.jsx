import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);

  // Fetch cart on load or auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      const localCart = localStorage.getItem('technova_guest_cart');
      if (localCart) {
        try {
          setItems(JSON.parse(localCart));
        } catch (e) {
          setItems([]);
        }
      }
    }
  }, [isAuthenticated]);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('technova_guest_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.getCart();
      if (res.success) {
        setItems(res.items || []);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, variant = null, quantity = 1) => {
    const variantId = variant?.id || null;
    const price = product.price + (variant?.price_delta || 0);
    const variantName = variant?.variant_name || null;
    const maxStock = variant ? variant.stock : product.stock;

    if (isAuthenticated) {
      try {
        const res = await api.addToCart(product.id, variantId, quantity);
        if (res.success) {
          await fetchCart();
          addToast(`✓ Added "${product.name}" to cart`);
        }
      } catch (err) {
        addToast(err.message || 'Failed to add item to cart', 'error');
      }
    } else {
      // Guest cart
      setItems(prev => {
        const existingIndex = prev.findIndex(item => 
          item.productId === product.id && item.variantId === variantId
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          if (newQty > maxStock) {
            addToast(`Only ${maxStock} units available in stock.`, 'error');
            return prev;
          }
          updated[existingIndex].quantity = newQty;
          updated[existingIndex].subtotal = updated[existingIndex].price * newQty;
          addToast(`✓ Updated quantity in cart`);
          return updated;
        } else {
          addToast(`✓ Added "${product.name}" to cart`);
          return [
            ...prev,
            {
              id: Date.now(),
              productId: product.id,
              variantId,
              name: product.name,
              slug: product.slug,
              variantName,
              price,
              originalPrice: product.original_price,
              image: product.images?.[0] || null,
              quantity,
              maxStock,
              subtotal: price * quantity
            }
          ];
        }
      });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        await api.updateCartItem(itemId, quantity);
        await fetchCart();
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }
      setItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity,
            subtotal: item.price * quantity
          };
        }
        return item;
      }));
    }
  };

  const removeItem = async (itemId) => {
    if (isAuthenticated) {
      try {
        await api.removeCartItem(itemId);
        await fetchCart();
        addToast('Product removed from cart.', 'info');
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      setItems(prev => prev.filter(i => i.id !== itemId));
      addToast('Product removed from cart.', 'info');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.clearCart();
        setItems([]);
      } catch (err) {
        console.error(err);
      }
    } else {
      setItems([]);
    }
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success && res.coupon) {
        setCoupon(res.coupon);
        addToast(`Coupon "${res.coupon.code}" applied! Saved ₹${res.coupon.discountAmount.toLocaleString('en-IN')}`);
        return true;
      }
    } catch (err) {
      addToast(err.message || 'Invalid coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Coupon removed.', 'info');
  };

  // Pricing calculations
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.subtotal, 0);
  const couponDiscount = coupon ? Math.min(coupon.discountAmount, subtotal) : 0;
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const taxAmount = Math.round(taxableAmount * 0.18);
  const shippingFee = subtotal >= 1000 || items.length === 0 ? 0 : 99;
  const finalTotal = taxableAmount + taxAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        loading,
        subtotal,
        coupon,
        couponDiscount,
        taxAmount,
        shippingFee,
        finalTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
