'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const FREE_DELIVERY_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 99;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem('stylelens_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('stylelens_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to localStorage:', e);
      }
    }
  }, [cart, isClient]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item._id && item._id === product._id) || (item.id && item.id === product.id)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].qty + quantity;
        const maxStock = product.stock || 50;
        updated[existingIndex].qty = Math.min(newQty, maxStock);
        return updated;
      } else {
        return [
          ...prev,
          {
            ...product,
            productId: product._id || product.id,
            qty: quantity,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" to bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) =>
      prev.filter((item) => (item._id || item.id || item.productId) !== productId)
    );
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item._id || item.id || item.productId) === productId) {
            const newQty = item.qty + delta;
            const maxStock = item.stock || 50;
            return {
              ...item,
              qty: Math.min(Math.max(1, newQty), maxStock),
            };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = cartSubtotal >= FREE_DELIVERY_THRESHOLD || cartSubtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const cartTotal = cartSubtotal + shippingFee;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / FREE_DELIVERY_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, FREE_DELIVERY_THRESHOLD - cartSubtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        progressToFreeShipping,
        amountNeededForFreeShipping,
      }}
    >
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0A0A0A]/95 text-white border border-[#C9A227]/40 px-5 py-3 rounded-full shadow-2xl backdrop-blur-md animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227] animate-ping" />
          <p className="text-sm font-medium tracking-wide">{toastMessage}</p>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
