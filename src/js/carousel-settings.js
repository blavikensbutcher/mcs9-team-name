document.addEventListener('DOMContentLoaded', function () {
  (function () {
    const slider = document.querySelector('.reviews-slider');
    if (!slider) return;

    const viewport = slider.querySelector('.viewport');
    const track = slider.querySelector('.review-track');
    const items = Array.from(track.children);
    const btnPrev = slider.querySelector('.nav-btn.prev');
    const btnNext = slider.querySelector('.nav-btn.next');

    let slidesPerView = 1;
    let gap = 32;
    let slideWidth = 0;
    let index = 0;
    let maxIndex = 0;

    let isDown = false;
    let startX = 0;
    let currentX = 0;
    let startTX = 0;

    let autoplayTimer = null;
    const AUTOPLAY_MS = 3500;

    function getSlidesPerView() {
      const w = window.innerWidth;
      if (w >= 1280) return 3;
      if (w >= 768) return 2;
      return 1;
    }

    function getGapFromCSS() {
      const g = getComputedStyle(track).gap || '0px';
      const num = parseFloat(g);
      return Number.isFinite(num) ? num : 0;
    }

    function layout() {
      slidesPerView = getSlidesPerView();
      gap = getGapFromCSS();

      const viewportWidth = viewport.clientWidth;
      slideWidth = (viewportWidth - gap * (slidesPerView - 1)) / slidesPerView;

      items.forEach(li => {
        li.style.width = slideWidth + 'px';
        li.style.flex = '0 0 ' + slideWidth + 'px';
      });

      maxIndex = Math.max(0, items.length - slidesPerView);
      if (index > maxIndex) index = maxIndex;

      applyTransform();
      updateButtons();
    }

    function applyTransform() {
      const offset = index * (slideWidth + gap);
      track.style.transform = 'translate3d(' + -offset + 'px,0,0)';
    }

    function updateButtons() {
      btnPrev.disabled = index <= 0;
      btnNext.disabled = index >= maxIndex;
    }

    function getCurrentTranslateX(el) {
      const tr = getComputedStyle(el).transform;
      if (!tr || tr === 'none') return 0;
      if (tr.startsWith('matrix3d(')) {
        const v = tr.slice(9, -1).split(',').map(parseFloat);
        return v[12] || 0;
      }
      if (tr.startsWith('matrix(')) {
        const v = tr.slice(7, -1).split(',').map(parseFloat);
        return v[4] || 0;
      }
      return 0;
    }

    btnPrev.addEventListener('click', () => {
      stopAutoplay();
      index = Math.max(0, index - 1);
      applyTransform();
      updateButtons();
      startAutoplay();
    });

    btnNext.addEventListener('click', () => {
      stopAutoplay();
      index = Math.min(maxIndex, index + 1);
      applyTransform();
      updateButtons();
      startAutoplay();
    });

    viewport.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') btnPrev.click();
      if (e.key === 'ArrowRight') btnNext.click();
    });

    function pointerDown(x) {
      isDown = true;
      startX = currentX = x;
      startTX = getCurrentTranslateX(track);
      track.style.transition = 'none';
      stopAutoplay();
      viewport.classList.add('grabbing');
    }
    function pointerMove(x) {
      if (!isDown) return;
      currentX = x;
      const dx = currentX - startX;
      track.style.transform = 'translate3d(' + (startTX + dx) + 'px,0,0)';
    }
    function pointerUp() {
      if (!isDown) return;
      isDown = false;
      viewport.classList.remove('grabbing');
      track.style.transition = 'transform 350ms cubic-bezier(.22,.61,.36,1)';

      const dx = currentX - startX;
      const step = slideWidth + gap;
      const threshold = step * 0.22;

      if (dx < -threshold && index < maxIndex) index += 1;
      if (dx > threshold && index > 0) index -= 1;

      applyTransform();
      updateButtons();
      startAutoplay();
    }

    viewport.addEventListener('mousedown', e => pointerDown(e.clientX));
    window.addEventListener('mousemove', e => pointerMove(e.clientX));
    window.addEventListener('mouseup', pointerUp);
    viewport.addEventListener('mouseleave', () => {
      if (isDown) pointerUp();
    });

    viewport.addEventListener(
      'touchstart',
      e => pointerDown(e.touches[0].clientX),
      { passive: true }
    );
    window.addEventListener(
      'touchmove',
      e => pointerMove(e.touches[0].clientX),
      { passive: true }
    );
    window.addEventListener('touchend', pointerUp);

    function startAutoplay() {
      if (autoplayTimer) return;
      autoplayTimer = setInterval(() => {
        if (index < maxIndex) {
          index += 1;
        } else {
          index = 0;
        }
        applyTransform();
        updateButtons();
      }, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('focusin', stopAutoplay);
    viewport.addEventListener('mouseleave', startAutoplay);
    viewport.addEventListener('focusout', startAutoplay);

    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', layout);

    layout();
    startAutoplay();
  })();
});
