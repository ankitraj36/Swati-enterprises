/* ===========================================================
   WISHLIST — localStorage-backed wishlist management
   =========================================================== */

const WISH_KEY = "swati_wishlist";

function getWishlist(){
  try{ return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
  catch(e){ return []; }
}
function isWishlisted(id){ return getWishlist().includes(Number(id)); }

function toggleWishlist(id){
  id = Number(id);
  let list = getWishlist();
  const product = getProductById(id);
  if(list.includes(id)){
    list = list.filter(i => i !== id);
    showToast(`${product ? product.name : "Item"} removed from wishlist`, "info");
  } else {
    list.push(id);
    showToast(`${product ? product.name : "Item"} added to wishlist`, "success");
    pulseIcon("wishIconBadge");
  }
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
  updateWishCount();
  return list.includes(id);
}
function updateWishCount(){
  const count = getWishlist().length;
  document.querySelectorAll("[data-wish-count]").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", updateWishCount);
