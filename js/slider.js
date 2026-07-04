/* ===========================
   SLIDER.JS – Carousels & Sliders
   =========================== */

const Slider = (() => {
  /* ── Generic Slider ── */
  const createSlider = ({ trackId, prevId, nextId, dotsId, autoPlay = false, interval = 4000 }) => {
    const track = document.getElementById(trackId);
    if (!track) return;

    const slides = Array.from(track.children);
    if (!slides.length) return;

    let current = 0;
    let autoTimer;

    const goTo = (idx) => {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots?.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    document.getElementById(prevId)?.addEventListener('click', () => { prev(); resetAuto(); });
    document.getElementById(nextId)?.addEventListener('click', () => { next(); resetAuto(); });

    const dots = document.getElementById(dotsId);
    if (dots) {
      dots.innerHTML = slides.map((_, i) => `<button class="slider-dot${i === 0 ? ' active' : ''}" aria-label="Go to slide ${i+1}"></button>`).join('');
      dots.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.addEventListener('click', () => { goTo(i); resetAuto(); });
      });
    }

    // Touch/Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
      resetAuto();
    });

    const startAuto = () => {
      if (!autoPlay) return;
      autoTimer = setInterval(next, interval);
    };
    const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

    // Pause on hover
    track.parentElement?.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.parentElement?.addEventListener('mouseleave', startAuto);

    startAuto();
    return { goTo, next, prev };
  };

  /* ── Testimonials Slider (3-up) ── */
  const initTestimonialsSlider = () => {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    const cards = Array.from(track.children);
    const perView = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    let current = 0;

    const update = () => {
      const pv = perView();
      const maxSlide = Math.max(0, cards.length - pv);
      current = Math.min(current, maxSlide);
      const cardW = track.parentElement.offsetWidth / pv;
      cards.forEach(c => { c.style.width = `${cardW - 24}px`; });
      track.style.transform = `translateX(-${current * (cardW)}px)`;
      updateDots();
    };

    const prev = () => { if (current > 0) { current--; update(); } };
    const next = () => {
      const pv = perView();
      if (current < cards.length - pv) { current++; update(); }
    };

    const updateDots = () => {
      const pv = perView();
      const total = Math.max(1, cards.length - pv + 1);
      const dots = document.getElementById('testimonials-dots');
      if (!dots) return;
      dots.innerHTML = Array.from({ length: total }, (_, i) =>
        `<button class="slider-dot ${i === current ? 'active' : ''}" aria-label="Slide ${i+1}"></button>`
      ).join('');
      dots.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.addEventListener('click', () => { current = i; update(); });
      });
    };

    document.getElementById('testimonials-prev')?.addEventListener('click', prev);
    document.getElementById('testimonials-next')?.addEventListener('click', next);

    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(update, 150); });

    // Swipe
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });

    update();

    // Auto-rotate
    let timer = setInterval(next, 5000);
    track.parentElement?.addEventListener('mouseenter', () => clearInterval(timer));
    track.parentElement?.addEventListener('mouseleave', () => {
      timer = setInterval(next, 5000);
    });
  };

  /* ── Product Horizontal Scroll ── */
  const initProductScroll = (containerId, prevId, nextId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const scrollAmt = () => container.offsetWidth * 0.8;
    document.getElementById(prevId)?.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmt(), behavior: 'smooth' });
    });
    document.getElementById(nextId)?.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmt(), behavior: 'smooth' });
    });
  };

  const init = () => {
    // Hero slider
    createSlider({ trackId: 'hero-track', prevId: 'hero-prev', nextId: 'hero-next', dotsId: 'hero-dots', autoPlay: true, interval: 5000 });
    // Testimonials
    initTestimonialsSlider();
    // Product sliders
    initProductScroll('featured-scroll', 'featured-prev', 'featured-next');
    initProductScroll('bestsellers-scroll', 'bestsellers-prev', 'bestsellers-next');
    initProductScroll('related-scroll', 'related-prev', 'related-next');
  };

  return { init, createSlider };
})();

export default Slider;
