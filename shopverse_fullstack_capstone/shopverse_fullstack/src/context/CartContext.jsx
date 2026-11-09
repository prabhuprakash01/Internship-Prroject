import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "shopverse-cart-v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(items)), [items]);

  const addItem = (product) => setItems((current) => {
    const found = current.find((item) => item.id === product.id);
    return found
      ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }];
  });

  const updateQuantity = (id, quantity) => setItems((current) =>
    quantity < 1 ? current.filter((item) => item.id !== id)
      : current.map((item) => item.id === id ? { ...item, quantity: Math.min(quantity, 20) } : item)
  );
  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clearCart, count, subtotal }),
    [items, count, subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
