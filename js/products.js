/* ===========================================================
   PRODUCTS — data + rendering helpers
   (Data embedded directly so the site works when opened
   straight from disk, without a local server for fetch().)
   =========================================================== */

const PRODUCTS = [
  { id: 1, name: "PainAway Rapid Relief Tablets", category: "Pain Relief", price: 149, oldPrice: 199, rating: 4.6, reviews: 214, stock: "in", stockLabel: "In Stock", badge: "-25%", icon: "capsule", desc: "Fast-acting relief from headaches, body ache, and mild fever. Non-drowsy formula suitable for daily use as directed.", bestSeller: true, featured: true },
  { id: 2, name: "FlexoJoint Muscle Gel", category: "Pain Relief", price: 220, oldPrice: 260, rating: 4.4, reviews: 132, stock: "in", stockLabel: "In Stock", badge: "-15%", icon: "tube", desc: "Soothing topical gel for joint and muscle pain, with a cooling effect that absorbs quickly without greasy residue.", bestSeller: false, featured: true },
  { id: 3, name: "ColdShield Cough Syrup", category: "Cold & Flu", price: 95, oldPrice: 120, rating: 4.5, reviews: 189, stock: "in", stockLabel: "In Stock", badge: "-20%", icon: "bottle", desc: "A gentle syrup that eases cough, throat irritation, and nasal congestion for the whole family.", bestSeller: true, featured: true },
  { id: 4, name: "FluCare Combo Tablets", category: "Cold & Flu", price: 130, oldPrice: 150, rating: 4.3, reviews: 97, stock: "low", stockLabel: "Only 4 left", badge: "", icon: "capsule", desc: "Combination formula targeting fever, body ache, and congestion associated with common flu.", bestSeller: false, featured: false },
  { id: 5, name: "VitaBoost Multivitamin", category: "Vitamins", price: 349, oldPrice: 449, rating: 4.8, reviews: 341, stock: "in", stockLabel: "In Stock", badge: "-22%", icon: "jar", desc: "Daily multivitamin with 24 essential nutrients to support energy, immunity, and overall wellness.", bestSeller: true, featured: true },
  { id: 6, name: "Vitamin D3 Sunshine Drops", category: "Vitamins", price: 210, oldPrice: 250, rating: 4.7, reviews: 176, stock: "in", stockLabel: "In Stock", badge: "-16%", icon: "dropper", desc: "Concentrated D3 drops to support bone health and immunity, ideal for the whole family.", bestSeller: false, featured: true },
  { id: 7, name: "GlucoBalance Care Tablets", category: "Diabetes Care", price: 410, oldPrice: 480, rating: 4.5, reviews: 88, stock: "in", stockLabel: "In Stock", badge: "-15%", icon: "capsule", desc: "Supports healthy blood sugar levels as part of a balanced diabetes management routine.", bestSeller: false, featured: true },
  { id: 8, name: "SugarCheck Glucometer Kit", category: "Diabetes Care", price: 899, oldPrice: 1099, rating: 4.6, reviews: 152, stock: "in", stockLabel: "In Stock", badge: "-18%", icon: "device", desc: "Accurate, easy-to-use glucometer kit with 25 test strips and lancets included.", bestSeller: true, featured: true },
  { id: 9, name: "CardioPlus Omega-3 Softgels", category: "Heart Care", price: 380, oldPrice: 430, rating: 4.7, reviews: 203, stock: "in", stockLabel: "In Stock", badge: "-12%", icon: "capsule", desc: "High-purity fish oil softgels supporting healthy cholesterol levels and heart function.", bestSeller: true, featured: true },
  { id: 10, name: "PressureEase BP Monitor", category: "Heart Care", price: 1450, oldPrice: 1700, rating: 4.8, reviews: 264, stock: "low", stockLabel: "Only 3 left", badge: "-15%", icon: "device", desc: "Clinically validated digital blood pressure monitor with irregular heartbeat detection.", bestSeller: false, featured: false },
  { id: 11, name: "DermaPure Gentle Face Wash", category: "Skin Care", price: 175, oldPrice: 210, rating: 4.4, reviews: 118, stock: "in", stockLabel: "In Stock", badge: "-17%", icon: "bottle", desc: "Dermatologist-tested gentle cleanser suitable for sensitive and acne-prone skin.", bestSeller: false, featured: true },
  { id: 12, name: "SoftGlow Moisturizing Cream", category: "Skin Care", price: 260, oldPrice: 310, rating: 4.6, reviews: 145, stock: "in", stockLabel: "In Stock", badge: "-16%", icon: "jar", desc: "24-hour hydration cream with ceramides to strengthen and soothe dry skin.", bestSeller: true, featured: false },
  { id: 13, name: "LittleSteps Baby Lotion", category: "Baby Care", price: 199, oldPrice: 230, rating: 4.7, reviews: 231, stock: "in", stockLabel: "In Stock", badge: "-13%", icon: "bottle", desc: "Mild, tear-free lotion formulated for delicate newborn and infant skin.", bestSeller: true, featured: true },
  { id: 14, name: "GentleCare Diaper Rash Cream", category: "Baby Care", price: 165, oldPrice: 190, rating: 4.5, reviews: 97, stock: "in", stockLabel: "In Stock", badge: "-13%", icon: "jar", desc: "Soothing barrier cream that helps protect and heal delicate baby skin.", bestSeller: false, featured: false },
  { id: 15, name: "FreshDay Hand Sanitizer", category: "Personal Care", price: 85, oldPrice: 100, rating: 4.3, reviews: 302, stock: "in", stockLabel: "In Stock", badge: "-15%", icon: "bottle", desc: "70% alcohol-based sanitizer that kills 99.9% of germs while keeping hands soft.", bestSeller: true, featured: false },
  { id: 16, name: "OralFresh Antiseptic Mouthwash", category: "Personal Care", price: 120, oldPrice: 145, rating: 4.4, reviews: 168, stock: "in", stockLabel: "In Stock", badge: "-17%", icon: "bottle", desc: "Alcohol-free mouthwash that fights plaque and freshens breath for up to 12 hours.", bestSeller: false, featured: false },
  { id: 17, name: "ComfortFlex Knee Support", category: "Medical Equipment", price: 450, oldPrice: 550, rating: 4.5, reviews: 76, stock: "in", stockLabel: "In Stock", badge: "-18%", icon: "device", desc: "Breathable compression knee support for pain relief during daily activity.", bestSeller: false, featured: false },
  { id: 18, name: "PulseOx Fingertip Oximeter", category: "Medical Equipment", price: 799, oldPrice: 950, rating: 4.7, reviews: 289, stock: "in", stockLabel: "In Stock", badge: "-16%", icon: "device", desc: "Fast, accurate SpO2 and pulse rate readings with a bright digital display.", bestSeller: true, featured: true },
  { id: 19, name: "N95 ProShield Face Masks (Pack of 10)", category: "Medical Equipment", price: 299, oldPrice: 350, rating: 4.6, reviews: 412, stock: "in", stockLabel: "In Stock", badge: "-15%", icon: "device", desc: "5-layer protective face masks offering a secure, breathable fit for everyday use.", bestSeller: true, featured: false },
  { id: 20, name: "ImmunoGuard Vitamin C Chewables", category: "Vitamins", price: 240, oldPrice: 280, rating: 4.6, reviews: 198, stock: "out", stockLabel: "Out of Stock", badge: "", icon: "jar", desc: "Tangy orange-flavoured chewable tablets to support daily immune health.", bestSeller: false, featured: true }
];

const CATEGORY_ICONS = {
  "Pain Relief": "pill", "Cold & Flu": "flu", "Vitamins": "leaf", "Diabetes Care": "drop",
  "Heart Care": "heart", "Skin Care": "sparkle", "Baby Care": "baby", "Personal Care": "shield",
  "Medical Equipment": "device"
};

function getProductById(id){ return PRODUCTS.find(p => p.id === Number(id)); }
function getProductsByCategory(cat){ return PRODUCTS.filter(p => p.category === cat); }
function formatPrice(n){ return "₹" + Number(n).toLocaleString("en-IN"); }

/* ---------- SVG icon library (medical themed, inline, no external assets) ---------- */
function productIconSVG(type){
  const icons = {
    capsule: `<svg viewBox="0 0 100 100" fill="none"><rect x="20" y="38" width="60" height="24" rx="12" fill="var(--green)" opacity=".18"/><path d="M30 62 L70 38" stroke="var(--green-dark)" stroke-width="0"/><g><rect x="18" y="40" width="30" height="20" rx="10" fill="var(--blue)"/><rect x="48" y="40" width="30" height="20" rx="10" fill="var(--green)"/></g></svg>`,
    tube: `<svg viewBox="0 0 100 100" fill="none"><rect x="30" y="20" width="40" height="60" rx="10" fill="var(--green)" opacity=".85"/><rect x="38" y="12" width="24" height="14" rx="4" fill="var(--blue)"/><rect x="34" y="55" width="32" height="6" rx="3" fill="#fff" opacity=".6"/><rect x="34" y="65" width="24" height="5" rx="2.5" fill="#fff" opacity=".4"/></svg>`,
    bottle: `<svg viewBox="0 0 100 100" fill="none"><rect x="32" y="10" width="16" height="12" rx="2" fill="var(--blue-dark)"/><path d="M28 24 h24 a6 6 0 0 1 6 6 v50 a6 6 0 0 1 -6 6 h-24 a6 6 0 0 1 -6 -6 v-50 a6 6 0 0 1 6 -6 z" fill="var(--blue)"/><rect x="24" y="45" width="32" height="26" rx="4" fill="#fff" opacity=".85"/><path d="M40 51 v14 M33 58 h14" stroke="var(--green)" stroke-width="4" stroke-linecap="round"/></svg>`,
    jar: `<svg viewBox="0 0 100 100" fill="none"><rect x="28" y="30" width="44" height="46" rx="10" fill="var(--green)"/><rect x="24" y="20" width="52" height="14" rx="6" fill="var(--green-dark)"/><circle cx="50" cy="53" r="12" fill="#fff" opacity=".9"/><path d="M50 47 v12 M44 53 h12" stroke="var(--blue)" stroke-width="3.5" stroke-linecap="round"/></svg>`,
    dropper: `<svg viewBox="0 0 100 100" fill="none"><rect x="42" y="14" width="16" height="30" rx="6" fill="var(--blue)"/><path d="M42 44 h16 l-6 34 a4 4 0 0 1 -4 0 z" fill="var(--green)"/><rect x="38" y="10" width="24" height="8" rx="3" fill="var(--blue-dark)"/></svg>`,
    device: `<svg viewBox="0 0 100 100" fill="none"><rect x="18" y="26" width="64" height="48" rx="10" fill="var(--blue)"/><rect x="26" y="34" width="48" height="22" rx="4" fill="#fff" opacity=".9"/><path d="M30 45 h8 l4 -8 6 16 5 -12 4 4 h11" stroke="var(--green)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="65" r="4" fill="#fff"/><circle cx="50" cy="65" r="4" fill="#fff" opacity=".6"/><circle cx="66" cy="65" r="4" fill="#fff" opacity=".6"/></svg>`
  };
  return icons[type] || icons.capsule;
}

function categoryIconSVG(type){
  const s = `stroke="var(--green-dark)" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const icons = {
    pill: `<svg viewBox="0 0 48 48"><rect x="8" y="19" width="32" height="12" rx="6" ${s}/><path d="M24 19 V31" ${s}/></svg>`,
    flu: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="14" ${s}/><path d="M24 14 v6 M24 28 v6 M14 24 h6 M28 24 h6" ${s}/></svg>`,
    leaf: `<svg viewBox="0 0 48 48"><path d="M14 34 C10 20 20 10 36 10 C36 26 26 36 14 34 Z" ${s}/><path d="M16 32 L32 12" ${s}/></svg>`,
    drop: `<svg viewBox="0 0 48 48"><path d="M24 8 C30 20 36 26 36 32 a12 12 0 0 1 -24 0 C12 26 18 20 24 8 Z" ${s}/></svg>`,
    heart: `<svg viewBox="0 0 48 48"><path d="M24 38 C10 28 6 20 10 14 a9 9 0 0 1 14 -1 a9 9 0 0 1 14 1 c4 6 0 14 -14 24 Z" ${s}/><path d="M14 24 h6 l3 -6 4 10 3 -6 h6" ${s}/></svg>`,
    sparkle: `<svg viewBox="0 0 48 48"><path d="M24 8 L27 20 L39 24 L27 28 L24 40 L21 28 L9 24 L21 20 Z" ${s}/></svg>`,
    baby: `<svg viewBox="0 0 48 48"><circle cx="24" cy="18" r="9" ${s}/><path d="M11 40 C11 28 37 28 37 40" ${s}/></svg>`,
    shield: `<svg viewBox="0 0 48 48"><path d="M24 6 L38 12 V22 C38 32 32 38 24 42 C16 38 10 32 10 22 V12 Z" ${s}/><path d="M18 23 l4 4 8 -9" ${s}/></svg>`,
    device: `<svg viewBox="0 0 48 48"><rect x="8" y="14" width="32" height="22" rx="4" ${s}/><path d="M13 25 h5 l3 -6 4 12 3 -9 3 3 h4" ${s}/></svg>`
  };
  return icons[type] || icons.pill;
}

function starRow(rating){
  const full = Math.round(rating);
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

/* ---------- Card builders ---------- */
function productCardHTML(p){
  const wished = isWishlisted(p.id);
  const stockClass = p.stock === "in" ? "in" : p.stock === "low" ? "low" : "out";
  return `
  <article class="product-card reveal in" data-id="${p.id}" data-category="${p.category}">
    ${p.badge ? `<span class="badge">${p.badge}</span>` : (p.stock==='low' ? `<span class="badge stock-low">Low Stock</span>` : '')}
    <button class="wish-btn ${wished ? 'active' : ''}" aria-label="Toggle wishlist" data-wish="${p.id}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${wished?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C0.3 7.9 2.6 4 6.4 4c2 0 3.6 1 5.6 3 2-2 3.6-3 5.6-3 3.8 0 6.1 3.9 4.4 7.7C19.5 16.4 12 21 12 21z"/></svg>
    </button>
    <a href="product.html?id=${p.id}" class="product-media">${productIconSVG(p.icon)}</a>
    <div class="product-info">
      <span class="product-cat">${p.category}</span>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="product-rating"><span class="stars">${starRow(p.rating)}</span> ${p.rating} (${p.reviews})</div>
      <div class="product-price">
        <span class="price-now">${formatPrice(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
      </div>
      <span class="stock-status ${stockClass}">${p.stockLabel}</span>
      <div class="product-actions">
        <button class="btn btn-primary btn-sm" data-add="${p.id}" ${p.stock==='out'?'disabled':''}>Add to Cart</button>
        <button class="btn btn-ghost btn-sm" data-quickview="${p.id}">Quick View</button>
      </div>
    </div>
  </article>`;
}

function renderGrid(el, list, emptyMsg = "No products found. Try a different search or filter."){
  if(!el) return;
  if(!list.length){
    el.innerHTML = `<div class="no-results">${emptyMsg}</div>`;
    return;
  }
  el.innerHTML = list.map(productCardHTML).join('');
}

/* ---------- Shared logo mark ---------- */
function logoSVG(size = 44){
  return `<svg class="logo-mark" width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0F9D58"/>
        <stop offset="100%" stop-color="#1976D2"/>
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="29" fill="none" stroke="url(#logoGrad)" stroke-width="2.4" stroke-dasharray="4 6"/>
    <circle cx="32" cy="32" r="23" fill="url(#logoGrad)"/>
    <path d="M32 18 c-8 0 -12 6 -12 12 c0 7 6 10 12 16 c6 -6 12 -9 12 -16 c0 -6 -4 -12 -12 -12z" fill="#ffffff" opacity="0.14"/>
    <path d="M24 32 h16 M32 24 v16" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M20 40 q3 -8 8 -3" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity="0.85"/>
  </svg>`;
}
