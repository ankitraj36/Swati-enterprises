/* ===========================
   PRODUCTS.JS – Product Renderer
   =========================== */
import Storage from './storage.js';

const Products = (() => {
  let allProducts = [];
  let allCategories = [];
  let allTestimonials = [];
  let allFaqs = [];

  const fetchData = async () => {
    if (allProducts.length) return;
    try {
      const res = await fetch('data/products.json');
      const data = await res.json();
      allProducts = data.products;
      allCategories = data.categories;
      allTestimonials = data.testimonials;
      allFaqs = data.faqs;
    } catch (e) {
      console.error('Failed to fetch products:', e);
    }
  };

  const getAll = () => allProducts;
  const getCategories = () => allCategories;
  const getTestimonials = () => allTestimonials;
  const getFaqs = () => allFaqs;
  const getById = (id) => allProducts.find(p => p.id === +id);
  const getByCategory = (slug) => allProducts.filter(p => p.categorySlug === slug);
  const getByIds = (ids) => ids.map(id => getById(id)).filter(Boolean);
  const getFeatured = (n = 8) => allProducts.slice(0, n);
  const getBestSellers = () => allProducts.filter(p => p.badge === 'Best Seller');
  const getRelated = (product, n = 4) => allProducts.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, n);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < full; i++) html += '★';
    if (half) html += '½';
    for (let i = Math.ceil(rating); i < 5; i++) html += '☆';
    return html;
  };

  const badgeHTML = (badge, badgeType) => {
    if (!badge) return '';
    return `<span class="badge badge-${badgeType === 'best' ? 'best' : badgeType === 'sale' ? 'sale' : badgeType === 'new' ? 'new' : badgeType === 'hot' ? 'hot' : 'primary'}">${badge}</span>`;
  };

  const productCardHTML = (product) => {
    const inWishlist = Storage.isInWishlist(product.id);
    const inCart = Storage.isInCart(product.id);
    return `
      <article class="product-card reveal" data-id="${product.id}">
        <div class="product-card-image-wrap">
          <div class="product-card-badges">${badgeHTML(product.badge, product.badgeType)}</div>
          <div class="product-card-actions">
            <button class="product-action-btn wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${product.id}" aria-label="${inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}" title="Wishlist">
              <svg viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
            <button class="product-action-btn quick-view-btn" data-id="${product.id}" aria-label="Quick view" title="Quick View">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <img class="product-card-img" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='images/products/placeholder.png'">
          <div class="product-quick-view-bar" data-id="${product.id}">👁 Quick View</div>
        </div>
        <div class="product-card-body">
          <p class="product-brand">${product.brand}</p>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            <span class="stars" aria-label="${product.rating} stars">${renderStars(product.rating)}</span>
            <span class="product-rating-count">(${product.reviews.toLocaleString()})</span>
          </div>
          <div class="product-price-row">
            <span class="product-price">₹${product.price}</span>
            ${product.mrp > product.price ? `<span class="product-mrp">₹${product.mrp}</span>` : ''}
            ${product.discount ? `<span class="product-discount">${product.discount}% off</span>` : ''}
          </div>
          <div class="product-card-footer">
            ${product.inStock
              ? `<button class="btn-add-cart add-to-cart-btn" data-id="${product.id}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  ${inCart ? 'In Cart' : 'Add to Cart'}
                </button>`
              : `<button class="btn-add-cart" disabled style="opacity:.5;cursor:not-allowed;">Out of Stock</button>`
            }
          </div>
        </div>
      </article>
    `;
  };

  const renderProducts = (container, products) => {
    if (!container) return;
    if (!products.length) {
      container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">No products found</h3>
        <p class="empty-state-desc">Try adjusting your filters or search term.</p>
      </div>`;
      return;
    }
    container.innerHTML = products.map(productCardHTML).join('');
    initCardEvents(container);
  };

  const initCardEvents = (container) => {
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = +btn.dataset.id;
        const product = getById(id);
        if (!product) return;
        Storage.addToCart(product);
        updateCartBadge();
        window.App?.showToast('success', '🛒 Added to Cart', `${product.name} added successfully`);
        btn.textContent = 'In Cart';
        btn.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;margin-right:6px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>');
        btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.92)' }, { transform: 'scale(1)' }], { duration: 300 });
      });
    });

    container.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = +btn.dataset.id;
        const product = getById(id);
        if (!product) return;
        const list = Storage.toggleWishlist(product);
        const isNow = Storage.isInWishlist(id);
        btn.classList.toggle('active', isNow);
        btn.querySelector('svg').setAttribute('fill', isNow ? 'currentColor' : 'none');
        btn.setAttribute('aria-label', isNow ? 'Remove from wishlist' : 'Add to wishlist');
        updateWishlistBadge();
        window.App?.showToast(isNow ? 'success' : 'info', isNow ? '❤️ Added to Wishlist' : '💔 Removed', product.name);
        btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
      });
    });

    container.querySelectorAll('.quick-view-btn, .product-quick-view-bar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = +btn.dataset.id;
        window.App?.openQuickView(id);
      });
    });
  };

  const updateCartBadge = () => {
    const count = Storage.getCartCount();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  };

  const updateWishlistBadge = () => {
    const count = Storage.getWishlistCount();
    document.querySelectorAll('.wishlist-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  };

  return {
    fetchData, getAll, getCategories, getTestimonials, getFaqs,
    getById, getByCategory, getByIds, getFeatured, getBestSellers, getRelated,
    renderStars, productCardHTML, renderProducts,
    updateCartBadge, updateWishlistBadge
  };
})();

export default Products;
