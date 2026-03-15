/* ============================================================
   MENTYAA – Portfolio JavaScript
   Smooth scrolling, scroll-reveal, counters, nav, portfolio filter
   ============================================================ */

(function () {
  'use strict';

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
  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close mobile menu when a nav link is clicked */
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Close menu when clicking outside */
  document.addEventListener('click', function (e) {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

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
     6. CONTACT FORM VALIDATION
  ---------------------------------------------------------- */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      /* Helper to set error */
      function setError(id, msg) {
        const el = document.getElementById(id);
        if (el) el.textContent = msg;
        if (msg) isValid = false;
      }

      function clearErrors() {
        ['nameError', 'emailError', 'serviceError', 'messageError'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.textContent = '';
        });
      }

      clearErrors();
      formSuccess.hidden = true;

      const name    = form.elements['name'].value.trim();
      const email   = form.elements['email'].value.trim();
      const service = form.elements['service'].value;
      const message = form.elements['message'].value.trim();

      /* Mark fields as error or not */
      form.elements['name'].classList.toggle('error', !name);
      form.elements['email'].classList.toggle('error', !(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)));
      form.elements['service'].classList.toggle('error', !service);
      form.elements['message'].classList.toggle('error', !message);

      if (!name)    setError('nameError', 'Please enter your name.');
      if (!email)   setError('emailError', 'Please enter a valid email address.');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setError('emailError', 'Please enter a valid email address.');
      if (!service) setError('serviceError', 'Please select a service.');
      if (!message) setError('messageError', 'Please describe your project.');

      if (isValid) {
        /* Simulate submission (no backend on GitHub Pages) */
        const submitBtn = form.querySelector('.form-submit');
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        setTimeout(function () {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
          form.reset();
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1000);
      }
    });

    /* Clear error on input */
    ['name', 'email', 'service', 'message'].forEach(function (field) {
      const el = form.elements[field];
      if (el) {
        el.addEventListener('input', function () {
          el.classList.remove('error');
          const errEl = document.getElementById(field + 'Error');
          if (errEl) errEl.textContent = '';
        });
      }
    });
  }

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL for anchor links (Safari fallback)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
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
     9. THUMBNAIL SUPPORT
        If a reel card has data-thumb set, apply that image as the
        background of the placeholder div so it shows a real thumbnail
        instead of the gradient.
  ---------------------------------------------------------- */
  document.querySelectorAll('.reel-card[data-thumb]').forEach(function (card) {
    const thumb = card.getAttribute('data-thumb');
    if (!thumb) return;
    const placeholder = card.querySelector('.reel-placeholder');
    if (placeholder) {
      placeholder.style.backgroundImage   = 'url(' + thumb + ')';
      placeholder.style.backgroundSize    = 'cover';
      placeholder.style.backgroundPosition = 'center';
    }
  });

  /* ----------------------------------------------------------
     10. REEL LIGHTBOX MODAL
         Converts a full Instagram Reel URL or YouTube Shorts URL
         into an embeddable iframe URL, then shows it in a modal.

         Supported URL formats
         ─────────────────────────────────────────────────────────
         Instagram Reel:
           https://www.instagram.com/reel/ABC123xyz/
           https://www.instagram.com/p/ABC123xyz/

         YouTube Shorts:
           https://www.youtube.com/shorts/ABC123xyz
           https://youtu.be/ABC123xyz
           https://www.youtube.com/watch?v=ABC123xyz
         ─────────────────────────────────────────────────────────
  ---------------------------------------------------------- */
  const reelModal     = document.getElementById('reelModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose    = document.getElementById('modalClose');
  const modalBody     = document.getElementById('modalBody');

  /** Build a YouTube embed URL from a video ID. */
  function ytEmbedUrl(videoId) {
    return 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&mute=1&playsinline=1';
  }

  /**
   * Convert a public reel/video URL to an embeddable iframe src.
   *
   * @param  {string} url  Full public URL of the Instagram Reel or YouTube video.
   * @returns {string}     Ready-to-use iframe `src` value, or '' if not recognised.
   *
   * Supported formats:
   *   Instagram – https://www.instagram.com/reel/CODE/
   *               https://www.instagram.com/p/CODE/
   *   YouTube   – https://www.youtube.com/shorts/ID
   *               https://www.youtube.com/watch?v=ID
   *               https://youtu.be/ID
   */
  function buildEmbedUrl(url) {
    if (!url) return '';

    // ── Instagram Reel or Post ──────────────────────────────────
    // Matches: /reel/CODE/ or /p/CODE/
    const igMatch = url.match(/instagram\.com\/(reel|p)\/([A-Za-z0-9_-]+)/);
    if (igMatch) {
      return 'https://www.instagram.com/' + igMatch[1] + '/' + igMatch[2] + '/embed/captioned/';
    }

    // ── YouTube Shorts ──────────────────────────────────────────
    const ytShortsMatch = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]+)/);
    if (ytShortsMatch) return ytEmbedUrl(ytShortsMatch[1]);

    // ── YouTube standard watch URL ──────────────────────────────
    const ytWatchMatch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
    if (ytWatchMatch) return ytEmbedUrl(ytWatchMatch[1]);

    // ── youtu.be short links ────────────────────────────────────
    const ytShortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
    if (ytShortMatch) return ytEmbedUrl(ytShortMatch[1]);

    // URL not recognised
    console.warn('[Mentyaa] Unrecognised reel URL — expected an Instagram Reel or YouTube link:', url);
    return '';
  }

  /** Open the lightbox with the given video URL. */
  function openModal(videoUrl) {
    const embedUrl = buildEmbedUrl(videoUrl);
    if (!embedUrl) return; // URL not recognised — do nothing

    // Build a sandboxed iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'modal-iframe';
    iframe.src = embedUrl;
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('title', 'Reel preview');

    modalBody.innerHTML = ''; // clear any previous embed
    modalBody.appendChild(iframe);

    reelModal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  /** Close the lightbox and stop the video. */
  function closeModal() {
    reelModal.hidden = true;
    document.body.style.overflow = '';
    modalBody.innerHTML = ''; // removing iframe stops the video
  }

  // Close on ✕ button
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close on backdrop click
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Close on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && reelModal && !reelModal.hidden) {
      closeModal();
    }
  });

  // Open modal when a reel card is clicked
  document.querySelectorAll('.reel-card[data-reel-url]').forEach(function (card) {
    card.addEventListener('click', function () {
      const url = card.getAttribute('data-reel-url');
      if (url) openModal(url);
    });

    // Keyboard support — activate on Enter / Space
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = card.getAttribute('data-reel-url');
        if (url) openModal(url);
      }
    });
  });

})();
