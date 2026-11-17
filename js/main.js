/**
 * HolzVision – Interaktionen
 * Header, Mobile-Nav, Reveal, Parallax, BA-Slider, Formular
 */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var menuToggle = document.getElementById('menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  var yearEl = document.getElementById('year');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Header scroll state ---------- */
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---------- Mobile navigation ---------- */
  function closeMobileNav() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Menü öffnen');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Menü schließen');
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') === 'true';
      if (open) closeMobileNav();
      else openMobileNav();
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ---------- Active nav link ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var current = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- Parallax ---------- */
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  var parallaxSlow = document.querySelectorAll('[data-parallax-slow]');

  function updateParallax() {
    if (reduceMotion) return;
    var y = window.scrollY;

    parallaxEls.forEach(function (el) {
      el.style.transform = 'translate3d(0, ' + y * 0.28 + 'px, 0)';
    });

    parallaxSlow.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var offset = (rect.top - window.innerHeight * 0.5) * 0.06;
      el.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    });
  }

  if (!reduceMotion && (parallaxEls.length || parallaxSlow.length)) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* ---------- Galerie-Großansicht ---------- */
  var lightbox = document.getElementById('lightbox');
  var galleryImgs = Array.prototype.slice.call(
    document.querySelectorAll('.ba-compare__media img, .project-item img')
  );

  if (lightbox && galleryImgs.length) {
    var lbImg = lightbox.querySelector('.lightbox__img');
    var lbCaption = lightbox.querySelector('.lightbox__caption');
    var lbIndex = 0;
    var lastFocus = null;
    var touchX = null;

    function captionFor(img) {
      var fig = img.closest('figure');
      var strong = fig && fig.querySelector('figcaption strong');
      return strong ? strong.textContent : img.alt;
    }

    function showImage(i) {
      lbIndex = (i + galleryImgs.length) % galleryImgs.length;
      var img = galleryImgs[lbIndex];
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = captionFor(img) + '  ·  ' + (lbIndex + 1) + ' / ' + galleryImgs.length;
    }

    function openLightbox(i) {
      lastFocus = document.activeElement;
      showImage(i);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox__close').focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    galleryImgs.forEach(function (img, i) {
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.addEventListener('click', function () { openLightbox(i); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', function () { showImage(lbIndex - 1); });
    lightbox.querySelector('.lightbox__nav--next').addEventListener('click', function () { showImage(lbIndex + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(lbIndex - 1);
      if (e.key === 'ArrowRight') showImage(lbIndex + 1);
    });

    lightbox.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) showImage(lbIndex + (dx < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }

})();
