import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  // Load persisted cart on startup
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart');
      }
    }
  }, []);

  // Save cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = 'STL') => {
    if (!product) return;
    const productId = product.id || product._id || 'MD-3001';
    const productImage =
      product.image ||
      (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
      '/images/jewellery_cad_ring.png';

    const normalizedProduct = {
      ...product,
      id: productId,
      image: productImage,
      price: Number(product.price || 0),
      size: size || 'STL'
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.id || item._id) === productId && item.size === normalizedProduct.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1
        };
        return updated;
      }

      return [...prev, { ...normalizedProduct, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !((item.id || item._id) === id && item.size === size))
    );
  };

  const updateQuantity = (id, size, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if ((item.id || item._id) === id && item.size === size) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const cartCount = cartItems.reduce(
    (count, item) => count + Number(item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        activeProduct,
        setActiveProduct
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
