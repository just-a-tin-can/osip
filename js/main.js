/* ============================================================
   SawahKu — shared behaviour
   - header, bottom tab bar (phones) and footer on every page
   - Bahasa Melayu / English switch (Malay is the default)
   - small helpers (dates, numbers, WhatsApp share, voice)
   Everything is on window.APP for the page scripts to use.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Safe localStorage (can fail in private mode) ---------- */
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    getJSON: function (k, fallback) {
      try { return JSON.parse(window.localStorage.getItem(k) || "null") || fallback; } catch (e) { return fallback; }
    },
    setJSON: function (k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  /* ---------- Language ---------- */
  var LANG_KEY = "sk-language";                          // saved only when the visitor picks a language
  var lang = store.get(LANG_KEY) === "en" ? "en" : "ms";  // Bahasa Melayu by default

  function t(key, params) {
    var dict = window.I18N[lang] || {};
    var text = dict[key];
    if (text === undefined) text = window.I18N.en[key] !== undefined ? window.I18N.en[key] : key;
    if (params) Object.keys(params).forEach(function (p) { text = text.split("{" + p + "}").join(params[p]); });
    return text;
  }

  function applyTranslations(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var n = el.getAttribute("data-n");
      el.textContent = t(el.getAttribute("data-i18n"), n ? { n: n } : null);
    });
    root.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    root.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    root.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
  }

  function setLang(next, remember) {
    lang = next === "en" ? "en" : "ms";
    if (remember) store.set(LANG_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations();
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  /* ---------- Formatting helpers ---------- */
  function locale() { return lang === "ms" ? "ms-MY" : "en-GB"; }
  function formatDate(d, opts) {
    try { return d.toLocaleDateString(locale(), opts || { day: "numeric", month: "short", year: "numeric" }); }
    catch (e) { return d.toDateString(); }
  }
  function formatNumber(n, digits) {
    try { return n.toLocaleString(locale(), { maximumFractionDigits: digits === undefined ? 1 : digits }); }
    catch (e) { return String(Math.round(n * 10) / 10); }
  }
  function parseISODate(s) {
    if (!s) return null;
    var p = String(s).split("-");
    if (p.length !== 3) return null;
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return isNaN(d.getTime()) ? null : d;
  }
  function toISODate(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function addDays(d, n) { var c = new Date(d.getFullYear(), d.getMonth(), d.getDate()); c.setDate(c.getDate() + n); return c; }
  function escapeHTML(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // "5 minit lalu" / "5 min ago"
  function timeAgo(iso) {
    var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return t("time.now");
    if (s < 3600) return t("time.min", { n: Math.floor(s / 60) });
    if (s < 86400) return t("time.hour", { n: Math.floor(s / 3600) });
    if (s < 86400 * 30) return t("time.day", { n: Math.floor(s / 86400) });
    return formatDate(new Date(iso));
  }
  // WhatsApp link that lets the farmer forward something to friends
  function waShare(text) { return "https://wa.me/?text=" + encodeURIComponent(text); }

  /* ---------- Icons (simple line icons) ---------- */
  function svg(paths, fill) {
    return '<svg viewBox="0 0 24 24" fill="' + (fill ? "currentColor" : "none") + '" stroke="' + (fill ? "none" : "currentColor") +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  }
  var ICONS = {
    home: svg('<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    weather: svg('<circle cx="8" cy="8" r="3"/><path d="M8 2v1.5M2 8h1.5M3.8 3.8l1 1M12.2 3.8l-1 1"/><path d="M9 20h9a4 4 0 0 0 0-8 6 6 0 0 0-10.5 2.5A3 3 0 0 0 9 20z"/>'),
    ask: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.2M12 16.5h.01"/>'),
    crop: svg('<path d="M12 21V10"/><path d="M12 14c-4-.5-6-3-6-7 4 .3 6 3 6 7zM12 11c4-.5 6-3 6-7-4 .3-6 3-6 7z"/><path d="M8 21h8"/>'),
    forum: svg('<path d="M17 8h2a2 2 0 0 1 2 2v9l-3-2h-7a2 2 0 0 1-2-2v-1"/><path d="M15 4H5a2 2 0 0 0-2 2v9l3-2h9a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>'),
    flask: svg('<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>'),
    calendar: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17.5h2"/>'),
    drop: svg('<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'),
    ban: svg('<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>'),
    external: svg('<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'),
    agency: svg('<path d="M3 10 12 4l9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>'),
    book: svg('<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15.5H5.5A1.5 1.5 0 0 0 4 20z"/><path d="M4 20a1.5 1.5 0 0 0 1.5 1.5H20v-3"/><path d="M8.5 7.5h7M8.5 11h5"/>'),
    print: svg('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'),
    next: svg('<path d="M9 6l6 6-6 6"/>'),
    check: svg('<path d="M4 12.5l5 5L20 6.5"/>'),
    stop: svg('<rect x="6" y="6" width="12" height="12" rx="2"/>'),
    mic: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
    send: svg('<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/>'),
    speaker: svg('<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    chevron: svg('<path d="m6 9 6 6 6-6"/>'),
    up: svg('<path d="m6 14 6-6 6 6"/>'),
    comment: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
    back: svg('<path d="M15 18l-6-6 6-6"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    warn: svg('<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>'),
    camera: svg('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>'
  };

  var LOGO =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<rect width="48" height="48" rx="12" fill="#1f5a33"/>' +
    '<circle cx="34" cy="13" r="5" fill="#e3a92b"/>' +
    '<path d="M8 38c5-4 10-6 16-6s11 2 16 6" stroke="#9fd18f" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M22 33V17" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M22 24c-4-1-6-4-6-8 4 .4 6 3.5 6 8zM22 21c4-1 6-4 6-8-4 .4-6 3.5-6 8z" fill="#fff"/>' +
    "</svg>";

  /* ---------- Header, tab bar, footer ---------- */
  var PAGES = [
    { id: "home", href: "index.html", key: "nav.home", icon: "home" },
    { id: "plan", href: "jadual.html", key: "nav.plan", icon: "calendar" },
    { id: "weather", href: "weather.html", key: "nav.weather", icon: "weather" },
    { id: "ask", href: "ask.html", key: "nav.ask", icon: "ask" },
    { id: "crop", href: "crop.html", key: "nav.crop", icon: "crop" },
    { id: "forum", href: "forum.html", key: "nav.forum", tabKey: "nav.forumShort", icon: "forum" },
    { id: "learn", href: "learn.html", key: "nav.learn", icon: "book" },
    { id: "info", href: "info.html", key: "nav.info", icon: "agency" }
  ];

  function buildHeader(page) {
    var header = document.getElementById("site-header");
    if (!header) return;
    header.className = "site-header";
    header.innerHTML =
      '<div class="container">' +
      '<a class="brand" href="index.html">' + LOGO + '<span><span data-i18n="app.name"></span><small data-i18n="app.tag"></small></span></a>' +
      '<nav class="nav" aria-label="Menu">' + PAGES.map(function (p) {
        return '<a href="' + p.href + '"' + (p.id === page ? ' aria-current="page"' : "") + ">" + ICONS[p.icon] + '<span data-i18n="' + p.key + '"></span></a>';
      }).join("") + "</nav>" +
      '<div class="lang-toggle" role="group" aria-label="Bahasa / Language">' +
      '<button type="button" data-lang="ms" aria-pressed="false">BM</button>' +
      '<button type="button" data-lang="en" aria-pressed="false">EN</button>' +
      "</div></div>";
    header.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); });
    });

    // Big icon bar at the bottom of the screen on phones
    var bar = document.createElement("nav");
    bar.className = "tabbar";
    bar.setAttribute("aria-label", "Menu");
    bar.innerHTML = PAGES.map(function (p) {
      return '<a href="' + p.href + '"' + (p.id === page ? ' aria-current="page"' : "") + ">" + ICONS[p.icon] + '<span data-i18n="' + (p.tabKey || p.key) + '"></span></a>';
    }).join("");
    document.body.appendChild(bar);
  }

  function buildFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="container">' +
      '<div><h4 data-i18n="app.name"></h4><p data-i18n="footer.about"></p></div>' +
      '<div><h4 data-i18n="footer.help"></h4><ul>' +
      '<li><a href="https://www.kpkm.gov.my" target="_blank" rel="noopener">KPKM</a> · <a href="https://www.doa.gov.my" target="_blank" rel="noopener" data-i18n="footer.doa"></a></li>' +
      '<li><a href="https://www.mardi.gov.my" target="_blank" rel="noopener" data-i18n="footer.mardi"></a> · <a href="https://www.met.gov.my" target="_blank" rel="noopener" data-i18n="footer.met"></a></li>' +
      '<li><a href="https://www.lpp.gov.my" target="_blank" rel="noopener">LPP</a> · <a href="https://publicinfobanjir.water.gov.my" target="_blank" rel="noopener">Public InfoBanjir</a></li>' +
      '<li><a class="footer-more" href="info.html" data-i18n="footer.allAgencies"></a></li>' +
      '<li><a class="footer-more" href="info.html#faq" data-i18n="footer.faq"></a></li>' +
      "</ul></div>" +
      '<p class="fine">&copy; ' + new Date().getFullYear() + ' <span data-i18n="app.name"></span>. <span data-i18n="footer.fine"></span></p>' +
      "</div>";
  }

  /* ---------- Voice: speak instead of type, and read answers aloud ---------- */
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var speech = {
    canListen: !!Recognition,
    canSpeak: "speechSynthesis" in window,
    // Starts listening; calls onText(finalText) once, and onEnd() when stopped.
    listen: function (onText, onEnd, onError) {
      if (!Recognition) { if (onError) onError("unsupported"); return null; }
      var rec = new Recognition();
      rec.lang = lang === "ms" ? "ms-MY" : "en-GB";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = function (e) { onText(e.results[0][0].transcript); };
      rec.onerror = function (e) { if (onError) onError(e.error); };
      rec.onend = function () { if (onEnd) onEnd(); };
      try { rec.start(); } catch (e) { if (onError) onError("start"); return null; }
      return rec;
    },
    // Reads text aloud. Long text is split into sentences, because some
    // browsers stop speaking after about 15 seconds of one utterance.
    speak: function (text, onEnd) {
      if (!this.canSpeak) { if (onEnd) onEnd(); return; }
      window.speechSynthesis.cancel();
      var want = lang === "ms" ? ["ms", "id"] : ["en"];
      var voices = window.speechSynthesis.getVoices();
      var v = voices.filter(function (vo) { return want.some(function (w) { return vo.lang.toLowerCase().indexOf(w) === 0; }); })[0];
      var parts = String(text).match(/[^.!?\n]+[.!?]*/g) || [String(text)];
      parts = parts.map(function (s) { return s.trim(); }).filter(Boolean);
      parts.forEach(function (part, i) {
        var u = new SpeechSynthesisUtterance(part);
        if (v) u.voice = v;
        u.lang = v ? v.lang : (lang === "ms" ? "ms-MY" : "en-GB");
        u.rate = 0.95;
        if (i === parts.length - 1 && onEnd) { u.onend = onEnd; u.onerror = onEnd; }
        window.speechSynthesis.speak(u);
      });
    },
    stop: function () { if (this.canSpeak) window.speechSynthesis.cancel(); }
  };


  /* ---------- Gentle animations ----------
     Cards, tiles and list items fade and slide in as they scroll into
     view. Everything is shown at once if the visitor prefers less
     motion or the browser is old. */
  var REVEAL_SEL = ".card, .tile, .book, .agency, .post, .day, .faq, .crop, .water-stage, .row-link, .banned, .agency-quick, .continue, .why-banner, .callout, .chem, .scan, .tabs, .news";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = (!reduceMotion && "IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px 8% 0px", threshold: 0 }) : null;

  function reveal(root) {
    if (!io) return;
    (root || document).querySelectorAll(REVEAL_SEL + ", .reveal").forEach(function (el) {
      if (el.classList.contains("is-in") || el.hasAttribute("data-revealed") || el.closest(".site-header, .tabbar, .site-footer, .msg")) return;
      el.setAttribute("data-revealed", "");
      el.classList.add("reveal");
      // small stagger for items in the same row/list
      var i = 0, sib = el;
      while ((sib = sib.previousElementSibling) && i < 4) i++;
      el.style.setProperty("--d", (i * 30) + "ms");
      io.observe(el);
    });
  }

  function watchNewContent() {
    if (!io || !("MutationObserver" in window)) return;
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; reveal(document.querySelector("main") || document); });
    }).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
  }

  /* ---------- Public API ---------- */
  window.APP = {
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
    escapeHTML: escapeHTML,
    timeAgo: timeAgo,
    waShare: waShare,
    icons: ICONS,
    speech: speech,
    reveal: reveal
  };

  document.addEventListener("DOMContentLoaded", function () {
    buildHeader(document.body.getAttribute("data-page"));
    buildFooter();
    setLang(lang);
    if (io) document.documentElement.classList.add("anim");
    setTimeout(function () { reveal(); watchNewContent(); }, 0);
  });
})();
