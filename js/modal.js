/* ===========================
   MODAL.JS – Product Quick View Modal
   =========================== */
import Products from './products.js';
import Storage from './storage.js';

const Modal = (() => {
  const init = () => {
    const overlay = document.getElementById('quick-view-modal');
    if (!overlay) return;

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // Close button
    document.getElementById('modal-close-btn')?.addEventListener('click', close);

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  const open = async (productId) => {
    const overlay = document.getElementById('quick-view-modal');
    if (!overlay) return;

    await Products.fetchData();
    const product = Products.getById(productId);
    if (!product) return;

    Storage.addViewed(product);

    const body = document.getElementById('modal-body');
    if (body) body.innerHTML = quickViewHTML(product);

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Bind modal cart/wishlist events
    bindModalEvents(product);

    // Trap focus
    setTimeout(() => overlay.querySelector('.modal-close-btn')?.focus(), 100);
  };

  const close = () => {
    const overlay = document.getElementById('quick-view-modal');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  const quickViewHTML = (p) => `
    <div class="quick-view-grid">
      <div>
        <div style="aspect-ratio:1;background:var(--clr-bg-alt);border-radius:var(--radius-xl);display:flex;align-items:center;justify-content:center;border:1px solid var(--clr-border);overflow:hidden;margin-bottom:var(--space-3)">
          <img src="${p.image}" alt="${p.name}" style="width:85%;height:85%;object-fit:contain" onerror="this.src='images/products/placeholder.png'">
        </div>
      </div>
      <div>
        <p style="font-size:var(--text-xs);color:var(--clr-primary);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">${p.brand}</p>
        <h2 style="font-size:var(--text-xl);font-weight:800;color:var(--clr-text);margin-bottom:12px;line-height:1.3">${p.name}</h2>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <span style="color:var(--clr-amber);font-size:var(--text-sm)">${Products.renderStars(p.rating)}</span>
          <span style="font-size:var(--text-xs);color:var(--clr-text-muted)">${p.reviews.toLocaleString()} reviews</span>
        </div>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap">
          <span style="font-size:var(--text-3xl);font-weight:800;color:var(--clr-primary)">₹${p.price}</span>
          ${p.mrp > p.price ? `<span style="font-size:var(--text-base);color:var(--clr-text-light);text-decoration:line-through">₹${p.mrp}</span>` : ''}
          ${p.discount ? `<span class="badge badge-sale">${p.discount}% OFF</span>` : ''}
        </div>
        <p style="font-size:var(--text-sm);color:var(--clr-text-muted);line-height:1.75;margin-bottom:20px">${p.description}</p>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
          <span style="font-size:var(--text-xs);font-weight:600;color:${p.inStock ? 'var(--clr-primary)' : 'var(--clr-red)'};display:flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;background:${p.inStock ? 'var(--clr-primary)' : 'var(--clr-red)'}"></span>
            ${p.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          <span style="color:var(--clr-border-2)">·</span>
          <span style="font-size:var(--text-xs);color:var(--clr-text-muted)">${p.category}</span>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          ${p.inStock ? `
            <button class="btn btn-primary flex-1 modal-add-cart" data-id="${p.id}" style="max-width:200px">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add to Cart
            </button>
          ` : ''}
          <button class="btn btn-outline modal-add-wishlist ${Storage.isInWishlist(p.id) ? 'active' : ''}" data-id="${p.id}">
            <svg viewBox="0 0 24 24" fill="${Storage.isInWishlist(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${Storage.isInWishlist(p.id) ? 'In Wishlist' : 'Wishlist'}
          </button>
          <a href="product.html?id=${p.id}" class="btn btn-ghost">View Full Details →</a>
        </div>
      </div>
    </div>
  `;

  const bindModalEvents = (product) => {
    document.querySelector('.modal-add-cart')?.addEventListener('click', () => {
      Storage.addToCart(product);
      Products.updateCartBadge();
      window.App?.showToast('success', '🛒 Added to Cart!', product.name);
      close();
    });

    document.querySelector('.modal-add-wishlist')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      Storage.toggleWishlist(product);
      const isNow = Storage.isInWishlist(product.id);
      btn.classList.toggle('active', isNow);
      btn.querySelector('svg').setAttribute('fill', isNow ? 'currentColor' : 'none');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="${isNow ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>${isNow ? 'In Wishlist' : 'Wishlist'}`;
      Products.updateWishlistBadge();
      window.App?.showToast(isNow ? 'success' : 'info', isNow ? '❤️ Added to Wishlist' : 'Removed', product.name);
    });
  };

  return { init, open, close };
})();

export default Modal;
