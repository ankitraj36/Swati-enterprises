/* ===========================================================
   FILTERS — shop page filtering, sorting, view toggle
   =========================================================== */

function initShopFilters() {
  const params = new URLSearchParams(window.location.search);
  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  const brands = [...new Set(PRODUCTS.map(p => p.brand).filter(Boolean))];

  let state = {
    category: params.get("category") || "",
    query: params.get("q") || "",
    maxPrice: 1700,
    inStockOnly: false,
    minRating: 0,
    sort: "popular",
    offersOnly: params.get("filter") === "offers",
    prescriptionOnly: false,
    viewMode: "grid"
  };

  /* --- Category filter checkboxes --- */
  const catGroup = document.getElementById("categoryFilterGroup");
  if (catGroup) {
    catGroup.innerHTML = categories.map(c => `
      <label><input type="checkbox" class="cat-check" value="${c}" ${c === state.category ? 'checked' : ''}> ${c}</label>
    `).join("");
    catGroup.addEventListener("change", apply);
  }

  /* --- Quick chips --- */
  const chips = document.getElementById("quickCategoryChips");
  if (chips) {
    chips.innerHTML = ['All', ...categories].map(c =>
      `<button class="chip ${((c==='All'&&!state.category)|| c===state.category) ? 'active':''}" data-chip="${c}">${c}</button>`
    ).join("");
    chips.addEventListener("click", e => {
      const btn = e.target.closest("[data-chip]");
      if (!btn) return;
      chips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".cat-check").forEach(c => c.checked = (c.value === btn.dataset.chip));
      if (btn.dataset.chip === "All") document.querySelectorAll(".cat-check").forEach(c => c.checked = false);
      state.offersOnly = false;
      apply();
    });
  }

  /* --- Brand filter --- */
  const brandGroup = document.getElementById("brandFilterGroup");
  if (brandGroup) {
    brandGroup.innerHTML = brands.slice(0, 12).map(b => `
      <label><input type="checkbox" class="brand-check" value="${b}"> ${b}</label>
    `).join("");
    brandGroup.addEventListener("change", apply);
  }

  /* --- Price range --- */
  const priceRange = document.getElementById("priceRange");
  const priceVal = document.getElementById("priceRangeVal");
  if (priceRange) {
    priceRange.addEventListener("input", e => {
      state.maxPrice = Number(e.target.value);
      if (priceVal) priceVal.textContent = e.target.value;
      apply();
    });
  }

  /* --- Stock filter --- */
  const stockCheck = document.getElementById("inStockOnly");
  if (stockCheck) stockCheck.addEventListener("change", e => { state.inStockOnly = e.target.checked; apply(); });

  /* --- Prescription filter --- */
  const rxCheck = document.getElementById("rxOnly");
  if (rxCheck) rxCheck.addEventListener("change", e => { state.prescriptionOnly = e.target.checked; apply(); });

  /* --- Rating filter --- */
  document.querySelectorAll("input[name='rating']").forEach(r =>
    r.addEventListener("change", e => { state.minRating = Number(e.target.value); apply(); })
  );

  /* --- Sort --- */
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.addEventListener("change", e => { state.sort = e.target.value; apply(); });

  /* --- View toggle (grid / list) --- */
  const viewBtns = document.querySelectorAll("[data-view]");
  viewBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      viewBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.viewMode = btn.dataset.view;
      const grid = document.getElementById("shopGrid");
      if (grid) {
        grid.className = state.viewMode === "list" ? "product-list" : "product-grid";
      }
    });
  });

  /* --- Clear filters --- */
  const clearBtn = document.getElementById("clearFilters");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      document.querySelectorAll(".cat-check").forEach(c => c.checked = false);
      document.querySelectorAll(".brand-check").forEach(c => c.checked = false);
      if (priceRange) { priceRange.value = 1700; if (priceVal) priceVal.textContent = "1700"; }
      if (stockCheck) stockCheck.checked = false;
      if (rxCheck) rxCheck.checked = false;
      const defaultRating = document.querySelector("input[name='rating'][value='0']");
      if (defaultRating) defaultRating.checked = true;
      if (chips) { chips.querySelectorAll(".chip").forEach(c => c.classList.remove("active")); chips.querySelector("[data-chip='All']")?.classList.add("active"); }
      state = { category: "", query: "", maxPrice: 1700, inStockOnly: false, minRating: 0, sort: state.sort, offersOnly: false, prescriptionOnly: false, viewMode: state.viewMode };
      apply();
    });
  }

  function selectedCategories() {
    return [...document.querySelectorAll(".cat-check:checked")].map(el => el.value);
  }
  function selectedBrands() {
    return [...document.querySelectorAll(".brand-check:checked")].map(el => el.value);
  }

  function apply() {
    let list = PRODUCTS.slice();
    const cats = selectedCategories();
    const selectedBrandList = selectedBrands();

    if (cats.length) list = list.filter(p => cats.includes(p.category));
    if (selectedBrandList.length) list = list.filter(p => selectedBrandList.includes(p.brand));
    if (state.query) list = list.filter(p => p.name.toLowerCase().includes(state.query.toLowerCase()) || p.category.toLowerCase().includes(state.query.toLowerCase()));
    if (state.offersOnly) list = list.filter(p => p.badge);
    list = list.filter(p => p.price <= state.maxPrice);
    if (state.inStockOnly) list = list.filter(p => p.stock === "in");
    if (state.prescriptionOnly) list = list.filter(p => p.prescriptionRequired);
    if (state.minRating) list = list.filter(p => p.rating >= state.minRating);

    switch (state.sort) {
      case "price-low": list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "newest": list.sort((a, b) => b.id - a.id); break;
      case "bestselling": list.sort((a, b) => b.reviews - a.reviews); break;
      default: list.sort((a, b) => b.reviews - a.reviews);
    }

    const grid = document.getElementById("shopGrid");
    renderGrid(grid, list);

    const countEl = document.getElementById("resultCount");
    if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? 's' : ''} found`;
  }

  /* Initial render */
  apply();
}
