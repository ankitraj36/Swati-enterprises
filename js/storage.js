/* ===========================
   STORAGE.JS – LocalStorage Wrapper
   =========================== */
const Storage = (() => {
  const KEYS = {
    CART:     'swati_cart',
    WISHLIST: 'swati_wishlist',
    THEME:    'swati_theme',
    SEARCHES: 'swati_searches',
    VIEWED:   'swati_viewed',
    USER:     'swati_user',
    ORDERS:   'swati_orders',
  };

  const get = (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  };

  const set = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('Storage set failed:', e); }
  };

  const remove = (key) => localStorage.removeItem(key);

  /* ── CART ── */
  const getCart = () => get(KEYS.CART, []);
  const setCart = (cart) => set(KEYS.CART, cart);
  const addToCart = (product, qty = 1) => {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx > -1) {
      cart[idx].qty = Math.min(cart[idx].qty + qty, 99);
    } else {
      cart.push({ ...product, qty });
    }
    setCart(cart);
    return cart;
  };
  const removeFromCart = (productId) => {
    const cart = getCart().filter(i => i.id !== productId);
    setCart(cart);
    return cart;
  };
  const updateCartQty = (productId, qty) => {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === productId);
    if (idx > -1) {
      if (qty <= 0) return removeFromCart(productId);
      cart[idx].qty = Math.min(qty, 99);
      setCart(cart);
    }
    return cart;
  };
  const clearCart = () => setCart([]);
  const getCartCount = () => getCart().reduce((sum, i) => sum + i.qty, 0);
  const getCartTotal = () => getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  const isInCart = (id) => getCart().some(i => i.id === id);

  /* ── WISHLIST ── */
  const getWishlist = () => get(KEYS.WISHLIST, []);
  const setWishlist = (w) => set(KEYS.WISHLIST, w);
  const addToWishlist = (product) => {
    const w = getWishlist();
    if (!w.find(i => i.id === product.id)) w.push(product);
    setWishlist(w);
    return w;
  };
  const removeFromWishlist = (id) => {
    const w = getWishlist().filter(i => i.id !== id);
    setWishlist(w);
    return w;
  };
  const toggleWishlist = (product) => {
    return isInWishlist(product.id)
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };
  const isInWishlist = (id) => getWishlist().some(i => i.id === id);
  const getWishlistCount = () => getWishlist().length;

  /* ── THEME ── */
  const getTheme = () => get(KEYS.THEME, 'light');
  const setTheme = (t) => set(KEYS.THEME, t);

  /* ── RECENT SEARCHES ── */
  const getSearches = () => get(KEYS.SEARCHES, []);
  const addSearch = (term) => {
    if (!term.trim()) return;
    let s = getSearches().filter(t => t !== term);
    s.unshift(term);
    s = s.slice(0, 8);
    set(KEYS.SEARCHES, s);
  };
  const clearSearches = () => set(KEYS.SEARCHES, []);

  /* ── RECENTLY VIEWED ── */
  const getViewed = () => get(KEYS.VIEWED, []);
  const addViewed = (product) => {
    let v = getViewed().filter(i => i.id !== product.id);
    v.unshift(product);
    v = v.slice(0, 12);
    set(KEYS.VIEWED, v);
  };

  /* ── ORDERS ── */
  const getOrders = () => get(KEYS.ORDERS, []);
  const addOrder = (order) => {
    const orders = getOrders();
    orders.unshift({ ...order, id: Date.now(), date: new Date().toISOString() });
    set(KEYS.ORDERS, orders.slice(0, 50));
    return orders[0];
  };

  return {
    KEYS,
    getCart, setCart, addToCart, removeFromCart,
    updateCartQty, clearCart, getCartCount, getCartTotal, isInCart,
    getWishlist, addToWishlist, removeFromWishlist,
    toggleWishlist, isInWishlist, getWishlistCount,
    getTheme, setTheme,
    getSearches, addSearch, clearSearches,
    getViewed, addViewed,
    getOrders, addOrder,
  };
})();

export default Storage;
