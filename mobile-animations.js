/* ================================================================
   ZONE+ — mobile-animations.js
   Mobile-only GSAP scroll experience (max-width: 430px).
   Loaded with defer. All ScrollTrigger IDs prefixed "mob-"
   to avoid conflicts with desktop triggers in script.js.
================================================================ */

(function () {
  if (window.innerWidth > 430) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── iOS Safari: play all autoplay videos in mobile experience ── */
  document.querySelectorAll('#mobile-experience video').forEach(function (v) {
    v.play().catch(function () {});
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) v.play().catch(function () {});
    });
  });

  /* ================================================================
     SCENE 1 — Hero
     Wordmark: letter-by-letter stagger
     Hero rule: draws left-to-right on scroll enter
  ================================================================ */
  (function sceneHero() {
    var wordmark = document.querySelector('.wordmark');
    if (wordmark) {
      /* Rebuild wordmark: wrap "ZONE" chars, keep + span intact */
      var chars = 'ZONE'.split('').map(function (ch) {
        return '<span class="wm-char" style="display:inline-block;opacity:0;transform:translateY(10px)">' + ch + '</span>';
      }).join('');
      wordmark.innerHTML = chars + '<span class="wm-plus">+</span>';

      gsap.set('.wm-plus', { opacity: 0, y: 10, color: 'var(--teal)' });

      gsap.to('.wm-char', {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.35
      });

      gsap.to('.wm-plus', {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        delay: 0.35 + 4 * 0.08
      });
    }

    /* Hero subtitle: already has CSS fadeUp animation — add scroll rule draw */
    ScrollTrigger.create({
      id: 'mob-hero-rule',
      trigger: '#hero',
      start: 'top top',
      end: 'bottom 60%',
      onEnter: function () {
        gsap.to('.hero-rule', {
          width: '3rem',
          duration: 0.9,
          ease: 'power2.out',
          delay: 1.2
        });
      }
    });
  }());

  /* ================================================================
     SCENE 2 — Statement
     Eyebrow fades + slides up on scroll.
     Each headline word reveals pulled by scroll (scrub: true).
  ================================================================ */
  (function scene2() {
    var scene = document.getElementById('mob-scene-2');
    if (!scene) return;

    /* Eyebrow */
    gsap.to('#mob-scene-2 .mob-eyebrow', {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      scrollTrigger: {
        id: 'mob-s2-eyebrow',
        trigger: scene,
        start: 'top 75%',
        end: 'top 45%',
        scrub: true
      }
    });

    /* Words — stagger maps across scroll travel */
    var words = scene.querySelectorAll('.mob-headline .word');
    gsap.to(words, {
      opacity: 1,
      y: 0,
      stagger: 0.18,
      ease: 'power2.out',
      scrollTrigger: {
        id: 'mob-s2-words',
        trigger: scene,
        start: 'top 65%',
        end: 'center 25%',
        scrub: true
      }
    });
  }());

  /* ================================================================
     SCENE 3 — Visual Panel
     Video: 0.6x parallax (travels 20% over full scene scroll range).
     Caption rule draws, then caption fades.
  ================================================================ */
  (function scene3() {
    var scene = document.getElementById('mob-scene-3');
    if (!scene) return;

    var vid = scene.querySelector('.mob-visual-video');
    if (vid) {
      /* Video starts at top:-10% (centered). Moves from -10% to +10%
         as page scrolls the full height of the scene — 0.6x effect. */
      gsap.fromTo(vid,
        { y: '-10%' },
        {
          y: '10%',
          ease: 'none',
          scrollTrigger: {
            id: 'mob-s3-parallax',
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }

    /* Caption rule draw */
    gsap.to('#mob-scene-3 .mob-caption-rule', {
      scaleX: 1,
      ease: 'power2.out',
      scrollTrigger: {
        id: 'mob-s3-rule',
        trigger: scene,
        start: 'top 55%',
        end: 'top 25%',
        scrub: true
      }
    });

    /* Caption fade */
    gsap.to('#mob-scene-3 .mob-caption', {
      opacity: 1,
      ease: 'power2.out',
      scrollTrigger: {
        id: 'mob-s3-caption',
        trigger: scene,
        start: 'top 45%',
        end: 'top 15%',
        scrub: true
      }
    });
  }());

  /* ================================================================
     SCENE 4 — Details
     Eyebrow fades in.
     Each line wipes left-to-right with clip-path, staggered across scroll.
  ================================================================ */
  (function scene4() {
    var scene = document.getElementById('mob-scene-4');
    if (!scene) return;

    /* Eyebrow */
    gsap.to('#mob-scene-4 .mob-details-eyebrow', {
      opacity: 1,
      ease: 'power2.out',
      scrollTrigger: {
        id: 'mob-s4-eyebrow',
        trigger: scene,
        start: 'top 70%',
        end: 'top 42%',
        scrub: true
      }
    });

    /* Each line: clip-path wipe inset(0 100% 0 0) → inset(0 0% 0 0) */
    var lines = scene.querySelectorAll('.mob-detail-line');
    lines.forEach(function (line, i) {
      var startPct = 68 - i * 8;
      var endPct   = 42 - i * 8;
      gsap.to(line, {
        clipPath: 'inset(0 0% 0 0)',
        ease: 'power2.out',
        scrollTrigger: {
          id: 'mob-s4-line-' + i,
          trigger: scene,
          start: 'top ' + startPct + '%',
          end:   'top ' + endPct + '%',
          scrub: true
        }
      });
    });
  }());

  /* ================================================================
     SCENE 5 — CTA
     Horizontal rule draws, then wordmark / sub / button fade + scale.
  ================================================================ */
  (function scene5() {
    var scene = document.getElementById('mob-scene-5');
    if (!scene) return;

    /* Rule draw */
    gsap.to('#mob-scene-5 .mob-cta-rule-h', {
      width: '3rem',
      ease: 'power2.out',
      scrollTrigger: {
        id: 'mob-s5-rule',
        trigger: scene,
        start: 'top 72%',
        end: 'top 50%',
        scrub: true
      }
    });

    /* Wordmark, subtitle, button — stagger the fade + scale entrance */
    var targets = [
      scene.querySelector('.mob-cta-wordmark'),
      scene.querySelector('.mob-cta-sub'),
      scene.querySelector('.mob-cta-btn')
    ].filter(Boolean);

    gsap.to(targets, {
      opacity: 1,
      scale: 1,
      stagger: 0.14,
      ease: 'power2.out',
      scrollTrigger: {
        id: 'mob-s5-fade',
        trigger: scene,
        start: 'top 65%',
        end: 'top 20%',
        scrub: true
      }
    });
  }());

}());
