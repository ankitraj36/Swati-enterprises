/* ===========================================================
   APP — shared site behavior across all pages
   Scroll progress, sticky nav, theme, toasts, reveals,
   FAQ, countdown, recently viewed, lazy loading
   =========================================================== */

/* ---------- Page loader ---------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  if (loader) setTimeout(() => loader.classList.add("hide"), 350);
});

/* ---------- Scroll progress bar ---------- */
(function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const winH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = winH > 0 ? ((window.scrollY / winH) * 100) + "%" : "0%";
  }, { passive: true });
})();

/* ---------- Sticky navbar shrink ---------- */
const navbarEl = document.querySelector(".navbar");
if (navbarEl) {
  window.addEventListener("scroll", () => {
    navbarEl.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });
}

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
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
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);
})();
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = localStorage.getItem(THEME_KEY) || "light";
      applyTheme(current === "light" ? "dark" : "light");
    });
  }
});

/* ---------- Scroll to top ---------- */
const scrollTopBtn = document.getElementById("scrollTopBtn");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("show", window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Toast notifications ---------- */
function showToast(message, type = "info") {
  let stack = document.getElementById("toastStack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "toastStack";
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  toast.innerHTML = `<span>${icons[type] || "ℹ"}</span><span>${message}</span>`;
  toast.setAttribute("role", "alert");
  stack.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(30px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ---------- Reveal on scroll (Intersection Observer) ---------- */
function initRevealObserver() {
  const revealEls = document.querySelectorAll(".reveal:not(.in)");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }
}
document.addEventListener("DOMContentLoaded", initRevealObserver);
/* Re-init after dynamic content */
function refreshReveals() { setTimeout(initRevealObserver, 100); }

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-item").forEach(item => {
  const q = item.querySelector(".faq-q");
  if (!q) return;
  q.addEventListener("click", () => {
    const wasOpen = item.classList.contains("open");
    item.parentElement.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
  });
});

/* ---------- Newsletter form ---------- */
const newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", e => {
    e.preventDefault();
    const input = newsletterForm.querySelector("input[type='email']");
    if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      showToast("Thanks for subscribing! Check your inbox soon.", "success");
      newsletterForm.reset();
    } else {
      showToast("Please enter a valid email address", "error");
    }
  });
}

/* ---------- Countdown timer (Flash Sale) ---------- */
function initCountdown(endTime) {
  const els = {
    hours: document.getElementById("cdHours"),
    mins: document.getElementById("cdMins"),
    secs: document.getElementById("cdSecs")
  };
  if (!els.hours) return;

  function update() {
    const now = Date.now();
    let diff = Math.max(0, endTime - now);
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);
    els.hours.textContent = String(h).padStart(2, '0');
    els.mins.textContent = String(m).padStart(2, '0');
    els.secs.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ---------- Global delegated events: add-to-cart / wishlist / quickview ---------- */
document.addEventListener("click", e => {
  const addBtn = e.target.closest("[data-add]");
  const wishBtn = e.target.closest("[data-wish]");
  const qvBtn = e.target.closest("[data-quickview]");

  if (addBtn) addToCart(Number(addBtn.dataset.add));
  if (wishBtn) {
    const active = toggleWishlist(Number(wishBtn.dataset.wish));
    wishBtn.classList.toggle("active", active);
    const svg = wishBtn.querySelector("svg");
    if (svg) svg.setAttribute("fill", active ? "currentColor" : "none");
  }
  if (qvBtn) openQuickView(Number(qvBtn.dataset.quickview));
});

/* ---------- Product detail tabs ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".pd-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tab.closest(".pd-tabs")?.querySelectorAll(".pd-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      document.querySelectorAll(".pd-tab-panel").forEach(p => p.classList.remove("active"));
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
    });
  });
});

/* ---------- Lazy loading images (IntersectionObserver) ---------- */
function initLazyLoad() {
  const imgs = document.querySelectorAll("img[data-src]");
  if (!imgs.length) return;
  if ("IntersectionObserver" in window) {
    const imgObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          img.classList.add("loaded");
          imgObs.unobserve(img);
        }
      });
    }, { rootMargin: "200px" });
    imgs.forEach(img => imgObs.observe(img));
  } else {
    imgs.forEach(img => { img.src = img.dataset.src; img.classList.add("loaded"); });
  }
}
document.addEventListener("DOMContentLoaded", initLazyLoad);

/* ---------- Recently viewed section ---------- */
function renderRecentlyViewed(containerId) {
  const container = document.getElementById(containerId);
  if (!container || typeof StorageManager === "undefined") return;

  const viewed = StorageManager.getRecentlyViewed();
  const products = viewed.map(id => getProductById(id)).filter(Boolean).slice(0, 6);
  if (!products.length) { container.closest("section")?.remove(); return; }

  container.innerHTML = products.map(productCardHTML).join("");
}

/* ---------- Instagram gallery (placeholder SVGs) ---------- */
function renderInstaGallery(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const colors = ["var(--mint-50)", "var(--sky-50)", "var(--mint-100)", "var(--sky-100)", "var(--mint-50)", "var(--sky-50)"];
  const icons = ["capsule", "bottle", "jar", "device", "dropper", "tube"];
  el.innerHTML = icons.map((icon, i) =>
    `<div class="insta-item" style="background:${colors[i]};">${productIconSVG(icon)}</div>`
  ).join("");
}

/* ---------- Init forms on pages ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof bindDemoForm === "function") {
    bindDemoForm("loginForm", "Welcome back! Login successful.", "index.html");
    bindDemoForm("registerForm", "Account created successfully!", "index.html");
    bindDemoForm("contactForm", "Message sent — our team will reach out shortly.");
    bindDemoForm("checkoutForm", "Order placed successfully!", "success.html");
  }

  /* Password strength */
  if (typeof initPasswordStrength === "function") {
    initPasswordStrength("regPassword", ".strength-bar i", ".strength-label");
  }

  /* Password toggles */
  if (typeof initPasswordToggle === "function") {
    initPasswordToggle("loginPassword", "#loginPwToggle");
    initPasswordToggle("regPassword", "#regPwToggle");
  }
});

/* ---------- Confetti (success page) ---------- */
function fireConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;
  const colors = ["#0F9D58", "#1976D2", "#4FC3F7", "#F59E0B", "#EF4444", "#22C55E"];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + "s";
    piece.style.animationDuration = 2 + Math.random() * 2 + "s";
    piece.style.width = 6 + Math.random() * 8 + "px";
    piece.style.height = 6 + Math.random() * 8 + "px";
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    container.appendChild(piece);
  }
  setTimeout(() => container.remove(), 5000);
}
