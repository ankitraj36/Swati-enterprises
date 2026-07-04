/* ===========================
   SEARCH.JS – Live Search
   =========================== */
import Storage from './storage.js';
import Products from './products.js';

const Search = (() => {
  let debounceTimer;

  const init = () => {
    const form = document.getElementById('nav-search-form');
    const input = document.getElementById('nav-search-input');
    const suggestions = document.getElementById('search-suggestions');
    if (!input) return;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => showSuggestions(input.value.trim(), suggestions), 300);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length > 1) {
        suggestions?.classList.add('open');
      } else {
        showRecentSearches(suggestions);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { suggestions?.classList.remove('open'); input.blur(); }
      if (e.key === 'Enter') { e.preventDefault(); doSearch(input.value.trim()); }
    });

    form?.addEventListener('submit', (e) => { e.preventDefault(); doSearch(input.value.trim()); });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-search')) suggestions?.classList.remove('open');
    });
  };

  const showSuggestions = (term, container) => {
    if (!container) return;
    if (!term) { showRecentSearches(container); return; }

    const results = Products.getAll()
      .filter(p =>
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.brand.toLowerCase().includes(term.toLowerCase()) ||
        p.category.toLowerCase().includes(term.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(term.toLowerCase()))
      )
      .slice(0, 6);

    if (!results.length) {
      container.innerHTML = `<div class="suggestion-item text-muted"><svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> No results for "<strong>${term}</strong>"</div>`;
      container.classList.add('open');
      return;
    }

    container.innerHTML = `
      <div style="padding:8px 16px;font-size:11px;font-weight:600;color:var(--clr-text-muted);text-transform:uppercase;letter-spacing:.08em;">Products</div>
      ${results.map(p => `
        <a href="product.html?id=${p.id}" class="suggestion-item" data-term="${term}">
          <img src="${p.image}" alt="${p.name}" onerror="this.src='images/products/placeholder.png'" style="width:40px;height:40px;object-fit:contain;border-radius:6px;background:var(--clr-bg-alt)">
          <div>
            <div style="font-size:13px;font-weight:500;color:var(--clr-text)">${highlightTerm(p.name, term)}</div>
            <div style="font-size:11px;color:var(--clr-text-muted)">${p.brand} · ₹${p.price}</div>
          </div>
        </a>
      `).join('')}
      <a href="shop.html?q=${encodeURIComponent(term)}" class="suggestion-item" style="color:var(--clr-primary);font-weight:600;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px" class="suggestion-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        See all results for "${term}"
      </a>
    `;
    container.classList.add('open');

    container.querySelectorAll('.suggestion-item[data-term]').forEach(el => {
      el.addEventListener('click', () => {
        Storage.addSearch(term);
        container.classList.remove('open');
      });
    });
  };

  const showRecentSearches = (container) => {
    if (!container) return;
    const recent = Storage.getSearches();
    if (!recent.length) { container.classList.remove('open'); return; }
    container.innerHTML = `
      <div style="padding:8px 16px 4px;font-size:11px;font-weight:600;color:var(--clr-text-muted);text-transform:uppercase;letter-spacing:.08em;">Recent Searches</div>
      ${recent.map(s => `
        <div class="suggestion-item recent-search-item" data-term="${s}">
          <svg class="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.67"/></svg>
          ${s}
        </div>
      `).join('')}
      <div class="suggestion-item" id="clear-recent" style="color:var(--clr-text-muted);font-size:12px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px" class="suggestion-icon"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
        Clear recent searches
      </div>
    `;
    container.classList.add('open');

    container.querySelectorAll('.recent-search-item').forEach(el => {
      el.addEventListener('click', () => {
        const inp = document.getElementById('nav-search-input');
        if (inp) inp.value = el.dataset.term;
        doSearch(el.dataset.term);
        container.classList.remove('open');
      });
    });

    document.getElementById('clear-recent')?.addEventListener('click', () => {
      Storage.clearSearches();
      container.classList.remove('open');
    });
  };

  const highlightTerm = (text, term) => {
    const re = new RegExp(`(${term})`, 'gi');
    return text.replace(re, '<mark style="background:rgba(15,157,88,.15);color:var(--clr-primary);border-radius:2px">$1</mark>');
  };

  const doSearch = (term) => {
    if (!term) return;
    Storage.addSearch(term);
    window.location.href = `shop.html?q=${encodeURIComponent(term)}`;
  };

  return { init };
})();

export default Search;
