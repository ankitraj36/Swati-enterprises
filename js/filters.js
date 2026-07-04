/* ===========================
   FILTERS.JS – Shop Filters & Sorting
   =========================== */
import Products from './products.js';

const Filters = (() => {
  let currentFilters = {
    categories: [],
    priceMin: 0,
    priceMax: 5000,
    rating: 0,
    inStock: false,
    sort: 'featured',
    query: '',
  };

  const init = async () => {
    await Products.fetchData();
    readURLParams();
    bindFilterEvents();
    applyFilters();
  };

  const readURLParams = () => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('q'))    { currentFilters.query = p.get('q'); const el = document.getElementById('nav-search-input'); if (el) el.value = p.get('q'); }
    if (p.get('cat'))  currentFilters.categories = [p.get('cat')];
    if (p.get('sort')) currentFilters.sort = p.get('sort');
    // Pre-check category checkbox
    if (currentFilters.categories.length) {
      const cb = document.querySelector(`input[name="category"][value="${currentFilters.categories[0]}"]`);
      cb?.setAttribute('checked', true);
    }
    const searchDisplay = document.getElementById('search-query-display');
    if (searchDisplay && currentFilters.query) searchDisplay.textContent = `Results for: "${currentFilters.query}"`;
  };

  const bindFilterEvents = () => {
    // Category checkboxes
    document.querySelectorAll('input[name="category"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          if (!currentFilters.categories.includes(cb.value)) currentFilters.categories.push(cb.value);
        } else {
          currentFilters.categories = currentFilters.categories.filter(c => c !== cb.value);
        }
        applyFilters();
      });
    });

    // Price range
    const priceSlider = document.getElementById('price-slider');
    const priceMax = document.getElementById('price-max');
    if (priceSlider) {
      priceSlider.addEventListener('input', () => {
        currentFilters.priceMax = +priceSlider.value;
        if (priceMax) priceMax.value = priceSlider.value;
        applyFilters();
      });
    }
    const priceMinInput = document.getElementById('price-min-input');
    const priceMaxInput = document.getElementById('price-max-input');
    [priceMinInput, priceMaxInput].forEach(el => {
      el?.addEventListener('change', () => {
        currentFilters.priceMin = +(priceMinInput?.value || 0);
        currentFilters.priceMax = +(priceMaxInput?.value || 5000);
        applyFilters();
      });
    });

    // Rating
    document.querySelectorAll('input[name="rating"]').forEach(rb => {
      rb.addEventListener('change', () => { currentFilters.rating = +rb.value; applyFilters(); });
    });

    // In stock
    const inStockCb = document.getElementById('filter-in-stock');
    inStockCb?.addEventListener('change', () => { currentFilters.inStock = inStockCb.checked; applyFilters(); });

    // Sort
    const sortSelect = document.getElementById('sort-select');
    sortSelect?.addEventListener('change', () => { currentFilters.sort = sortSelect.value; applyFilters(); });

    // Clear all
    document.getElementById('clear-all-filters')?.addEventListener('click', clearFilters);

    // Mobile filter toggle
    document.getElementById('filter-toggle-btn')?.addEventListener('click', () => {
      document.querySelector('.filter-sidebar')?.classList.toggle('filter-open');
    });
  };

  const applyFilters = () => {
    let products = Products.getAll();

    if (currentFilters.query) {
      const q = currentFilters.query.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (currentFilters.categories.length) {
      products = products.filter(p => currentFilters.categories.includes(p.categorySlug));
    }

    products = products.filter(p =>
      p.price >= currentFilters.priceMin &&
      p.price <= currentFilters.priceMax
    );

    if (currentFilters.rating > 0) {
      products = products.filter(p => p.rating >= currentFilters.rating);
    }

    if (currentFilters.inStock) {
      products = products.filter(p => p.inStock);
    }

    // Sort
    switch (currentFilters.sort) {
      case 'price-asc':  products.sort((a, b) => a.price - b.price); break;
      case 'price-desc': products.sort((a, b) => b.price - a.price); break;
      case 'rating':     products.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     products.sort((a, b) => b.id - a.id); break;
      case 'discount':   products.sort((a, b) => b.discount - a.discount); break;
      default: break; // featured
    }

    const countEl = document.getElementById('products-count');
    if (countEl) countEl.textContent = `${products.length} products found`;

    const grid = document.getElementById('products-grid');
    if (grid) Products.renderProducts(grid, products);
  };

  const clearFilters = () => {
    currentFilters = { categories: [], priceMin: 0, priceMax: 5000, rating: 0, inStock: false, sort: 'featured', query: '' };
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="rating"]').forEach(rb => rb.checked = false);
    const inStockCb = document.getElementById('filter-in-stock');
    if (inStockCb) inStockCb.checked = false;
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) priceSlider.value = 5000;
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'featured';
    applyFilters();
    window.App?.showToast('info', 'Filters Cleared', 'All filters have been reset');
  };

  return { init, applyFilters, clearFilters };
})();

export default Filters;
