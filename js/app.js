/* ===========================================================
   APP — shared site behavior across all pages
   =========================================================== */

/* ---------- Page loader ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if(loader){
    setTimeout(() => loader.classList.add("hide"), 350);
  }
});

/* ---------- Sticky navbar shadow ---------- */
const navbarEl = document.querySelector(".navbar");
if(navbarEl){
  window.addEventListener("scroll", () => {
    navbarEl.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });
}

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if(navToggle && navLinks){
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", navLinks.classList.contains("open"));
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
  }));
}

/* ---------- Theme toggle (dark / light) ---------- */
const THEME_KEY = "swati_theme";
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}
(function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);
})();
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  if(toggle){
    toggle.addEventListener("click", () => {
      const current = localStorage.getItem(THEME_KEY) || "light";
      applyTheme(current === "light" ? "dark" : "light");
    });
  }
});

/* ---------- Scroll to top ---------- */
const scrollTopBtn = document.getElementById("scrollTopBtn");
if(scrollTopBtn){
  window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Toast notifications ---------- */
function showToast(message, type = "info"){
  let stack = document.getElementById("toastStack");
  if(!stack){
    stack = document.createElement("div");
    stack.id = "toastStack";
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  toast.innerHTML = `<span>${icons[type] || "ℹ"}</span><span>${message}</span>`;
  stack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(30px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");
if("IntersectionObserver" in window && revealEls.length){
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("in"));
}

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-item").forEach(item => {
  const q = item.querySelector(".faq-q");
  if(!q) return;
  q.addEventListener("click", () => {
    const wasOpen = item.classList.contains("open");
    item.parentElement.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
    if(!wasOpen) item.classList.add("open");
  });
});

/* ---------- Newsletter form ---------- */
const newsletterForm = document.getElementById("newsletterForm");
if(newsletterForm){
  newsletterForm.addEventListener("submit", e => {
    e.preventDefault();
    const input = newsletterForm.querySelector("input[type='email']");
    if(input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)){
      showToast("Thanks for subscribing! Check your inbox soon.", "success");
      newsletterForm.reset();
    } else {
      showToast("Please enter a valid email address", "error");
    }
  });
}

/* ---------- Best sellers slider ---------- */
function bindSlider(trackId, prevId, nextId){
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if(!track) return;
  const scrollAmt = () => track.clientWidth * 0.8;
  if(prev) prev.addEventListener("click", () => track.scrollBy({ left: -scrollAmt(), behavior: "smooth" }));
  if(next) next.addEventListener("click", () => track.scrollBy({ left: scrollAmt(), behavior: "smooth" }));
}

/* ---------- Quick View Modal ---------- */
function openQuickView(id){
  const p = getProductById(id);
  if(!p) return;
  const overlay = document.getElementById("quickViewOverlay");
  const body = document.getElementById("quickViewBody");
  if(!overlay || !body) return;
  const stockClass = p.stock === "in" ? "in" : p.stock === "low" ? "low" : "out";
  body.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-media">${productIconSVG(p.icon)}</div>
      <div class="quickview-body">
        <span class="product-cat">${p.category}</span>
        <h2 style="margin:8px 0;">${p.name}</h2>
        <div class="product-rating" style="margin-bottom:10px;"><span class="stars">${starRow(p.rating)}</span> ${p.rating} (${p.reviews} reviews)</div>
        <div class="pd-price-row" style="margin:12px 0;">
          <span class="price-now">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
        </div>
        <p style="color:var(--slate-2);font-size:.92rem;margin-bottom:14px;">${p.desc}</p>
        <span class="stock-status ${stockClass}">${p.stockLabel}</span>
        <div class="pd-actions">
          <button class="btn btn-primary" data-add="${p.id}" ${p.stock==='out'?'disabled':''}>Add to Cart</button>
          <a class="btn btn-outline" href="product.html?id=${p.id}">View Full Details</a>
        </div>
      </div>
    </div>`;
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeQuickView(){
  const overlay = document.getElementById("quickViewOverlay");
  if(overlay){ overlay.classList.remove("show"); document.body.style.overflow = ""; }
}
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("quickViewOverlay");
  const closeBtn = document.getElementById("quickViewClose");
  if(closeBtn) closeBtn.addEventListener("click", closeQuickView);
  if(overlay) overlay.addEventListener("click", e => { if(e.target === overlay) closeQuickView(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape") closeQuickView(); });
});

/* ---------- Global delegated events: add-to-cart / wishlist / quickview ---------- */
document.addEventListener("click", e => {
  const addBtn = e.target.closest("[data-add]");
  const wishBtn = e.target.closest("[data-wish]");
  const qvBtn = e.target.closest("[data-quickview]");

  if(addBtn){ addToCart(Number(addBtn.dataset.add)); }
  if(wishBtn){
    const active = toggleWishlist(Number(wishBtn.dataset.wish));
    wishBtn.classList.toggle("active", active);
    wishBtn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
  }
  if(qvBtn){ openQuickView(Number(qvBtn.dataset.quickview)); }
});

/* ---------- Form validation helpers ---------- */
function validateField(input){
  const group = input.closest(".form-group");
  if(!group) return true;
  let valid = true;
  if(input.hasAttribute("required") && !input.value.trim()) valid = false;
  if(input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) valid = false;
  if(input.type === "tel" && input.value && !/^[0-9+\-\s]{7,15}$/.test(input.value)) valid = false;
  if(input.dataset.match){
    const other = document.getElementById(input.dataset.match);
    if(other && input.value !== other.value) valid = false;
  }
  group.classList.toggle("error", !valid);
  return valid;
}
function bindLiveValidation(form){
  if(!form) return;
  form.querySelectorAll("input, select, textarea").forEach(input => {
    input.addEventListener("blur", () => validateField(input));
  });
}
function validateForm(form){
  let allValid = true;
  form.querySelectorAll("input, select, textarea").forEach(input => {
    if(!validateField(input)) allValid = false;
  });
  return allValid;
}

/* ---------- Password strength (register page) ---------- */
const pwInput = document.getElementById("regPassword");
if(pwInput){
  const bar = document.querySelector(".strength-bar i");
  pwInput.addEventListener("input", () => {
    let score = 0;
    if(pwInput.value.length >= 6) score++;
    if(/[A-Z]/.test(pwInput.value)) score++;
    if(/[0-9]/.test(pwInput.value)) score++;
    if(/[^A-Za-z0-9]/.test(pwInput.value)) score++;
    const pct = (score / 4) * 100;
    const colors = ["#EF5350", "#EF5350", "#F5A623", "#0F9D58", "#0F9D58"];
    if(bar){ bar.style.width = pct + "%"; bar.style.background = colors[score]; }
  });
}

/* ---------- Generic auth / contact / checkout form submit demo ---------- */
function bindDemoForm(formId, successMsg, redirect){
  const form = document.getElementById(formId);
  if(!form) return;
  bindLiveValidation(form);
  form.addEventListener("submit", e => {
    e.preventDefault();
    if(!validateForm(form)){
      showToast("Please fix the highlighted fields", "error");
      return;
    }
    showToast(successMsg, "success");
    if(redirect){ setTimeout(() => window.location.href = redirect, 900); }
    else { form.reset(); }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindDemoForm("loginForm", "Welcome back! Login successful.", "index.html");
  bindDemoForm("registerForm", "Account created successfully!", "index.html");
  bindDemoForm("contactForm", "Message sent — our team will reach out shortly.");
  bindDemoForm("checkoutForm", "Order placed successfully! Thank you for shopping with us.", "index.html");
});
