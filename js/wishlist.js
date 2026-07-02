/* ===========================================================
   WISHLIST — localStorage-backed wishlist + page rendering
   =========================================================== */

const WISH_KEY = "swati_wishlist";

function getWishlist() {
  try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
  catch { return []; }
}
function isWishlisted(id) { return getWishlist().includes(Number(id)); }

function toggleWishlist(id) {
  id = Number(id);
  let list = getWishlist();
  const product = getProductById(id);
  if (list.includes(id)) {
    list = list.filter(i => i !== id);
    showToast(`${product ? product.name : "Item"} removed from wishlist`, "info");
  } else {
    list.push(id);
    showToast(`${product ? product.name : "Item"} added to wishlist`, "success");
    pulseIcon("wishIconBadge");
  }
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
  updateWishCount();
  return list.includes(id);
}

function updateWishCount() {
  const count = getWishlist().length;
  document.querySelectorAll("[data-wish-count]").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function moveToCartFromWishlist(productId) {
  addToCart(productId);
  let list = getWishlist().filter(id => id !== productId);
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
  updateWishCount();
  renderWishlistPage();
}

function removeFromWishlist(productId) {
  let list = getWishlist().filter(id => id !== productId);
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
  updateWishCount();
  showToast("Removed from wishlist", "info");
  renderWishlistPage();
}

/* ---------- Wishlist page rendering ---------- */
function renderWishlistPage() {
  const grid = document.getElementById("wishlistGrid");
  const emptyState = document.getElementById("wishEmpty");
  if (!grid) return;

  const list = getWishlist();
  if (!list.length) {
    grid.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  grid.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";

  grid.innerHTML = list.map(id => {
    const p = getProductById(id);
    if (!p) return "";
    const stockClass = p.stock === "in" ? "in" : p.stock === "low" ? "low" : "out";
    return `
    <article class="product-card" data-id="${p.id}">
      <a href="product.html?id=${p.id}" class="product-media">${productIconSVG(p.icon)}</a>
      <div class="product-info">
        <span class="product-cat">${p.category}</span>
        <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-price">
          <span class="price-now">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
        </div>
        <span class="stock-status ${stockClass}">${p.stockLabel}</span>
        <div class="wishlist-actions">
          <button class="btn btn-primary btn-sm" data-wish-cart="${p.id}" ${p.stock==='out'?'disabled':''}>Move to Cart</button>
          <button class="btn btn-ghost btn-sm" data-wish-remove="${p.id}">Remove</button>
        </div>
      </div>
    </article>`;
  }).join("");
}

function bindWishlistEvents() {
  const grid = document.getElementById("wishlistGrid");
  if (!grid) return;
  grid.addEventListener("click", e => {
    const cartBtn = e.target.closest("[data-wish-cart]");
    const removeBtn = e.target.closest("[data-wish-remove]");
    if (cartBtn) moveToCartFromWishlist(Number(cartBtn.dataset.wishCart));
    if (removeBtn) removeFromWishlist(Number(removeBtn.dataset.wishRemove));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateWishCount();
  renderWishlistPage();
  bindWishlistEvents();
});
