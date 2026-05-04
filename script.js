/* ================================================================
   ZONE+ — script.js
   • Sign-up gate → flash → unlock
   • GSAP ScrollTrigger: scroll-scrub video
   • Lines drawn in pixel space via getBoundingClientRect()
     — no viewBox, guaranteed alignment with character chest
   • Platform icons spring in when character is seated (≥88%)
   • Scroll-to-discover hint
================================================================ */

gsap.registerPlugin(ScrollTrigger);

const SVG_NS = 'http://www.w3.org/2000/svg';


/* ── DOM ──────────────────────────────────────────────────── */
const scrubVideo    = document.getElementById('scrub-video');
const scrubProgress = document.getElementById('scrub-progress');
const progressPct   = document.getElementById('progress-pct');
const linkIcons     = document.querySelectorAll('.link-icon');
const linkSvg       = document.getElementById('link-lines');
const discoverHint  = document.getElementById('discover-hint');
const sideScroll    = document.getElementById('side-scroll');

let iconsShown = false;

/* ================================================================
   1.  AUTO-INIT — no gate, free scroll
================================================================ */
document.addEventListener('DOMContentLoaded', function () {
  scrubVideo.load();
  scrubVideo.currentTime = 0;
  if (window.innerWidth > 430) {
    initScrollScrub();
  }
  document.querySelectorAll('video[autoplay]').forEach(v => v.play().catch(() => {}));
  setTimeout(() => {
    discoverHint.classList.add('show');
  }, 500);
});

/* ================================================================
   2.  SCROLL-SCRUB
================================================================ */
function initScrollScrub() {
  if (!scrubVideo.duration && scrubVideo.readyState < 1) {
    scrubVideo.addEventListener('loadedmetadata', setupScrub, { once: true });
  } else {
    setupScrub();
  }
}

function setupScrub() {
  const section = document.getElementById('scroll-section');
  const sticky  = document.getElementById('sticky');

  let rafPending = false;
  let pendingTime = 0;

  function seekFrame() {
    rafPending = false;
    if (isFinite(pendingTime)) scrubVideo.currentTime = pendingTime;
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: '+=400%',
    pin: sticky,
    pinSpacing: false,
    scrub: 1,
    onUpdate(self) {
      /* throttle seeks to one per animation frame */
      pendingTime = self.progress * scrubVideo.duration;
      if (!rafPending) { rafPending = true; requestAnimationFrame(seekFrame); }

      progressPct.textContent = Math.round(self.progress * 100);

      /* hide scroll hints after first few % */
      if (self.progress > 0.04) {
        discoverHint.classList.add('hide');
        sideScroll.classList.add('hide');
      }

      /* icons appear when character is seated */
      if (self.progress >= 0.88 && !iconsShown) {
        buildLines();
        showIcons();
        iconsShown = true;
      } else if (self.progress < 0.70 && iconsShown) {
        hideIcons();
        iconsShown = false;
      }
    },
    onEnter()     { scrubProgress.classList.add('show'); },
    onLeave()     { scrubProgress.classList.remove('show'); discoverHint.classList.remove('show'); },
    onEnterBack() { scrubProgress.classList.add('show'); }
  });

  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
    if (iconsShown) buildLines();
  }, { passive: true });
}

/* ================================================================
   3.  LINES — drawn with pixel coords from real DOM positions
================================================================ */
function buildLines() {
  /* clear existing lines */
  linkSvg.innerHTML = '';

  const frame      = document.querySelector('.video-frame');
  const frameRect  = frame.getBoundingClientRect();
  const anchor     = document.getElementById('chest-anchor');
  const anchorRect = anchor.getBoundingClientRect();
  const chestX     = anchorRect.left - frameRect.left;
  const chestY     = anchorRect.top  - frameRect.top;

  linkIcons.forEach((icon) => {
    const ring     = icon.querySelector('.icon-ring');
    const ringRect = ring.getBoundingClientRect();

    /* icon ring centre in video-frame coordinate space */
    const ix = (ringRect.left + ringRect.width  / 2) - frameRect.left;
    const iy = (ringRect.top  + ringRect.height / 2) - frameRect.top;

    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('class', 'll');
    line.setAttribute('x1', chestX.toFixed(1));
    line.setAttribute('y1', chestY.toFixed(1));
    line.setAttribute('x2', ix.toFixed(1));
    line.setAttribute('y2', iy.toFixed(1));
    linkSvg.appendChild(line);
  });
}

/* ================================================================
   4.  ICON ANIMATIONS
================================================================ */
if (window.innerWidth > 430) {
  gsap.set(linkIcons, { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' });
}

function showIcons() {
  const lines = linkSvg.querySelectorAll('.ll');

  /* lines radiate outward */
  gsap.fromTo(lines,
    { opacity: 0, strokeDashoffset: 60 },
    { opacity: 0.5, strokeDashoffset: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out' }
  );

  /* icons fade in — no spring/overshoot easing */
  gsap.to(linkIcons, {
    opacity: 1, scale: 1,
    duration: 0.5, stagger: 0.09,
    ease: 'power2.out', delay: 0.1
  });

  /* flowing dash animation on lines */
  gsap.to(lines, {
    strokeDashoffset: -22,
    duration: 1.5, repeat: -1, ease: 'none', delay: 0.5
  });
}

function hideIcons() {
  const lines = linkSvg.querySelectorAll('.ll');
  gsap.killTweensOf([linkIcons, lines]);
  gsap.to(linkIcons, { opacity: 0, scale: 0.2, duration: 0.25, ease: 'power2.in' });
  gsap.to(lines,     { opacity: 0,             duration: 0.25, ease: 'power2.in' });
  iconsShown = false;
}

/* ================================================================
   5.  HERO PARALLAX
================================================================ */
if (window.innerWidth > 430) {
  gsap.to('#hero-video', {
    scale: 1.07, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });
}

/* ── iPhone Safari: keep hero video playing ── */
(function () {
  const hv = document.getElementById('hero-video');
  if (!hv) return;
  const resume = () => hv.play().catch(() => {});
  hv.addEventListener('pause', resume);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) resume(); });
  window.addEventListener('pageshow', resume);
})();


