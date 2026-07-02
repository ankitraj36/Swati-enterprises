/* ===========================================================
   STORAGE — centralized localStorage wrapper
   Manages recently viewed, recent searches, compare list
   =========================================================== */

const StorageManager = {
  _get(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  },
  _set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },

  /* --- Recently Viewed --- */
  VIEWED_KEY: "swati_recently_viewed",
  getRecentlyViewed() { return this._get(this.VIEWED_KEY); },
  addRecentlyViewed(productId) {
    let list = this.getRecentlyViewed().filter(id => id !== productId);
    list.unshift(productId);
    if (list.length > 12) list = list.slice(0, 12);
    this._set(this.VIEWED_KEY, list);
  },

  /* --- Recent Searches --- */
  SEARCH_KEY: "swati_recent_searches",
  getRecentSearches() { return this._get(this.SEARCH_KEY); },
  addRecentSearch(query) {
    const q = query.trim();
    if (!q) return;
    let list = this.getRecentSearches().filter(s => s !== q);
    list.unshift(q);
    if (list.length > 8) list = list.slice(0, 8);
    this._set(this.SEARCH_KEY, list);
  },
  clearRecentSearches() { this._set(this.SEARCH_KEY, []); },

  /* --- Compare --- */
  COMPARE_KEY: "swati_compare",
  getCompareList() { return this._get(this.COMPARE_KEY); },
  toggleCompare(productId) {
    let list = this.getCompareList();
    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
    } else {
      if (list.length >= 4) {
        showToast("You can compare up to 4 products", "error");
        return false;
      }
      list.push(productId);
    }
    this._set(this.COMPARE_KEY, list);
    return list.includes(productId);
  }
};
