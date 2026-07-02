/* ===========================================================
   CART — localStorage-backed cart with GST, drawer, coupons
   =========================================================== */

const CART_KEY = "swati_cart";
const SHIPPING_FLAT = 49;
const FREE_SHIP_THRESHOLD = 999;
const GST_RATE = 0.05; /* 5% GST on medicines */

const COUPONS = {
  "SWATI10": { type: "percent", value: 10, label: "10% off" },
  "FLAT50": { type: "flat", value: 50, label: "₹50 off" },
  "NEWUSER": { type: "percent", value: 15, label: "15% off (new user)" }
};

let appliedCoupon = null;

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const product = getProductById(productId);
  if (!product || product.stock === "out") return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty += qty; }
  else { cart.push({ id: productId, qty }); }
  saveCart(cart);
  showToast(`${product.name} added to cart`, "success");
  pulseIcon("cartIconBadge");

  /* Open cart drawer if it exists */
  if (document.getElementById("cartDrawer")) {
    setTimeout(() => openCartDrawer(), 200);
  }
}

function removeFromCart(productId) {
  let cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  showToast("Item removed from cart", "info");
  renderCartPage();
  if (typeof renderCartDrawer === "function") renderCartDrawer();
}

function moveToWishlistFromCart(productId) {
  if (typeof toggleWishlist === "function") {
    if (!isWishlisted(productId)) toggleWishlist(productId);
  }
  removeFromCart(productId);
  showToast("Moved to wishlist", "success");
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
  renderCartPage();
}

function cartTotals() {
  const cart = getCart();
  let subtotal = 0, count = 0, savings = 0;
  cart.forEach(i => {
    const p = getProductById(i.id);
    if (p) {
      subtotal += p.price * i.qty;
      count += i.qty;
      if (p.oldPrice) savings += (p.oldPrice - p.price) * i.qty;
    }
  });

  const gst = Math.round(subtotal * GST_RATE);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FLAT;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") discount = Math.round(subtotal * appliedCoupon.value / 100);
    else discount = appliedCoupon.value;
  }

  const total = subtotal + gst + shipping - discount;
  return { subtotal, gst, shipping, total, count, savings, discount };
}

function updateCartCount() {
  const { count } = cartTotals();
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

function pulseIcon(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
}

/* ---------- Cart page rendering ---------- */
function renderCartPage() {
  const tbody = document.getElementById("cartBody");
  const emptyState = document.getElementById("cartEmpty");
  const cartContent = document.getElementById("cartContent");
  if (!tbody) return;
  const cart = getCart();

  if (!cart.length) {
    if (emptyState) emptyState.style.display = "block";
    if (cartContent) cartContent.style.display = "none";
    return;
  }
  if (emptyState) emptyState.style.display = "none";
  if (cartContent) cartContent.style.display = "grid";

  tbody.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return "";
    return `
    <tr data-row="${p.id}">
      <td>
        <div class="cart-item-info">
          <div class="cart-thumb">${productIconSVG(p.icon)}</div>
          <div>
            <h4>${p.name}</h4>
            <span>${p.category}</span>
          </div>
        </div>
      </td>
      <td>${formatPrice(p.price)}</td>
      <td>
        <div class="qty-control">
          <button data-decr="${p.id}" aria-label="Decrease quantity">−</button>
          <input type="number" min="1" value="${item.qty}" data-qty="${p.id}" aria-label="Quantity">
          <button data-incr="${p.id}" aria-label="Increase quantity">+</button>
        </div>
      </td>
      <td>${formatPrice(p.price * item.qty)}</td>
      <td>
        <button class="remove-btn" data-remove="${p.id}">✕ Remove</button>
        <button class="move-wish-btn" data-move-wish="${p.id}">♡ Move to Wishlist</button>
      </td>
    </tr>`;
  }).join("");

  const { subtotal, gst, shipping, total, savings, discount } = cartTotals();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("cartSubtotal", formatPrice(subtotal));
  set("cartGst", formatPrice(gst));
  set("cartShipping", shipping === 0 ? "Free" : formatPrice(shipping));
  set("cartDiscount", discount > 0 ? `−${formatPrice(discount)}` : "₹0");
  set("cartTotal", formatPrice(total));
  set("cartSavings", savings > 0 ? `You save ${formatPrice(savings)} on this order!` : "");
}

function bindCartPageEvents() {
  const tbody = document.getElementById("cartBody");
  if (!tbody) return;

  tbody.addEventListener("click", e => {
    const decr = e.target.closest("[data-decr]");
    const incr = e.target.closest("[data-incr]");
    const remove = e.target.closest("[data-remove]");
    const moveWish = e.target.closest("[data-move-wish]");

    if (decr) {
      const id = Number(decr.dataset.decr);
      const item = getCart().find(i => i.id === id);
      if (item) updateCartQty(id, item.qty - 1 <= 0 ? 1 : item.qty - 1);
    }
    if (incr) {
      const id = Number(incr.dataset.incr);
      const item = getCart().find(i => i.id === id);
      if (item) updateCartQty(id, item.qty + 1);
    }
    if (remove) removeFromCart(Number(remove.dataset.remove));
    if (moveWish) moveToWishlistFromCart(Number(moveWish.dataset.moveWish));
  });

  tbody.addEventListener("change", e => {
    if (e.target.matches("[data-qty]")) {
      updateCartQty(Number(e.target.dataset.qty), Number(e.target.value));
    }
  });

  /* Promo code */
  const promoBtn = document.getElementById("promoApply");
  if (promoBtn) {
    promoBtn.addEventListener("click", () => {
      const input = document.getElementById("promoInput");
      if (!input) return;
      const code = input.value.trim().toUpperCase();
      const coupon = COUPONS[code];
      if (coupon) {
        appliedCoupon = coupon;
        showToast(`Promo code applied — ${coupon.label}!`, "success");
        renderCartPage();
      } else {
        appliedCoupon = null;
        showToast("Invalid or expired promo code", "error");
        renderCartPage();
      }
    });
  }
}

/* ---------- Checkout summary ---------- */
function renderCheckoutSummary() {
  const list = document.getElementById("checkoutItems");
  if (!list) return;
  const cart = getCart();
  if (!cart.length) {
    list.innerHTML = `<p style="color:var(--slate-2);font-size:.9rem;">Your cart is empty. <a href="shop.html" style="color:var(--green-dark);font-weight:600;">Go to shop →</a></p>`;
  } else {
    list.innerHTML = cart.map(item => {
      const p = getProductById(item.id);
      if (!p) return "";
      return `<div class="summary-row"><span>${p.name} × ${item.qty}</span><span>${formatPrice(p.price * item.qty)}</span></div>`;
    }).join("");
  }
  const { subtotal, gst, shipping, total } = cartTotals();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("checkoutSubtotal", formatPrice(subtotal));
  set("checkoutGst", formatPrice(gst));
  set("checkoutShipping", shipping === 0 ? "Free" : formatPrice(shipping));
  set("checkoutTotal", formatPrice(total));
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartPage();
  bindCartPageEvents();
  renderCheckoutSummary();
});
