/* ===========================================================
   SEARCH — live product search + suggestions
   =========================================================== */

function searchProducts(query){
  const q = query.trim().toLowerCase();
  if(!q) return [];
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ).slice(0, 6);
}

function suggestItemHTML(p){
  return `<a class="suggest-item" href="product.html?id=${p.id}">
    <div class="s-thumb">${productIconSVG(p.icon)}</div>
    <div>
      <h5>${p.name}</h5>
      <span>${p.category} · ${formatPrice(p.price)}</span>
    </div>
  </a>`;
}

function bindSearchBox(inputEl, panelEl){
  if(!inputEl || !panelEl) return;
  inputEl.addEventListener("input", () => {
    const results = searchProducts(inputEl.value);
    if(!inputEl.value.trim()){
      panelEl.classList.remove("show");
      return;
    }
    panelEl.innerHTML = results.length
      ? results.map(suggestItemHTML).join("")
      : `<div class="suggest-empty">No medicines found for "${inputEl.value}"</div>`;
    panelEl.classList.add("show");
  });
  inputEl.addEventListener("keydown", e => {
    if(e.key === "Enter"){
      e.preventDefault();
      const val = encodeURIComponent(inputEl.value.trim());
      if(val) window.location.href = `shop.html?q=${val}`;
    }
    if(e.key === "Escape") panelEl.classList.remove("show");
  });
  document.addEventListener("click", e => {
    if(!panelEl.contains(e.target) && e.target !== inputEl){
      panelEl.classList.remove("show");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const navInput = document.getElementById("navSearchInput");
  const navPanel = document.getElementById("navSearchSuggest");
  bindSearchBox(navInput, navPanel);
});
