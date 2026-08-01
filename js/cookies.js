/**
 * HolzVision – DSGVO / TKG 2021 Cookie-Consent
 * Opt-In für Analytics & Marketing; Essenzielle Cookies immer aktiv.
 * Speicherung ausschließlich lokal (localStorage).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'holzvision_cookie_consent';
  var CONSENT_VERSION = '1';

  var defaultConsent = {
    version: CONSENT_VERSION,
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: null
  };

  function getConsent() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      var parsed = JSON.parse(stored);
      if (parsed.version !== CONSENT_VERSION) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consent) {
    consent.timestamp = new Date().toISOString();
    consent.version = CONSENT_VERSION;
    consent.essential = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    applyConsent(consent);
  }

  function applyConsent(consent) {
    if (consent.analytics) {
      loadAnalytics();
    }
    if (consent.marketing) {
      loadMarketing();
    }
    document.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consent }));
  }

  function loadAnalytics() {
    /* Platzhalter: Analytics-Skript erst nach Opt-In einbinden */
  }

  function loadMarketing() {
    /* Platzhalter: Marketing-Skript erst nach Opt-In einbinden */
  }

  function createBanner() {
    var overlay = document.createElement('div');
    overlay.id = 'cookie-banner';
    overlay.className = 'cookie-banner';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-labelledby', 'cookie-banner-title');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<div class="cookie-banner__content">' +
          '<h2 id="cookie-banner-title" class="cookie-banner__title">Cookie-Einstellungen</h2>' +
          '<p class="cookie-banner__text">' +
            'Wir verwenden Cookies und lokale Speicherung, um die Website technisch bereitzustellen. ' +
            'Optionale Cookies für Statistik und Marketing setzen wir nur mit Ihrer Einwilligung (Opt-In) ein. ' +
            'Weitere Informationen finden Sie in unserer ' +
            '<a href="datenschutz.html">Datenschutzerklärung</a>.' +
          '</p>' +
        '</div>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="btn btn--accent" id="cookie-accept-all">Alle akzeptieren</button>' +
          '<button type="button" class="btn btn--outline" id="cookie-essential-only">Nur essenzielle</button>' +
          '<button type="button" class="btn btn--ghost" id="cookie-settings-open">Einstellungen</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    bindBannerEvents(overlay);
  }

  function createSettingsModal() {
    var modal = document.createElement('div');
    modal.id = 'cookie-settings-modal';
    modal.className = 'cookie-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'cookie-settings-title');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="cookie-modal__backdrop" data-close-modal></div>' +
      '<div class="cookie-modal__panel">' +
        '<div class="cookie-modal__header">' +
          '<h2 id="cookie-settings-title">Cookie-Einstellungen</h2>' +
          '<button type="button" class="cookie-modal__close" aria-label="Schließen" data-close-modal>' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="cookie-modal__body">' +
          '<div class="cookie-option">' +
            '<div class="cookie-option__info">' +
              '<strong>Essenzielle Cookies</strong>' +
              '<p>Erforderlich für Grundfunktionen der Website (z.&nbsp;B. Speicherung Ihrer Cookie-Auswahl). Keine Opt-Out-Möglichkeit.</p>' +
            '</div>' +
            '<label class="toggle toggle--disabled">' +
              '<input type="checkbox" checked disabled>' +
              '<span class="toggle__slider"></span>' +
            '</label>' +
          '</div>' +
          '<div class="cookie-option">' +
            '<div class="cookie-option__info">' +
              '<strong>Statistik / Analytics</strong>' +
              '<p>Hilft uns, die Nutzung der Website anonym auszuwerten und zu verbessern. Nur nach Ihrer Einwilligung.</p>' +
            '</div>' +
            '<label class="toggle">' +
              '<input type="checkbox" id="cookie-analytics">' +
              '<span class="toggle__slider"></span>' +
            '</label>' +
          '</div>' +
          '<div class="cookie-option">' +
            '<div class="cookie-option__info">' +
              '<strong>Marketing</strong>' +
              '<p>Ermöglicht personalisierte Inhalte und externe Werbedienste. Nur nach Ihrer Einwilligung.</p>' +
            '</div>' +
            '<label class="toggle">' +
              '<input type="checkbox" id="cookie-marketing">' +
              '<span class="toggle__slider"></span>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div class="cookie-modal__footer">' +
          '<button type="button" class="btn btn--outline" id="cookie-save-selection">Auswahl speichern</button>' +
          '<button type="button" class="btn btn--accent" id="cookie-accept-all-modal">Alle akzeptieren</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    bindModalEvents(modal);
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('cookie-banner--hidden');
      setTimeout(function () { banner.remove(); }, 400);
    }
  }

  function openSettings() {
    var modal = document.getElementById('cookie-settings-modal');
    if (!modal) return;
    var consent = getConsent() || defaultConsent;
    var analytics = document.getElementById('cookie-analytics');
    var marketing = document.getElementById('cookie-marketing');
    if (analytics) analytics.checked = !!consent.analytics;
    if (marketing) marketing.checked = !!consent.marketing;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('cookie-modal--open');
    document.body.style.overflow = 'hidden';
  }

  function closeSettings() {
    var modal = document.getElementById('cookie-settings-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('cookie-modal--open');
    document.body.style.overflow = '';
  }

  function acceptAll() {
    saveConsent({ essential: true, analytics: true, marketing: true });
    hideBanner();
    closeSettings();
  }

  function acceptEssentialOnly() {
    saveConsent({ essential: true, analytics: false, marketing: false });
    hideBanner();
    closeSettings();
  }

  function saveSelection() {
    var analytics = document.getElementById('cookie-analytics');
    var marketing = document.getElementById('cookie-marketing');
    saveConsent({
      essential: true,
      analytics: analytics ? analytics.checked : false,
      marketing: marketing ? marketing.checked : false
    });
    hideBanner();
    closeSettings();
  }

  function bindBannerEvents(banner) {
    banner.querySelector('#cookie-accept-all').addEventListener('click', acceptAll);
    banner.querySelector('#cookie-essential-only').addEventListener('click', acceptEssentialOnly);
    banner.querySelector('#cookie-settings-open').addEventListener('click', openSettings);
  }

  function bindModalEvents(modal) {
    modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeSettings);
    });
    modal.querySelector('#cookie-accept-all-modal').addEventListener('click', acceptAll);
    modal.querySelector('#cookie-save-selection').addEventListener('click', saveSelection);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('cookie-modal--open')) {
        closeSettings();
      }
    });
  }

  function init() {
    createSettingsModal();
    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      createBanner();
    }

    document.querySelectorAll('[data-cookie-settings]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openSettings();
      });
    });
  }

  window.HolzVisionCookieConsent = {
    openSettings: openSettings,
    getConsent: getConsent
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
