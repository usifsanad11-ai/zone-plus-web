/* MOBILE BACKUP — saved before redesign — restore if needed */
/*
  Mobile JS state at time of backup (script.js):

  No dedicated mobile animation logic existed. All mobile behaviour
  was handled by CSS alone (@media max-width: 430px in styles.css).

  The following guards in script.js explicitly SKIP mobile (> 430):

    Line 33-35:  initScrollScrub() only runs on window.innerWidth > 430
                 → scrub video and ScrollTrigger scroll-tunnel: desktop only

    Line 141-143: gsap.set(linkIcons, …) only runs on window.innerWidth > 430
                  → platform icon initial state (opacity 0, scale 0.2): desktop only

    Line 179-184: gsap.to('#hero-video', …) parallax only runs on window.innerWidth > 430
                  → hero video scale parallax on scroll: desktop only

  Code that DOES run on mobile in script.js:
    - scrubVideo.load() + scrubVideo.currentTime = 0 (harmless on mobile)
    - document.querySelectorAll('video[autoplay]').forEach(v => v.play()) — all autoplay videos
    - discoverHint.classList.add('show') after 500ms (element is display:none on mobile via CSS)
    - Hero video pause/resume listener (keeps hero video playing on iOS Safari)
    - Cursor dot injection (invisible on touch — no hover events)

  To restore original mobile behaviour: remove mobile.css link and mobile-animations.js
  script tag from index.html. The original @media (max-width: 430px) block in styles.css
  is untouched and will re-activate automatically.
*/
