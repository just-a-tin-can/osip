/* ============================================================
   SawahKu — E-books: library, reader and home preview
   Books are in ebooks.js.
   Links: learn.html#dron opens a book, learn.html#dron/3 opens chapter 3.
   Reading progress and text size are saved on this phone only.
   ============================================================ */

(function () {
  "use strict";

  var PROGRESS_KEY = "sk-ebook-progress";   // { bookId: { ch: 2, read: [1, 2] } }
  var LAST_KEY = "sk-ebook-last";
  var SIZE_KEY = "sk-ebook-size";
  var SIZES = ["1.05rem", "1.2rem", "1.4rem"];

  var COVER_ICONS = {
    sprout: '<path d="M12 21V10"/><path d="M12 14c-4-.5-6-3-6-7 4 .3 6 3 6 7zM12 11c4-.5 6-3 6-7-4 .3-6 3-6 7z"/><path d="M8 21h8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    drone: '<rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9.5 9.5 7.3 7.3M14.5 9.5l2.2-2.2M9.5 14.5l-2.2 2.2M14.5 14.5l2.2 2.2"/><circle cx="5.5" cy="5.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z"/><path d="M8.5 12l2.5 2.5 4.5-4.5"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    hand: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z"/><path d="M12 8v5M12 16h.01"/>',
    grain: '<path d="M12 21V8"/><path d="M12 8c-1.5-1-2-2.5-2-4 1.5.3 2 1.8 2 4zm0 0c1.5-1 2-2.5 2-4-1.5.3-2 1.8-2 4z"/><path d="M12 13c-2-.5-3-2-3-4 2 .2 3 1.8 3 4zm0 0c2-.5 3-2 3-4-2 .2-3 1.8-3 4zM12 18c-2-.5-3-2-3-4 2 .2 3 1.8 3 4zm0 0c2-.5 3-2 3-4-2 .2-3 1.8-3 4z"/>',
    note: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'
  };

  function coverIcon(b) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (COVER_ICONS[b.icon] || COVER_ICONS.note) + "</svg>";
  }

  function find(id) { return window.EBOOKS.filter(function (b) { return b.id === id; })[0]; }
  function progress() { return APP.store.getJSON(PROGRESS_KEY, {}); }
  function bookProgress(id) { return progress()[id] || { ch: 0, read: [] }; }
  function isDone(b) { return bookProgress(b.id).read.length >= b.chapters.length; }

  function markRead(id, ch) {
    var all = progress();
    var p = all[id] || { ch: 1, read: [] };
    p.ch = ch;
    if (p.read.indexOf(ch) === -1) p.read.push(ch);
    all[id] = p;
    APP.store.setJSON(PROGRESS_KEY, all);
    APP.store.set(LAST_KEY, id);
  }

  function actionLabel(b) {
    var p = bookProgress(b.id);
    if (isDone(b)) return APP.t("learn.reread");
    if (p.ch > 0) return APP.t("learn.resume", { n: p.ch });
    return APP.t("learn.read");
  }
  function bookHref(b) {
    var p = bookProgress(b.id);
    return "learn.html#" + b.id + (p.ch > 0 && !isDone(b) ? "/" + p.ch : "");
  }
  function metaText(b) {
    var d = b[APP.getLang()];
    return APP.t("learn.meta", { n: b.chapters.length, m: d.mins });
  }

  function coverHTML(b, small) {
    return '<span class="book-cover' + (small ? " book-cover--sm" : "") + '" style="--c:' + b.color + '">' + coverIcon(b) + "</span>";
  }

  /* =========================================================
     LIBRARY
     ========================================================= */
  function renderLibrary(els) {
    var lang = APP.getLang();
    var lastId = APP.store.get(LAST_KEY);
    var last = lastId && find(lastId);
    if (last && !isDone(last)) {
      var lp = bookProgress(last.id);
      els.cont.hidden = false;
      els.cont.innerHTML = '<a class="continue" href="' + bookHref(last) + '">' + coverHTML(last, true) +
        '<span class="continue__text"><small>' + APP.t("learn.continue") + "</small><strong>" + last[lang].title + "</strong>" +
        "<span>" + APP.t("learn.chapterOf", { n: lp.ch, total: last.chapters.length }) + "</span></span>" +
        '<span class="continue__go">' + APP.icons.next + "</span></a>";
    } else {
      els.cont.hidden = true;
      els.cont.innerHTML = "";
    }

    els.books.innerHTML = window.EBOOKS.map(function (b) {
      var d = b[lang];
      var p = bookProgress(b.id);
      var pct = Math.round(p.read.length / b.chapters.length * 100);
      return '<a class="book" href="' + bookHref(b) + '">' +
        '<span class="book__cover" style="--c:' + b.color + '">' + coverIcon(b) + "<strong>" + d.title + "</strong></span>" +
        '<span class="book__body"><span class="book__sub">' + d.sub + "</span>" +
        '<span class="book__meta">' + metaText(b) + "</span>" +
        (p.read.length ? '<span class="book__bar" aria-hidden="true"><span style="width:' + pct + '%"></span></span>' : "") +
        '<span class="book__action">' + (isDone(b) ? APP.icons.check : "") + actionLabel(b) + "</span></span></a>";
    }).join("");
  }

  /* =========================================================
     READER
     ========================================================= */
  var speaking = false;

  function sizeIndex() {
    var i = parseInt(APP.store.get(SIZE_KEY), 10);
    return isNaN(i) ? 1 : Math.max(0, Math.min(SIZES.length - 1, i));
  }

  function stopSpeaking(els) {
    speaking = false;
    APP.speech.stop();
    if (els && els.listen) setListenButton(els.listen);
  }
  function setListenButton(btn) {
    btn.innerHTML = (speaking ? APP.icons.stop : APP.icons.speaker) + "<span>" + APP.t(speaking ? "learn.stop" : "learn.listen") + "</span>";
    btn.setAttribute("aria-pressed", speaking ? "true" : "false");
  }

  function renderReader(els, b, ch) {
    var lang = APP.getLang();
    var d = b[lang];
    var total = b.chapters.length;
    var c = b.chapters[ch - 1][lang];
    markRead(b.id, ch);
    var p = bookProgress(b.id);

    var toc = b.chapters.map(function (cc, i) {
      var n = i + 1;
      var read = p.read.indexOf(n) !== -1;
      return '<li><a href="#' + b.id + "/" + n + '"' + (n === ch ? ' aria-current="true"' : "") + ">" +
        '<span class="toc__n">' + (read && n !== ch ? APP.icons.check : n) + "</span>" + cc[lang][0] + "</a></li>";
    }).join("");

    var prev = ch > 1 ? '<a class="btn btn--outline" href="#' + b.id + "/" + (ch - 1) + '">' + APP.icons.back + APP.t("learn.prev") + "</a>" : "<span></span>";
    var next = ch < total
      ? '<a class="btn btn--green" href="#' + b.id + "/" + (ch + 1) + '">' + APP.t("learn.next") + APP.icons.next + "</a>"
      : '<a class="btn btn--primary" href="#' + b.id + '/done">' + APP.icons.check + APP.t("learn.finish") + "</a>";

    els.reader.innerHTML =
      '<a class="back-link" href="learn.html">' + APP.icons.back + APP.t("learn.all") + "</a>" +
      '<div class="reader-head">' + coverHTML(b) + '<div><h2>' + d.title + "</h2><p>" + APP.t("learn.chapterOf", { n: ch, total: total }) + "</p></div></div>" +
      '<div class="progress" aria-hidden="true"><span style="width:' + Math.round(ch / total * 100) + '%"></span></div>' +
      '<div class="reader-tools">' +
      (APP.speech.canSpeak ? '<button type="button" class="btn btn--outline btn--sm" id="lb-listen"></button>' : "") +
      '<button type="button" class="btn btn--outline btn--sm btn--square" id="lb-smaller" aria-label="' + APP.t("learn.smaller") + '" title="' + APP.t("learn.smaller") + '"><span aria-hidden="true" style="font-size:0.85rem">A−</span></button>' +
      '<button type="button" class="btn btn--outline btn--sm btn--square" id="lb-bigger" aria-label="' + APP.t("learn.bigger") + '" title="' + APP.t("learn.bigger") + '"><span aria-hidden="true" style="font-size:1.15rem">A+</span></button>' +
      '<button type="button" class="btn btn--outline btn--sm" id="lb-print">' + APP.icons.print + "<span>" + APP.t("learn.print") + "</span></button>" +
      "</div>" +
      '<details class="toc"><summary>' + APP.t("learn.contents") + " (" + total + ")" + APP.icons.chevron + "</summary><ol>" + toc + "</ol></details>" +
      '<article class="reader-text" id="lb-text" style="font-size:' + SIZES[sizeIndex()] + '"><h3>' + ch + ". " + c[0] + "</h3>" + c[1] + "</article>" +
      '<div class="reader-nav">' + prev + next + "</div>" +
      '<a class="wa-link" href="' + APP.waShare(d.title + " — " + c[0] + "\n" + location.href.split("#")[0] + "#" + b.id + "/" + ch) + '" target="_blank" rel="noopener">' + APP.icons.whatsapp + APP.t("common.shareWa") + "</a>" +
      '<p class="note">' + APP.t("learn.note") + "</p>";

    // Whole book, only shown when printing
    els.print.innerHTML = "<h1>" + d.title + "</h1><p>" + d.sub + "</p>" +
      b.chapters.map(function (cc, i) { return "<h2>" + (i + 1) + ". " + cc[lang][0] + "</h2>" + cc[lang][1]; }).join("") +
      "<p><small>SawahKu · " + APP.t("learn.note") + "</small></p>";

    els.listen = document.getElementById("lb-listen");
    if (els.listen) {
      setListenButton(els.listen);
      els.listen.addEventListener("click", function () {
        if (speaking) { stopSpeaking(els); return; }
        speaking = true;
        setListenButton(els.listen);
        var text = document.getElementById("lb-text").innerText;
        APP.speech.speak(text, function () { speaking = false; setListenButton(els.listen); });
      });
    }
    document.getElementById("lb-smaller").addEventListener("click", function () { changeSize(-1); });
    document.getElementById("lb-bigger").addEventListener("click", function () { changeSize(1); });
    document.getElementById("lb-print").addEventListener("click", function () { window.print(); });
    updateSizeButtons();
  }

  function changeSize(step) {
    var i = Math.max(0, Math.min(SIZES.length - 1, sizeIndex() + step));
    APP.store.set(SIZE_KEY, String(i));
    var text = document.getElementById("lb-text");
    if (text) text.style.fontSize = SIZES[i];
    updateSizeButtons();
  }
  function updateSizeButtons() {
    var i = sizeIndex();
    var s = document.getElementById("lb-smaller"), g = document.getElementById("lb-bigger");
    if (s) s.disabled = i === 0;
    if (g) g.disabled = i === SIZES.length - 1;
  }

  function renderDone(els, b) {
    var lang = APP.getLang();
    var others = window.EBOOKS.filter(function (x) { return x.id !== b.id && !isDone(x); }).slice(0, 3);
    if (!others.length) others = window.EBOOKS.filter(function (x) { return x.id !== b.id; }).slice(0, 3);
    els.reader.innerHTML =
      '<a class="back-link" href="learn.html">' + APP.icons.back + APP.t("learn.all") + "</a>" +
      '<div class="card done-card">' + coverHTML(b) + "<h2>" + b[lang].title + "</h2><p>" + APP.t("learn.finished") + "</p></div>" +
      '<h3 style="margin-top:24px">' + APP.t("learn.more") + "</h3>" +
      '<div class="card">' + others.map(rowLink).join("") + "</div>";
  }

  function rowLink(b) {
    var d = b[APP.getLang()];
    return '<a class="row-link row-link--book" href="' + bookHref(b) + '">' + coverHTML(b, true) +
      "<span><strong>" + d.title + "</strong><small>" + metaText(b) + " · " + actionLabel(b) + "</small></span></a>";
  }

  /* =========================================================
     ROUTING
     ========================================================= */
  function route(els) {
    stopSpeaking(els);
    var h = decodeURIComponent(location.hash.slice(1));
    if (els.hero) els.hero.hidden = !!h;
    if (!h) {
      els.list.hidden = false;
      els.reader.hidden = true;
      els.print.innerHTML = "";
      renderLibrary(els);
      return;
    }
    var parts = h.split("/");
    var b = find(parts[0]);
    els.list.hidden = true;
    els.reader.hidden = false;
    if (!b) {
      els.reader.innerHTML = '<a class="back-link" href="learn.html">' + APP.icons.back + APP.t("learn.all") + '</a><p class="empty">' + APP.t("learn.notFound") + "</p>";
    } else if (parts[1] === "done") {
      renderDone(els, b);
    } else {
      var ch = parseInt(parts[1], 10);
      if (isNaN(ch) || ch < 1) ch = 1;
      if (ch > b.chapters.length) ch = b.chapters.length;
      renderReader(els, b, ch);
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.EBOOKS) return;

    // Home page preview
    var home = document.getElementById("home-learn");
    if (home) {
      var draw = function () {
        var lastId = APP.store.get(LAST_KEY);
        var list = window.EBOOKS.slice();
        var last = lastId && find(lastId);
        if (last && !isDone(last)) list = [last].concat(list.filter(function (x) { return x !== last; }));
        home.innerHTML = list.slice(0, 3).map(rowLink).join("");
      };
      draw();
      document.addEventListener("langchange", draw);
    }

    var app = document.getElementById("learn-app");
    if (!app) return;
    var els = {
      list: document.getElementById("lb-list"),
      cont: document.getElementById("lb-continue"),
      books: document.getElementById("lb-books"),
      reader: document.getElementById("lb-reader"),
      print: document.getElementById("lb-print"),
      hero: document.getElementById("lb-hero")
    };
    route(els);
    window.addEventListener("hashchange", function () { route(els); });
    document.addEventListener("langchange", function () { route(els); });
    window.addEventListener("pagehide", function () { APP.speech.stop(); });
  });
})();
