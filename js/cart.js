/* ===========================
   CART.JS – Shopping Cart Logic
   =========================== */
import Storage from './storage.js';
import Products from './products.js';

const Cart = (() => {
  const render = () => {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const cartContent = document.getElementById('cart-content');
    if (!cartContainer) return;

    const cart = Storage.getCart();

    if (cart.length === 0) {
      emptyState?.classList.remove('hidden');
      cartContent?.classList.add('hidden');
    } else {
      emptyState?.classList.add('hidden');
      cartContent?.classList.remove('hidden');
      cartContainer.innerHTML = cart.map(itemHTML).join('');
      bindCartEvents();
    }
    updateSummary(cart);
  };

  const itemHTML = (item) => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-product">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='images/products/placeholder.png'">
        <div>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-brand">${item.brand}</p>
        </div>
      </div>
      <div class="cart-item-price">₹${item.price}</div>
      <div>
        <div class="qty-control">
          <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-val" id="qty-${item.id}">${item.qty}</span>
          <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-item-total">₹${(item.price * item.qty).toLocaleString()}</div>
      <button class="cart-remove-btn" data-id="${item.id}" aria-label="Remove item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>
    </div>
  `;

  const bindCartEvents = () => {
    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        const item = Storage.getCart().find(i => i.id === id);
        if (!item) return;
        if (item.qty <= 1) {
          if (confirm('Remove this item from cart?')) {
            Storage.removeFromCart(id);
            render();
            Products.updateCartBadge();
          }
        } else {
          Storage.updateCartQty(id, item.qty - 1);
          document.getElementById(`qty-${id}`).textContent = item.qty - 1;
          updateSummary(Storage.getCart());
          Products.updateCartBadge();
        }
      });
    });

    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        const item = Storage.getCart().find(i => i.id === id);
        if (!item) return;
        Storage.updateCartQty(id, item.qty + 1);
        document.getElementById(`qty-${id}`).textContent = item.qty + 1;
        updateSummary(Storage.getCart());
        Products.updateCartBadge();
      });
    });

    document.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.id;
        const row = btn.closest('.cart-item');
        row.style.opacity = '0';
        row.style.transform = 'translateX(30px)';
        row.style.transition = 'all 0.3s ease';
        setTimeout(() => {
          Storage.removeFromCart(id);
          render();
          Products.updateCartBadge();
          window.App?.showToast('info', 'Item Removed', 'Item removed from cart');
        }, 300);
      });
    });
  };

  const updateSummary = (cart) => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const mrpTotal = cart.reduce((s, i) => s + (i.mrp || i.price) * i.qty, 0);
    const discount = mrpTotal - subtotal;
    const shipping = subtotal >= 499 ? 0 : 49;
    const total = subtotal + shipping;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('summary-subtotal', `₹${subtotal.toLocaleString()}`);
    set('summary-discount', discount > 0 ? `−₹${discount.toLocaleString()}` : '₹0');
    set('summary-shipping', shipping === 0 ? 'FREE' : `₹${shipping}`);
    set('summary-total', `₹${total.toLocaleString()}`);
    set('summary-items', `${cart.reduce((s,i) => s+i.qty, 0)} items`);
  };

  const applyCoupon = () => {
    const input = document.getElementById('coupon-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();
    const codes = { 'SWATI10': 10, 'HEALTH15': 15, 'SAVE20': 20, 'FIRST25': 25 };
    if (codes[code]) {
      window.App?.showToast('success', `🎉 Coupon Applied!`, `${codes[code]}% discount added`);
      document.getElementById('coupon-discount-row')?.classList.remove('hidden');
      const subtotal = Storage.getCartTotal();
      const couponDiscount = Math.round(subtotal * codes[code] / 100);
      document.getElementById('coupon-discount-val').textContent = `−₹${couponDiscount}`;
    } else {
      window.App?.showToast('error', 'Invalid Coupon', 'This coupon code is not valid');
    }
  };

  const init = () => {
    render();
    document.getElementById('apply-coupon-btn')?.addEventListener('click', applyCoupon);
    document.getElementById('coupon-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applyCoupon();
    });
    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
      if (confirm('Clear all items from cart?')) {
        Storage.clearCart();
        render();
        Products.updateCartBadge();
        window.App?.showToast('info', 'Cart Cleared', 'All items removed from cart');
      }
    });
  };

  return { init, render, updateSummary };
})();

export default Cart;
