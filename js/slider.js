/* ===========================================================
   SLIDER — reusable carousel with touch support
   =========================================================== */

function bindSlider(trackId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if (!track) return;

  const scrollAmt = () => track.clientWidth * 0.8;

  if (prev) prev.addEventListener("click", () =>
    track.scrollBy({ left: -scrollAmt(), behavior: "smooth" })
  );
  if (next) next.addEventListener("click", () =>
    track.scrollBy({ left: scrollAmt(), behavior: "smooth" })
  );

  /* Touch / swipe support */
  let startX = 0, scrollStart = 0, isDragging = false;
  track.addEventListener("touchstart", e => {
    startX = e.touches[0].pageX;
    scrollStart = track.scrollLeft;
    isDragging = true;
  }, { passive: true });
  track.addEventListener("touchmove", e => {
    if (!isDragging) return;
    const dx = e.touches[0].pageX - startX;
    track.scrollLeft = scrollStart - dx;
  }, { passive: true });
  track.addEventListener("touchend", () => { isDragging = false; });
}

/* Auto-play slider with pause on hover */
function autoPlaySlider(trackId, interval = 4000) {
  const track = document.getElementById(trackId);
  if (!track) return;

  let timer = null;
  const cards = track.children;
  if (!cards.length) return;

  function advance() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 10) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: 280, behavior: "smooth" });
    }
  }

  function start() { timer = setInterval(advance, interval); }
  function stop() { clearInterval(timer); }

  start();
  track.addEventListener("mouseenter", stop);
  track.addEventListener("mouseleave", start);
  track.addEventListener("touchstart", stop, { passive: true });
  track.addEventListener("touchend", () => setTimeout(start, 2000));
}

/* Testimonial slider with dots */
function initTestiSlider(wrapperId) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;
  const track = wrapper.querySelector(".testi-track");
  const dotsContainer = wrapper.querySelector(".slider-dots");
  if (!track) return;

  const cards = track.children;
  const cardCount = cards.length;
  if (!cardCount) return;

  let current = 0;
  const getVisibleCount = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1080) return 2;
    return 3;
  };

  function renderDots() {
    if (!dotsContainer) return;
    const visible = getVisibleCount();
    const total = Math.max(1, cardCount - visible + 1);
    dotsContainer.innerHTML = Array.from({ length: total }, (_, i) =>
      `<button class="slider-dot ${i === current ? 'active' : ''}" data-dot="${i}" aria-label="Go to slide ${i + 1}"></button>`
    ).join('');
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, cardCount - getVisibleCount()));
    const card = cards[current];
    if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    renderDots();
  }

  if (dotsContainer) {
    dotsContainer.addEventListener("click", e => {
      const dot = e.target.closest("[data-dot]");
      if (dot) goTo(Number(dot.dataset.dot));
    });
  }

  renderDots();
  window.addEventListener("resize", renderDots);

  /* Auto advance */
  let autoTimer = setInterval(() => goTo(current + 1 >= cardCount - getVisibleCount() + 1 ? 0 : current + 1), 5000);
  wrapper.addEventListener("mouseenter", () => clearInterval(autoTimer));
  wrapper.addEventListener("mouseleave", () => {
    autoTimer = setInterval(() => goTo(current + 1 >= cardCount - getVisibleCount() + 1 ? 0 : current + 1), 5000);
  });
}
