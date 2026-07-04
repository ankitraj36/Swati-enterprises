/* ===========================
   APP.JS – Application Bootstrap
   =========================== */
import Storage from './storage.js';
import Products from './products.js';
import Search from './search.js';
import Slider from './slider.js';
import Modal from './modal.js';
import Validation from './validation.js';

/* ── ===== THEME ===== ── */
const initTheme = () => {
  const saved = Storage.getTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      Storage.setTheme(next);
    });
  });
};

/* ── ===== NAVBAR ===== ── */
const initNavbar = () => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  // Scroll effect
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger / Mobile Menu
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');

  const closeMobile = () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };
  const openMobile = () => {
    hamburger?.classList.add('open');
    mobileMenu?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMobile() : openMobile();
  });
  overlay?.addEventListener('click', closeMobile);
  document.getElementById('mobile-menu-close')?.addEventListener('click', closeMobile);

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
};

/* ── ===== SCROLL TO TOP ===== ── */
const initScrollTop = () => {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

/* ── ===== TOAST NOTIFICATIONS ===== ── */
const showToast = (type = 'success', title = '', message = '') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '📢'}</span>
    <div class="toast-body">
      <p class="toast-title">${title}</p>
      ${message ? `<p class="toast-msg">${message}</p>` : ''}
    </div>
    <button style="background:none;border:none;cursor:pointer;color:var(--clr-text-muted);padding:4px" aria-label="Dismiss">✕</button>
  `;

  const dismiss = () => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  };
  toast.querySelector('button').addEventListener('click', dismiss);
  toast.addEventListener('click', dismiss);

  container.appendChild(toast);
  setTimeout(dismiss, 4000);
};

/* ── ===== REVEAL ON SCROLL ===== ── */
const initScrollReveal = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || (i * 80);
        setTimeout(() => entry.target.classList.add('visible'), +delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));

  // Re-observe dynamically added elements
  const mutObs = new MutationObserver(() => {
    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)').forEach(el => observer.observe(el));
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
};

/* ── ===== PAGE LOADER ===== ── */
const initPageLoader = () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // Fallback
  setTimeout(() => loader.classList.add('hidden'), 2000);
};

/* ── ===== COUNTDOWN TIMER ===== ── */
const initCountdown = (targetDate) => {
  const els = {
    h: document.getElementById('countdown-hours'),
    m: document.getElementById('countdown-minutes'),
    s: document.getElementById('countdown-seconds'),
    d: document.getElementById('countdown-days'),
  };
  if (!els.h && !els.m && !els.s) return;

  const tick = () => {
    const now = new Date();
    const end = targetDate || new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = Math.max(0, end - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (els.d) els.d.textContent = String(d).padStart(2, '0');
    els.h.textContent = String(h).padStart(2, '0');
    els.m.textContent = String(m).padStart(2, '0');
    els.s.textContent = String(s).padStart(2, '0');
  };
  tick();
  setInterval(tick, 1000);
};

/* ── ===== FAQ ACCORDION ===== ── */
const initFAQ = () => {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked if was closed
      if (!isOpen) item.classList.add('open');
    });
  });
};

/* ── ===== CATEGORY CHIPS ===== ── */
const initCategoryChips = () => {
  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const slug = chip.dataset.slug;
      if (slug) window.location.href = `shop.html?cat=${slug}`;
    });
  });
};

/* ── ===== STAT COUNTER ANIMATION ===== ── */
const initStatCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const dur = 2000;
        const start = performance.now();
        const update = (now) => {
          const progress = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

/* ── ===== NEWSLETTER ===== ── */
const initNewsletter = () => {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input?.value.trim();
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        showToast('error', 'Invalid Email', 'Please enter a valid email address');
        return;
      }
      showToast('success', '🎉 Subscribed!', 'You are now subscribed to our newsletter');
      input.value = '';
    });
  });
};

/* ── ===== QUICK VIEW ===== ── */
const openQuickView = async (id) => {
  await Modal.open(id);
};

/* ── ===== CHECKOUT STEPS ===== ── */
const initCheckoutSteps = () => {
  const steps = document.querySelectorAll('.checkout-step');
  const panels = document.querySelectorAll('.checkout-panel');
  if (!steps.length) return;

  let current = 0;
  const goTo = (idx) => {
    current = idx;
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
      s.classList.toggle('done', i < idx);
    });
    panels.forEach((p, i) => p.classList.toggle('hidden', i !== idx));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  document.querySelectorAll('.checkout-next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current < steps.length - 1) goTo(current + 1);
    });
  });
  document.querySelectorAll('.checkout-back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current > 0) goTo(current - 1);
    });
  });
  steps.forEach((s, i) => {
    s.addEventListener('click', () => { if (i <= current) goTo(i); });
  });

  // Place order
  document.getElementById('place-order-btn')?.addEventListener('click', () => {
    const cart = Storage.getCart();
    const order = Storage.addOrder({
      items: cart,
      total: Storage.getCartTotal(),
      status: 'confirmed',
    });
    Storage.clearCart();
    Products.updateCartBadge();
    sessionStorage.setItem('last_order', JSON.stringify(order));
    window.location.href = 'success.html';
  });
};

/* ── ===== INIT ===== ── */
const init = async () => {
  initPageLoader();
  initTheme();
  initNavbar();
  initScrollTop();
  initScrollReveal();
  initFAQ();
  initNewsletter();
  initStatCounters();
  initCategoryChips();
  initCheckoutSteps();
  Modal.init();
  Validation.init();

  // Fetch product data
  await Products.fetchData();

  // Update badges
  Products.updateCartBadge();
  Products.updateWishlistBadge();

  // Search
  Search.init();

  // Countdown (deal ends midnight)
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 0);
  initCountdown(midnight);

  // Sliders
  Slider.init();

  // Page-specific init
  const page = window.location.pathname.split('/').pop() || 'index.html';
  await initPage(page);
};

const initPage = async (page) => {
  if (page === 'index.html' || page === '') {
    await initHomePage();
  } else if (page === 'shop.html') {
    const { default: Filters } = await import('./filters.js');
    await Filters.init();
  } else if (page === 'product.html') {
    await initProductPage();
  } else if (page === 'cart.html') {
    const { default: Cart } = await import('./cart.js');
    Cart.init();
  } else if (page === 'wishlist.html') {
    const { default: Wishlist } = await import('./wishlist.js');
    Wishlist.init();
  } else if (page === 'categories.html') {
    await initCategoriesPage();
  } else if (page === 'success.html') {
    initSuccessPage();
  }
};

/* ── HOME PAGE ── */
const initHomePage = async () => {
  // Featured products
  const featuredGrid = document.getElementById('featured-products-grid');
  if (featuredGrid) Products.renderProducts(featuredGrid, Products.getFeatured(8));

  // Best sellers
  const bsGrid = document.getElementById('bestsellers-grid');
  if (bsGrid) Products.renderProducts(bsGrid, Products.getBestSellers().slice(0, 4));

  // Testimonials
  const track = document.getElementById('testimonials-track');
  if (track) {
    const tData = Products.getTestimonials();
    track.innerHTML = tData.map(t => `
      <div class="testimonial-card reveal">
        <p class="testimonial-text">${t.text}</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar-placeholder">${t.initials}</div>
          <div>
            <p class="testimonial-name">${t.name}</p>
            <p class="testimonial-role">${t.role}</p>
          </div>
          <span class="stars" style="margin-left:auto">${'★'.repeat(t.rating)}</span>
        </div>
      </div>
    `).join('');
  }

  // FAQ
  const faqContainer = document.getElementById('faq-container');
  if (faqContainer) {
    const faqs = Products.getFaqs();
    faqContainer.innerHTML = faqs.map(f => `
      <div class="faq-item">
        <div class="faq-question" role="button" tabindex="0" aria-expanded="false">
          <span>${f.q}</span>
          <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="faq-answer"><div class="faq-answer-inner">${f.a}</div></div>
      </div>
    `).join('');
    initFAQ();
  }

  // Category chips
  const catScroll = document.getElementById('category-chips-scroll');
  if (catScroll) {
    const cats = Products.getCategories();
    catScroll.innerHTML = cats.map(c => `
      <button class="cat-chip" data-slug="${c.slug}" aria-label="${c.name}">
        <span class="cat-chip-icon">${c.icon}</span>
        <span class="cat-chip-name">${c.name}</span>
      </button>
    `).join('');
    initCategoryChips();
  }
};

/* ── PRODUCT DETAIL PAGE ── */
const initProductPage = async () => {
  const params = new URLSearchParams(window.location.search);
  const id = +params.get('id') || 1;
  const product = Products.getById(id);
  if (!product) { window.location.href = '404.html'; return; }

  Storage.addViewed(product);

  // Populate page
  const setEl = (selector, val, attr = 'textContent') => {
    const el = document.querySelector(selector);
    if (el) el[attr] = val;
  };
  setEl('#product-brand', product.brand);
  setEl('#product-title', product.name);
  setEl('#product-price', `₹${product.price}`);
  setEl('#product-mrp', product.mrp > product.price ? `₹${product.mrp}` : '');
  setEl('#product-discount', product.discount ? `${product.discount}% OFF` : '');
  setEl('#product-rating-stars', Products.renderStars(product.rating), 'innerHTML');
  setEl('#product-rating-count', `(${product.reviews.toLocaleString()} reviews)`);
  setEl('#product-description', product.description);
  setEl('#product-stock', product.inStock ? 'In Stock' : 'Out of Stock');
  setEl('#product-category', product.category);

  const mainImg = document.getElementById('gallery-main-img');
  if (mainImg) { mainImg.src = product.image; mainImg.alt = product.name; }

  document.title = `${product.name} – Swati Enterprises`;

  // Breadcrumb
  const breadcrumb = document.getElementById('product-breadcrumb');
  if (breadcrumb) breadcrumb.textContent = product.name;

  // Add to cart
  const addCartBtn = document.getElementById('add-to-cart-btn');
  addCartBtn?.addEventListener('click', () => {
    const qty = +document.getElementById('qty-val')?.textContent || 1;
    for (let i = 0; i < qty; i++) Storage.addToCart(product);
    Products.updateCartBadge();
    showToast('success', '🛒 Added to Cart!', product.name);
    addCartBtn.textContent = '✓ Added to Cart';
    setTimeout(() => addCartBtn.textContent = 'Add to Cart', 2000);
  });

  // Wishlist
  const wishBtn = document.getElementById('add-to-wishlist-btn');
  wishBtn?.addEventListener('click', () => {
    Storage.toggleWishlist(product);
    const isNow = Storage.isInWishlist(product.id);
    wishBtn.textContent = isNow ? '❤️ In Wishlist' : '🤍 Add to Wishlist';
    Products.updateWishlistBadge();
    showToast(isNow ? 'success' : 'info', isNow ? '❤️ Added!' : 'Removed', product.name);
  });
  if (wishBtn && Storage.isInWishlist(product.id)) wishBtn.textContent = '❤️ In Wishlist';

  // Qty
  const qtyVal = document.getElementById('qty-val');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    const cur = +qtyVal.textContent;
    if (cur > 1) qtyVal.textContent = cur - 1;
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    const cur = +qtyVal.textContent;
    if (cur < 99) qtyVal.textContent = cur + 1;
  });

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
    });
  });

  // Related products
  const relatedGrid = document.getElementById('related-products-grid');
  if (relatedGrid) Products.renderProducts(relatedGrid, Products.getRelated(product, 4));
};

/* ── CATEGORIES PAGE ── */
const initCategoriesPage = async () => {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  const cats = Products.getCategories();
  grid.innerHTML = cats.map(c => `
    <a href="shop.html?cat=${c.slug}" class="category-card reveal" style="text-decoration:none" aria-label="${c.name}">
      <div style="width:100%;height:100%;background:linear-gradient(135deg,${c.color}22,${c.color}44);border-radius:var(--radius-2xl);border:2px solid ${c.color}33;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-8);transition:var(--transition)">
        <span style="font-size:3rem;margin-bottom:var(--space-4)">${c.icon}</span>
        <h3 style="font-size:var(--text-base);font-weight:700;color:var(--clr-text);margin-bottom:var(--space-2)">${c.name}</h3>
        <p style="font-size:var(--text-xs);color:var(--clr-text-muted)">${c.count}+ products</p>
      </div>
    </a>
  `).join('');
};

/* ── SUCCESS PAGE ── */
const initSuccessPage = () => {
  const order = JSON.parse(sessionStorage.getItem('last_order') || '{}');
  const el = document.getElementById('order-id');
  if (el && order.id) el.textContent = '#SE' + String(order.id).slice(-6);
  const total = document.getElementById('order-total');
  if (total && order.total) total.textContent = `₹${order.total.toLocaleString()}`;
  const date = document.getElementById('order-date');
  if (date) date.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  // Cleanup
  sessionStorage.removeItem('last_order');
};

// Expose globals
window.App = { showToast, openQuickView };

// Boot
document.addEventListener('DOMContentLoaded', init);
