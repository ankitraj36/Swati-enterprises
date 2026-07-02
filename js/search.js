/* ===========================================================
   SEARCH — live search with highlighting, recent, popular
   =========================================================== */

const POPULAR_SEARCHES = ["Paracetamol", "Vitamins", "BP Monitor", "Baby Lotion", "Face Wash", "Omega-3"];

function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.brand && p.brand.toLowerCase().includes(q))
  ).slice(0, 8);
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function suggestItemHTML(p, query) {
  return `<a class="suggest-item" href="product.html?id=${p.id}">
    <div class="s-thumb">${productIconSVG(p.icon)}</div>
    <div>
      <h5>${highlightMatch(p.name, query)}</h5>
      <span>${p.category} · ${formatPrice(p.price)}</span>
    </div>
  </a>`;
}

function buildSuggestPanel(panelEl, inputEl) {
  const query = inputEl.value.trim();
  if (!query) {
    /* Show recent + popular when empty and focused */
    const recent = (typeof StorageManager !== 'undefined') ? StorageManager.getRecentSearches() : [];
    let html = '';

    if (recent.length) {
      html += `<div class="search-section-title">Recent Searches</div>`;
      html += `<div style="padding:6px 16px 12px;display:flex;flex-wrap:wrap;gap:6px;">`;
      recent.forEach(s => { html += `<span class="recent-search-tag" data-search="${s}">${s}</span>`; });
      html += `</div>`;
    }

    html += `<div class="search-section-title">Popular Searches</div>`;
    html += `<div style="padding:6px 16px 12px;display:flex;flex-wrap:wrap;gap:6px;">`;
    POPULAR_SEARCHES.forEach(s => { html += `<span class="recent-search-tag" data-search="${s}">${s}</span>`; });
    html += `</div>`;

    panelEl.innerHTML = html;
    panelEl.classList.add("show");
    return;
  }

  const results = searchProducts(query);
  if (results.length) {
    panelEl.innerHTML = `<div class="search-section-title">${results.length} result${results.length > 1 ? 's' : ''}</div>` +
      results.map(p => suggestItemHTML(p, query)).join("");
  } else {
    panelEl.innerHTML = `<div class="suggest-empty">No medicines found for "${query}"</div>`;
  }
  panelEl.classList.add("show");
}

function bindSearchBox(inputEl, panelEl) {
  if (!inputEl || !panelEl) return;
  let kbIndex = -1;

  inputEl.addEventListener("input", () => {
    kbIndex = -1;
    buildSuggestPanel(panelEl, inputEl);
  });

  inputEl.addEventListener("focus", () => {
    buildSuggestPanel(panelEl, inputEl);
  });

  /* Keyboard navigation */
  inputEl.addEventListener("keydown", e => {
    const items = panelEl.querySelectorAll(".suggest-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      kbIndex = Math.min(kbIndex + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle("kb-active", i === kbIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      kbIndex = Math.max(kbIndex - 1, 0);
      items.forEach((it, i) => it.classList.toggle("kb-active", i === kbIndex));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (kbIndex >= 0 && items[kbIndex]) {
        items[kbIndex].click();
      } else {
        const val = inputEl.value.trim();
        if (val) {
          if (typeof StorageManager !== 'undefined') StorageManager.addRecentSearch(val);
          window.location.href = `shop.html?q=${encodeURIComponent(val)}`;
        }
      }
    } else if (e.key === "Escape") {
      panelEl.classList.remove("show");
      inputEl.blur();
    }
  });

  /* Click on recent/popular search tag */
  panelEl.addEventListener("click", e => {
    const tag = e.target.closest("[data-search]");
    if (tag) {
      inputEl.value = tag.dataset.search;
      buildSuggestPanel(panelEl, inputEl);
    }
  });

  /* Close on outside click */
  document.addEventListener("click", e => {
    if (!panelEl.contains(e.target) && e.target !== inputEl) {
      panelEl.classList.remove("show");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const navInput = document.getElementById("navSearchInput");
  const navPanel = document.getElementById("navSearchSuggest");
  bindSearchBox(navInput, navPanel);
});
