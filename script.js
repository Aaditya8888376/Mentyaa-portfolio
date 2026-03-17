/* ============================================================
   MENTYAA – Portfolio JavaScript
   Smooth scrolling, scroll-reveal, counters, nav, portfolio filter
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     0. DARK / LIGHT THEME TOGGLE
  ---------------------------------------------------------- */
  var themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mentya-theme', theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ----------------------------------------------------------
     1. NAVBAR – scroll class + mobile toggle
  ---------------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu  = document.getElementById('navMenu');

  /* Add .scrolled class when page scrolls past 60px */
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case page starts mid-scroll

  /* Hamburger toggle */
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* Close mobile menu when a nav link is clicked */
  if (navMenu) {
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        if (navToggle) {
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      });
    });

    /* Close menu when clicking outside */
    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        navToggle && !navToggle.contains(e.target) &&
        themeToggle && !themeToggle.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     2. SCROLL REVEAL – IntersectionObserver
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    /* Fallback for very old browsers – just show everything */
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----------------------------------------------------------
     3. COUNTER ANIMATION
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ----------------------------------------------------------
     4. PORTFOLIO FILTER
  ---------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const reelCards     = document.querySelectorAll('.reel-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.getAttribute('data-filter');

      /* Update active state */
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      /* Show / hide cards */
      reelCards.forEach(function (card) {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     5. HERO PARTICLES
  ---------------------------------------------------------- */
  const particlesContainer = document.getElementById('heroParticles');

  function createParticle() {
    if (!particlesContainer) return;

    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 6 + 2; // 2–8 px
    const left = Math.random() * 100;    // 0–100%
    const delay = Math.random() * 8;     // 0–8s
    const duration = Math.random() * 12 + 8; // 8–20s

    p.style.cssText =
      'width:' + size + 'px;' +
      'height:' + size + 'px;' +
      'left:' + left + '%;' +
      'bottom:-' + size + 'px;' +
      'animation-duration:' + duration + 's;' +
      'animation-delay:' + delay + 's;';

    particlesContainer.appendChild(p);

    /* Remove after animation completes to keep DOM clean */
    setTimeout(function () {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, (duration + delay) * 1000);
  }

  /* Spawn particles in batches */
  (function spawnParticles() {
    const count = 18;
    for (let i = 0; i < count; i++) {
      createParticle();
    }
    /* Continuously re-spawn after oldest would have finished (20s) */
    setInterval(createParticle, 1200);
  })();

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL for anchor links (Safari fallback)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70; // account for fixed navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     8. ACTIVE NAV LINK HIGHLIGHT on scroll
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ----------------------------------------------------------
     9. CARD THUMBNAILS
        Priority order:
          1. data-thumb  — explicit image URL (always used if set)
          2. data-video-src — auto-extract first frame via canvas
          3. Fallback — gradient background (CSS, no JS needed)
  ---------------------------------------------------------- */

  /** Apply a thumbnail URL as the background of a placeholder element. */
  function applyThumb(placeholder, url) {
    placeholder.style.backgroundImage    = 'url(' + url + ')';
    placeholder.style.backgroundSize     = 'cover';
    placeholder.style.backgroundPosition = 'center';
  }

  document.querySelectorAll('.reel-card').forEach(function (card) {
    var placeholder = card.querySelector('.reel-placeholder');
    if (!placeholder) return;

    var thumb     = card.getAttribute('data-thumb');
    var videoSrc  = card.getAttribute('data-video-src');

    // Explicit thumbnail wins
    if (thumb) {
      applyThumb(placeholder, thumb);
      return;
    }

    // Auto-extract first frame from local video file
    if (videoSrc) {
      var vid = document.createElement('video');
      vid.crossOrigin   = 'anonymous';
      vid.muted         = true;
      vid.playsInline   = true;
      vid.preload       = 'metadata';

      vid.addEventListener('loadedmetadata', function () {
        vid.currentTime = Math.min(0.5, (vid.duration * 0.05) || 0.1);
      });

      vid.addEventListener('seeked', function () {
        try {
          var canvas  = document.createElement('canvas');
          canvas.width  = vid.videoWidth  || 360;
          canvas.height = vid.videoHeight || 640;
          canvas.getContext('2d').drawImage(vid, 0, 0, canvas.width, canvas.height);
          applyThumb(placeholder, canvas.toDataURL('image/jpeg', 0.85));
        } catch (err) {
          console.warn('[Mentyaa] Could not auto-extract thumbnail for:', videoSrc, err);
        }
        vid.src = ''; // free memory
      }, { once: true });

      vid.src = videoSrc;
    }
  });

  /* ----------------------------------------------------------
     10. REEL LIGHTBOX MODAL
         Supports:
           • data-video-src  — local MP4 / video file  → <video> player
           • data-reel-url   — Instagram Reel / YouTube  → <iframe> embed

         Supported iframe URL formats:
           Instagram Reel : https://www.instagram.com/reel/CODE/
           Instagram Post : https://www.instagram.com/p/CODE/
           YouTube Shorts : https://www.youtube.com/shorts/ID
           YouTube watch  : https://www.youtube.com/watch?v=ID
           youtu.be short : https://youtu.be/ID
  ---------------------------------------------------------- */
  var reelModal       = document.getElementById('reelModal');
  var modalBackdrop   = document.getElementById('modalBackdrop');
  var modalClose      = document.getElementById('modalClose');
  var modalBody       = document.getElementById('modalBody');
  var modalFullscreen = document.getElementById('modalFullscreen');
  var modalInner      = document.getElementById('modalInner');

  /** Build a YouTube embed URL from a video ID. */
  function ytEmbedUrl(videoId) {
    return 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&mute=1&playsinline=1';
  }

  /** Convert a public reel/video URL to an embeddable iframe src. */
  function buildEmbedUrl(url) {
    if (!url) return '';

    var igMatch = url.match(/instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)/);
    if (igMatch) {
      // Use /embed/ (not /captioned/) to maximise fullscreen support
      return 'https://www.instagram.com/' + igMatch[1] + '/' + igMatch[2] + '/embed/';
    }

    var ytShortsMatch = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]+)/);
    if (ytShortsMatch) return ytEmbedUrl(ytShortsMatch[1]);

    var ytWatchMatch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
    if (ytWatchMatch) return ytEmbedUrl(ytWatchMatch[1]);

    var ytShortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
    if (ytShortMatch) return ytEmbedUrl(ytShortMatch[1]);

    console.warn('[Mentyaa] Unrecognised reel URL:', url);
    return '';
  }

  /** Open the lightbox with a local video file (<video> element). */
  function openLocalVideoModal(src) {
    var video = document.createElement('video');
    video.className  = 'modal-video';
    video.src        = src;
    video.controls   = true;
    video.autoplay   = true;
    video.playsInline = true;

    modalBody.innerHTML = '';
    modalBody.appendChild(video);

    reelModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  /** Open the lightbox with an iframe embed (Instagram / YouTube). */
  function openEmbedModal(url) {
    var embedUrl = buildEmbedUrl(url);
    if (!embedUrl) return;

    var iframe = document.createElement('iframe');
    iframe.className = 'modal-iframe';
    iframe.src = embedUrl;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    // Include 'fullscreen' in the Permissions Policy allow attribute so
    // the iframe is permitted to request fullscreen from within itself.
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    iframe.setAttribute('title', 'Reel preview');

    modalBody.innerHTML = '';
    modalBody.appendChild(iframe);

    reelModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  /** Close the lightbox and stop any playing video. */
  function closeModal() {
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(function () {});
    } else if (document.webkitFullscreenElement) {
      document.webkitExitFullscreen();
    }
    reelModal.hidden = true;
    document.body.style.overflow = '';
    var vid = modalBody ? modalBody.querySelector('video') : null;
    if (vid) vid.pause();
    if (modalBody) modalBody.innerHTML = '';
  }

  if (modalClose)    modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  /* Fullscreen button: request fullscreen on the modal panel */
  if (modalFullscreen && modalInner) {
    modalFullscreen.addEventListener('click', function () {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        // Already fullscreen — exit
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(function () {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else {
        // Enter fullscreen on the modal panel
        if (modalInner.requestFullscreen) {
          modalInner.requestFullscreen().catch(function (err) {
            console.warn('[Mentyaa] Fullscreen request failed:', err);
          });
        } else if (modalInner.webkitRequestFullscreen) {
          modalInner.webkitRequestFullscreen();
        }
      }
    });

    /* Update fullscreen icon based on current fullscreen state */
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);

    function updateFullscreenIcon() {
      var isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!modalFullscreen) return;
      // Toggle between expand / compress icon
      modalFullscreen.innerHTML = isFs
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && reelModal && !reelModal.hidden) closeModal();
  });

  // Attach click / keyboard handlers to every reel card
  document.querySelectorAll('.reel-card').forEach(function (card) {
    var videoSrc = card.getAttribute('data-video-src');
    var reelUrl  = card.getAttribute('data-reel-url');

    if (!videoSrc && !reelUrl) return; // no playable source — skip

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    function handleActivate() {
      if (videoSrc) {
        openLocalVideoModal(videoSrc);
      } else {
        openEmbedModal(reelUrl);
      }
    }

    card.addEventListener('click', handleActivate);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActivate();
      }
    });
  });

})();
