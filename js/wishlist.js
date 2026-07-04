/* ===========================
   WISHLIST.JS – Wishlist Logic
   =========================== */
import Storage from './storage.js';
import Products from './products.js';

const Wishlist = (() => {
  const render = () => {
    const container = document.getElementById('wishlist-container');
    const emptyState = document.getElementById('wishlist-empty');
    if (!container) return;

    const items = Storage.getWishlist();

    if (items.length === 0) {
      container.innerHTML = '';
      emptyState?.classList.remove('hidden');
    } else {
      emptyState?.classList.add('hidden');
      container.innerHTML = items.map(itemHTML).join('');
      bindEvents();
    }
  };

  const itemHTML = (product) => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card-image-wrap">
        ${product.badge ? `<div class="product-card-badges"><span class="badge badge-${product.badgeType || 'primary'}">${product.badge}</span></div>` : ''}
        <img class="product-card-img" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='images/products/placeholder.png'">
      </div>
      <div class="product-card-body">
        <p class="product-brand">${product.brand}</p>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${Products.renderStars(product.rating)}</span>
          <span class="product-rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">₹${product.price}</span>
          ${product.mrp > product.price ? `<span class="product-mrp">₹${product.mrp}</span>` : ''}
          ${product.discount ? `<span class="product-discount">${product.discount}% off</span>` : ''}
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary btn-sm flex-1 move-to-cart-btn" data-id="${product.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Move to Cart
          </button>
          <button class="btn btn-ghost btn-sm remove-wish-btn" data-id="${product.id}" title="Remove">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const bindEvents = () => {
    document.querySelectorAll('.move-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        const product = Storage.getWishlist().find(i => i.id === id);
        if (!product) return;
        Storage.addToCart(product);
        Storage.removeFromWishlist(id);
        render();
        Products.updateCartBadge();
        Products.updateWishlistBadge();
        window.App?.showToast('success', '🛒 Moved to Cart', product.name);
      });
    });

    document.querySelectorAll('.remove-wish-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        const product = Storage.getWishlist().find(i => i.id === id);
        const card = btn.closest('.product-card');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        card.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          Storage.removeFromWishlist(id);
          render();
          Products.updateWishlistBadge();
          window.App?.showToast('info', 'Removed from Wishlist', product?.name || '');
        }, 300);
      });
    });

    // Move all to cart
    document.getElementById('move-all-to-cart')?.addEventListener('click', () => {
      const items = Storage.getWishlist();
      items.forEach(p => Storage.addToCart(p));
      Storage.setWishlist([]);
      render();
      Products.updateCartBadge();
      Products.updateWishlistBadge();
      window.App?.showToast('success', '🛒 All Items Moved!', `${items.length} items added to cart`);
    });
  };

  const init = () => {
    render();
  };

  return { init, render };
})();

export default Wishlist;
