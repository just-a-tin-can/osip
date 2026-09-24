/* ============================================================
   ADP Sytech — shared behaviour
   - builds the header and footer on every page
   - English / Malay switching
   - small helpers used by the other scripts
   ============================================================ */

(function () {
  "use strict";

  var STORAGE_KEY = "adp-language"; // saved only when the visitor picks a language

  /* ---------- Safe localStorage (can fail in private mode) ---------- */
  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Language ---------- */
  // Bahasa Melayu is the default; English only if the visitor chose it.
  var lang = store.get(STORAGE_KEY) === "en" ? "en" : "ms";

  // Translate a key, replacing {placeholders} with values from params.
  function t(key, params) {
    var dict = window.I18N[lang] || {};
    var text = dict[key];
    if (text === undefined) text = (window.I18N.en[key] !== undefined ? window.I18N.en[key] : key);
    if (params) {
      Object.keys(params).forEach(function (p) {
        text = text.split("{" + p + "}").join(params[p]);
      });
    }
    return text;
  }

  function applyTranslations(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var n = el.getAttribute("data-n");
      el.textContent = t(el.getAttribute("data-i18n"), n ? { n: n } : null);
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    root.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
  }

  function setLang(next, remember) {
    lang = next === "en" ? "en" : "ms";
    if (remember) store.set(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "ms" ? "ms" : "en";
    applyTranslations();
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    // Let page scripts re-draw anything built with JavaScript.
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  /* ---------- Formatting helpers ---------- */
  function locale() { return lang === "ms" ? "ms-MY" : "en-GB"; }

  function formatDate(date, opts) {
    try {
      return date.toLocaleDateString(locale(), opts || { day: "numeric", month: "short", year: "numeric" });
    } catch (e) {
      return date.toDateString();
    }
  }

  // Parse "YYYY-MM-DD" as a local date (not UTC).
  function parseISODate(str) {
    if (!str) return null;
    var p = str.split("-");
    if (p.length !== 3) return null;
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return isNaN(d.getTime()) ? null : d;
  }

  function toISODate(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function addDays(d, n) {
    var copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    copy.setDate(copy.getDate() + n);
    return copy;
  }

  function daysBetween(a, b) {
    var ms = new Date(b.getFullYear(), b.getMonth(), b.getDate()) - new Date(a.getFullYear(), a.getMonth(), a.getDate());
    return Math.round(ms / 86400000);
  }

  // Field size units → hectares. 1 relung ≈ 0.2877 ha, 1 acre ≈ 0.4047 ha.
  var UNIT_TO_HA = { ha: 1, relung: 0.2877, acre: 0.4047 };
  function toHectares(value, unit) {
    var v = parseFloat(value);
    if (!isFinite(v) || v <= 0) return 0;
    return v * (UNIT_TO_HA[unit] || 1);
  }

  function formatNumber(n, digits) {
    try {
      return n.toLocaleString(locale(), { maximumFractionDigits: digits === undefined ? 1 : digits });
    } catch (e) {
      return String(Math.round(n * 10) / 10);
    }
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Header & footer ---------- */
  var LOGO =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<rect width="48" height="48" rx="12" fill="#1f5a33"/>' +
    '<path d="M10 36c4-6 8-9 14-9s10 3 14 9" stroke="#e3a92b" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M24 27V16" stroke="#9fd18f" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M24 20c-3-1-5-3-5-6 3 0 5 2 5 6zM24 18c3-1 5-3 5-6-3 0-5 2-5 6z" fill="#9fd18f"/>' +
    '<rect x="15" y="8" width="18" height="3" rx="1.5" fill="#fff"/>' +
    '<circle cx="13" cy="9.5" r="3" fill="none" stroke="#fff" stroke-width="1.6"/>' +
    '<circle cx="35" cy="9.5" r="3" fill="none" stroke="#fff" stroke-width="1.6"/>' +
    "</svg>";

  var BOOK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4"/></svg>';

  function buildHeader(page) {
    var header = document.getElementById("site-header");
    if (!header) return;
    function link(href, key, id) {
      return '<a href="' + href + '" data-i18n="' + key + '"' + (page === id ? ' aria-current="page"' : "") + "></a>";
    }
    header.className = "site-header";
    header.innerHTML =
      '<div class="container">' +
      '<a class="brand" href="index.html">' + LOGO +
      '<span>ADP Sytech<small data-i18n="brand.tag"></small></span></a>' +
      '<nav class="nav" id="main-nav">' +
      link("index.html", "nav.home", "home") +
      link("guide.html", "nav.guide", "guide") +
      link("booking.html", "nav.booking", "booking").replace("<a ", '<a class="nav__book" ') +
      "</nav>" +
      (page === "booking" ? "" :
        '<a class="nav-cta" href="booking.html">' + BOOK_ICON + '<span data-i18n="nav.booking"></span></a>') +
      '<div class="lang-toggle" role="group" aria-label="Language / Bahasa">' +
      '<button type="button" data-lang="en" aria-pressed="false">EN</button>' +
      '<button type="button" data-lang="ms" aria-pressed="false">BM</button>' +
      "</div>" +
      '<button class="menu-btn" type="button" aria-controls="main-nav" aria-expanded="false" data-i18n-aria="nav.menu"><span></span></button>' +
      "</div>";

    header.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); });
    });

    var menuBtn = header.querySelector(".menu-btn");
    var nav = header.querySelector(".nav");
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Big "Book" bar fixed to the bottom of the screen on phones.
  function buildMobileBookBar(page) {
    if (page === "booking") return;
    var bar = document.createElement("a");
    bar.className = "mobile-book-bar";
    bar.href = "booking.html";
    bar.innerHTML = BOOK_ICON + '<span data-i18n="nav.bookNow"></span>';
    document.body.appendChild(bar);
    document.body.classList.add("has-book-bar");

    // On the home page the hero already has a big Book button,
    // so only slide the bar in once the visitor scrolls past it.
    var heroBtn = document.querySelector(".hero .btn--primary");
    if (heroBtn && "IntersectionObserver" in window) {
      bar.classList.add("is-hidden");
      new IntersectionObserver(function (entries) {
        bar.classList.toggle("is-hidden", entries[0].isIntersecting || entries[0].boundingClientRect.top > 0);
      }).observe(heroBtn);
    }
  }

  function buildFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="container">' +
      '<div><h4>ADP Sytech</h4><p data-i18n="footer.about"></p></div>' +
      '<div><h4 data-i18n="footer.links"></h4><ul>' +
      '<li><a href="index.html" data-i18n="nav.home"></a></li>' +
      '<li><a href="guide.html" data-i18n="nav.guide"></a></li>' +
      '<li><a href="booking.html" data-i18n="nav.booking"></a></li>' +
      "</ul></div>" +
      '<div><h4 data-i18n="footer.contact"></h4><ul>' +
      '<li data-i18n="footer.phone"></li>' +
      '<li data-i18n="footer.email"></li>' +
      '<li data-i18n="footer.area"></li>' +
      "</ul></div>" +
      '<p class="fine">&copy; ' + new Date().getFullYear() + ' ADP Sytech. <span data-i18n="footer.fine"></span></p>' +
      "</div>";
  }

  /* ---------- Public API ---------- */
  window.ADP = {
    t: t,
    getLang: function () { return lang; },
    setLang: setLang,
    apply: applyTranslations,
    store: store,
    formatDate: formatDate,
    formatNumber: formatNumber,
    parseISODate: parseISODate,
    toISODate: toISODate,
    addDays: addDays,
    daysBetween: daysBetween,
    toHectares: toHectares,
    escapeHTML: escapeHTML,
    bookIcon: function () { return BOOK_ICON; }
  };

  /* ---------- Start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    buildHeader(document.body.getAttribute("data-page"));
    buildFooter();
    buildMobileBookBar(document.body.getAttribute("data-page"));
    setLang(lang);
  });
})();
