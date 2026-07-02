/* ===========================================================
   MODAL — quick view, image zoom, cart drawer
   =========================================================== */

/* --- Quick View Modal --- */
function openQuickView(id) {
  const p = getProductById(id);
  if (!p) return;
  const overlay = document.getElementById("quickViewOverlay");
  const body = document.getElementById("quickViewBody");
  if (!overlay || !body) return;

  const stockClass = p.stock === "in" ? "in" : p.stock === "low" ? "low" : "out";
  const discountPct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  body.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-media">${productIconSVG(p.icon)}</div>
      <div class="quickview-body">
        <span class="product-cat">${p.category}</span>
        <h2 style="margin:8px 0;">${p.name}</h2>
        <span class="product-brand" style="margin-bottom:8px;display:block;">${p.brand || ''}</span>
        <div class="product-rating" style="margin-bottom:10px;"><span class="stars">${starRow(p.rating)}</span> ${p.rating} (${p.reviews} reviews)</div>
        <div class="pd-price-row" style="margin:12px 0;">
          <span class="price-now">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
          ${discountPct ? `<span class="discount-pct">${discountPct}% off</span>` : ''}
        </div>
        <p style="color:var(--slate-2);font-size:.92rem;margin-bottom:14px;">${p.desc}</p>
        <span class="stock-status ${stockClass}">${p.stockLabel}</span>
        ${p.prescriptionRequired ? '<span class="rx-badge" style="margin-left:12px;">℞ Prescription Required</span>' : ''}
        <div class="delivery-badge" style="margin:10px 0;">🚚 Delivery in ${p.deliveryDays || 1}-${(p.deliveryDays || 1) + 1} days</div>
        <div class="pd-actions">
          <button class="btn btn-primary" data-add="${p.id}" ${p.stock==='out'?'disabled':''}>Add to Cart</button>
          <a class="btn btn-outline" href="product.html?id=${p.id}">View Full Details</a>
        </div>
      </div>
    </div>`;

  overlay.classList.add("show");
  document.body.style.overflow = "hidden";

  /* Track recently viewed */
  if (typeof StorageManager !== 'undefined') StorageManager.addRecentlyViewed(p.id);
}

function closeQuickView() {
  const overlay = document.getElementById("quickViewOverlay");
  if (overlay) {
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  }
}

/* --- Cart Drawer --- */
function openCartDrawer() {
  const overlay = document.getElementById("cartDrawerOverlay");
  const drawer = document.getElementById("cartDrawer");
  if (!overlay || !drawer) return;
  overlay.classList.add("show");
  drawer.classList.add("show");
  document.body.style.overflow = "hidden";
  renderCartDrawer();
}

function closeCartDrawer() {
  const overlay = document.getElementById("cartDrawerOverlay");
  const drawer = document.getElementById("cartDrawer");
  if (overlay) overlay.classList.remove("show");
  if (drawer) drawer.classList.remove("show");
  document.body.style.overflow = "";
}

function renderCartDrawer() {
  const body = document.getElementById("cartDrawerBody");
  const footer = document.getElementById("cartDrawerFooter");
  if (!body) return;

  const cart = getCart();
  if (!cart.length) {
    body.innerHTML = `<div class="empty-state" style="padding:40px 0;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--slate-3)" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg><h3>Cart is empty</h3><p>Add items to get started</p></div>`;
    if (footer) footer.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return '';
    return `<div class="cart-item-info" style="padding:14px 0;border-bottom:1px solid var(--line-2);gap:14px;">
      <div class="cart-thumb">${productIconSVG(p.icon)}</div>
      <div style="flex:1;">
        <h4 style="font-size:.88rem;">${p.name}</h4>
        <span style="font-size:.76rem;color:var(--slate-3);">${p.category}</span>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
          <span class="price-now" style="font-size:.92rem;">${formatPrice(p.price * item.qty)}</span>
          <span style="font-size:.76rem;color:var(--slate-3);">× ${item.qty}</span>
        </div>
      </div>
      <button class="remove-btn" data-remove="${p.id}" style="font-size:.72rem;">✕</button>
    </div>`;
  }).join('');

  const { subtotal, shipping, total } = cartTotals();
  if (footer) {
    footer.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
      <a href="cart.html" class="btn btn-outline btn-block" style="margin-top:12px;">View Cart</a>
      <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:8px;">Checkout</a>`;
  }
}

/* --- Init modal events --- */
document.addEventListener("DOMContentLoaded", () => {
  /* Quick view close */
  const qvOverlay = document.getElementById("quickViewOverlay");
  const qvClose = document.getElementById("quickViewClose");
  if (qvClose) qvClose.addEventListener("click", closeQuickView);
  if (qvOverlay) qvOverlay.addEventListener("click", e => { if (e.target === qvOverlay) closeQuickView(); });

  /* Cart drawer close */
  const cdOverlay = document.getElementById("cartDrawerOverlay");
  const cdClose = document.getElementById("cartDrawerClose");
  if (cdClose) cdClose.addEventListener("click", closeCartDrawer);
  if (cdOverlay) cdOverlay.addEventListener("click", closeCartDrawer);

  /* Escape key closes modals */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeQuickView();
      closeCartDrawer();
    }
  });
});
