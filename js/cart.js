/* ===========================================================
   CART — localStorage-backed cart management
   =========================================================== */

const CART_KEY = "swati_cart";
const SHIPPING_FLAT = 49;
const FREE_SHIP_THRESHOLD = 999;

function getCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function addToCart(productId, qty = 1){
  const product = getProductById(productId);
  if(!product || product.stock === "out") return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if(existing){ existing.qty += qty; }
  else{ cart.push({ id: productId, qty }); }
  saveCart(cart);
  showToast(`${product.name} added to cart`, "success");
  pulseIcon("cartIconBadge");
}
function removeFromCart(productId){
  let cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  showToast("Item removed from cart", "info");
  renderCartPage();
}
function updateCartQty(productId, qty){
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if(!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
  renderCartPage();
}
function cartTotals(){
  const cart = getCart();
  let subtotal = 0, count = 0;
  cart.forEach(i => {
    const p = getProductById(i.id);
    if(p){ subtotal += p.price * i.qty; count += i.qty; }
  });
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;
  return { subtotal, shipping, total, count };
}
function updateCartCount(){
  const { count } = cartTotals();
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}
function pulseIcon(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
}

/* ---------- Cart page rendering ---------- */
function renderCartPage(){
  const tbody = document.getElementById("cartBody");
  const emptyState = document.getElementById("cartEmpty");
  const cartContent = document.getElementById("cartContent");
  if(!tbody) return;
  const cart = getCart();

  if(!cart.length){
    if(emptyState) emptyState.style.display = "block";
    if(cartContent) cartContent.style.display = "none";
    return;
  }
  if(emptyState) emptyState.style.display = "none";
  if(cartContent) cartContent.style.display = "grid";

  tbody.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if(!p) return "";
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
      <td><button class="remove-btn" data-remove="${p.id}">✕ Remove</button></td>
    </tr>`;
  }).join("");

  const { subtotal, shipping, total } = cartTotals();
  const subtotalEl = document.getElementById("cartSubtotal");
  const shippingEl = document.getElementById("cartShipping");
  const totalEl = document.getElementById("cartTotal");
  if(subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if(shippingEl) shippingEl.textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  if(totalEl) totalEl.textContent = formatPrice(total);
}

function bindCartPageEvents(){
  const tbody = document.getElementById("cartBody");
  if(!tbody) return;
  tbody.addEventListener("click", e => {
    const decr = e.target.closest("[data-decr]");
    const incr = e.target.closest("[data-incr]");
    const remove = e.target.closest("[data-remove]");
    if(decr){
      const id = Number(decr.dataset.decr);
      const item = getCart().find(i => i.id === id);
      if(item) updateCartQty(id, item.qty - 1 <= 0 ? 1 : item.qty - 1);
    }
    if(incr){
      const id = Number(incr.dataset.incr);
      const item = getCart().find(i => i.id === id);
      if(item) updateCartQty(id, item.qty + 1);
    }
    if(remove){ removeFromCart(Number(remove.dataset.remove)); }
  });
  tbody.addEventListener("change", e => {
    if(e.target.matches("[data-qty]")){
      updateCartQty(Number(e.target.dataset.qty), Number(e.target.value));
    }
  });

  const promoBtn = document.getElementById("promoApply");
  if(promoBtn){
    promoBtn.addEventListener("click", () => {
      const input = document.getElementById("promoInput");
      if(input && input.value.trim().toUpperCase() === "SWATI10"){
        showToast("Promo code applied — 10% off!", "success");
      } else {
        showToast("Invalid or expired promo code", "error");
      }
    });
  }
}

/* ---------- Checkout summary ---------- */
function renderCheckoutSummary(){
  const list = document.getElementById("checkoutItems");
  if(!list) return;
  const cart = getCart();
  if(!cart.length){
    list.innerHTML = `<p style="color:var(--slate-2);font-size:.9rem;">Your cart is empty. <a href="shop.html" style="color:var(--green-dark);font-weight:600;">Go to shop →</a></p>`;
  } else {
    list.innerHTML = cart.map(item => {
      const p = getProductById(item.id);
      if(!p) return "";
      return `<div class="summary-row"><span>${p.name} × ${item.qty}</span><span>${formatPrice(p.price * item.qty)}</span></div>`;
    }).join("");
  }
  const { subtotal, shipping, total } = cartTotals();
  const s = document.getElementById("checkoutSubtotal");
  const sh = document.getElementById("checkoutShipping");
  const t = document.getElementById("checkoutTotal");
  if(s) s.textContent = formatPrice(subtotal);
  if(sh) sh.textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  if(t) t.textContent = formatPrice(total);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartPage();
  bindCartPageEvents();
  renderCheckoutSummary();
});
