import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProducts } from './api.js';
import { load, save } from './storage.js';

const ShopContext = createContext(null);
const CART_KEY = 'sandhya-cart';
export const LAST_ORDER_KEY = 'sandhya-last-order';
export const TAX_RATE = 0.05;

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [cart, setCart] = useState(() => load(CART_KEY, {}));
  const [assistantOpen, setAssistantOpen] = useState(false);

  const loadProducts = useCallback(() => {
    setStatus('loading');
    getProducts()
      .then((list) => {
        setProducts(list);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(loadProducts, [loadProducts]);
  useEffect(() => save(CART_KEY, cart), [cart]);

  const update = useCallback((id, delta) => {
    setCart((current) => {
      const next = { ...current, [id]: Math.min(50, Math.max(0, (current[id] || 0) + delta)) };
      if (!next[id]) delete next[id];
      return next;
    });
  }, []);

  const value = useMemo(() => {
    const items = products.filter((p) => cart[p.id]).map((p) => ({ ...p, quantity: cart[p.id] }));
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    return {
      products,
      status,
      reloadProducts: loadProducts,
      cart,
      items,
      // Once the menu is known, ignore saved items that are no longer sold.
      count: status === 'ready' ? items.reduce((s, i) => s + i.quantity, 0) : Object.values(cart).reduce((s, q) => s + q, 0),
      subtotal,
      tax,
      total: subtotal + tax,
      addToCart: (id) => update(id, 1),
      update,
      remove: (id) => update(id, -(cart[id] || 0)),
      clearCart: () => setCart({}),
      assistantOpen,
      setAssistantOpen,
    };
  }, [products, status, loadProducts, cart, update, assistantOpen]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
