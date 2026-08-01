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

})();
