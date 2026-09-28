/* ============================================================
   SawahKu — Crop info page (pests, diseases, weeds)
   Data is in cropdata.js. Links: crop.html#bph opens that entry,
   crop.html?sym=yellow shows everything with yellow leaves,
   crop.html#banned opens the banned-pesticide tab,
   crop.html#scan jumps to the photo scan.
   ============================================================ */

(function () {
  "use strict";

  var els = {};
  var state = { type: "all", sym: "", q: "", tab: "pests" };

  function matches(c) {
    if (state.type !== "all" && c.type !== state.type) return false;
    if (state.sym && c.sym.indexOf(state.sym) === -1) return false;
    if (!state.q) return true;
    var q = state.q.toLowerCase();
    var hay = [c.ms.name, c.en.name, c.ms.signs, c.en.signs].concat(c.keys).join(" ").toLowerCase();
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function thumb(c) {
    // Real photo, falls back to the emoji if it can't load (offline)
    return '<span class="crop__thumb"><img src="' + c.photo.src.replace("width=640", "width=160") + '" alt="" loading="lazy" ' +
      'onerror="this.parentNode.classList.add(\'is-fallback\');this.remove()"><span class="crop__emoji" aria-hidden="true">' + c.emoji + "</span></span>";
  }

  function entryHTML(c, open) {
    var lang = APP.getLang();
    var d = c[lang];
    var askUrl = "ask.html?q=" + encodeURIComponent(d.name);
    var forumUrl = "forum.html?new=1&cat=pest&title=" + encodeURIComponent(d.name + ": ");
    var share = APP.waShare(d.name + " — " + d.signs + "\n" + APP.t("crop.action") + ": " + d.action);
    return '<details class="crop crop--' + c.type + ' reveal" id="' + c.id + '"' + (open ? " open" : "") + ">" +
      "<summary>" + thumb(c) +
      '<span class="crop__title"><strong>' + d.name + "</strong><small>" + APP.t("crop." + c.type) + " · " + d.alt + "</small></span>" +
      '<span class="crop__chev">' + APP.icons.chevron + "</span></summary>" +
      '<div class="crop__body">' +
      '<figure class="crop__photo"><img src="' + c.photo.src + '" alt="' + APP.escapeHTML(d.caption) + '" loading="lazy" onerror="this.closest(\'figure\').remove()">' +
      "<figcaption>" + d.caption + ' <a href="' + c.photo.page + '" target="_blank" rel="noopener">' + APP.t("crop.photo") + ": " + c.photo.credit + ", " + c.photo.license + "</a></figcaption></figure>" +
      "<dl>" +
      "<dt>" + APP.t("crop.when") + "</dt><dd>" + d.when + "</dd>" +
      "<dt>" + APP.t("crop.signs") + "</dt><dd>" + d.signs + "</dd>" +
      "<dt>" + APP.t("crop.threshold") + "</dt><dd>" + d.threshold + "</dd>" +
      "</dl>" +
      '<div class="chem"><h4>' + APP.icons.flask + APP.t("crop.chem") + "</h4><ul>" + d.chem.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
      '<p class="chem__note">' + APP.t("crop.chemNote") + "</p></div>" +
      (d.warn ? '<div class="callout callout--danger">' + APP.icons.warn + "<span>" + d.warn + "</span></div>" : "") +
      "<dl>" +
      "<dt>" + APP.t("crop.action") + "</dt><dd>" + d.action + "</dd>" +
      "<dt>" + APP.t("crop.prevent") + "</dt><dd>" + d.prevent + "</dd></dl>" +
      '<div class="crop__actions">' +
      '<a class="btn btn--outline btn--sm" href="' + askUrl + '">' + APP.icons.ask + APP.t("common.askAi") + "</a>" +
      '<a class="btn btn--outline btn--sm" href="' + forumUrl + '">' + APP.icons.forum + APP.t("common.askCommunity") + "</a>" +
      '<a class="wa-link" href="' + share + '" target="_blank" rel="noopener">' + APP.icons.whatsapp + APP.t("common.shareWa") + "</a>" +
      "</div></div></details>";
  }

  function render(openId) {
    var list = CROP.filter(matches);
    els.count.textContent = APP.t("crop.count", { n: list.length });
    els.list.innerHTML = list.length ? list.map(function (c) { return entryHTML(c, c.id === openId); }).join("") : emptyHTML();
    APP.reveal(els.list);
    if (openId) {
      var el = document.getElementById(openId);
      if (el) { el.classList.add("is-flash"); setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80); }
    }
  }

  // Nothing found: point to the DOA website, the AI and the community
  function emptyHTML() {
    var q = state.q;
    return '<div class="card crop-empty">' +
      "<h3>" + APP.t("crop.empty") + "</h3>" +
      "<p>" + APP.t("crop.emptyDoa") + "</p>" +
      '<div class="crop__actions">' +
      '<a class="btn btn--green btn--sm" href="https://www.doa.gov.my" target="_blank" rel="noopener">' + APP.icons.search + APP.t("crop.emptyDoaBtn") + "</a>" +
      '<a class="btn btn--outline btn--sm" href="ask.html' + (q ? "?q=" + encodeURIComponent(q) : "") + '">' + APP.icons.ask + APP.t("common.askAi") + "</a>" +
      '<a class="btn btn--outline btn--sm" href="forum.html?new=1&cat=pest' + (q ? "&title=" + encodeURIComponent(q) : "") + '">' + APP.icons.forum + APP.t("common.askCommunity") + "</a>" +
      "</div></div>";
  }

  function renderFilters() {
    els.types.innerHTML = ["all", "pest", "disease", "weed"].map(function (t) {
      return '<button type="button" class="chip" data-type="' + t + '" aria-pressed="' + (state.type === t) + '">' + APP.t("crop." + t) + "</button>";
    }).join("");
    els.syms.innerHTML = CROP_SYMPTOMS.map(function (s) {
      return '<button type="button" class="chip" data-sym="' + s + '" aria-pressed="' + (state.sym === s) + '">' + APP.t("crop.sym." + s) + "</button>";
    }).join("") + (state.sym ? '<button type="button" class="link-btn" data-sym="">' + APP.t("crop.clear") + "</button>" : "");
  }

  /* ---------- Banned pesticides & fertiliser warnings ---------- */
  function renderBanned() {
    var lang = APP.getLang();
    els.banned.innerHTML =
      '<div class="banned-intro reveal"><span class="banned-intro__icon">' + APP.icons.ban + "</span><div><h2>" + APP.t("ban.title") + "</h2><p>" + APP.t("ban.lead") + "</p></div></div>" +
      '<h3 class="reveal">' + APP.t("ban.paddyTitle") + "</h3>" +
      '<div class="banned-grid">' + BANNED.paddy.map(function (b) {
        return '<div class="banned reveal"><div class="banned__head"><strong>' + b.ai + "</strong>" +
          '<span class="banned__year">' + (b.never ? APP.t("ban.never") : b.year !== "—" ? APP.t("ban.since", { y: b.year }) : APP.t("ban.banned")) + "</span>" +
          "</div><p>" + b[lang] + "</p></div>";
      }).join("") + "</div>" +
      '<details class="card others reveal"><summary>' + APP.t("ban.othersTitle") + APP.icons.chevron + "</summary><p>" + BANNED.others + "</p></details>" +
      '<h3 class="reveal">' + APP.t("ban.restrictedTitle") + "</h3>" +
      '<div class="banned-grid">' + BANNED.restricted.map(function (b) {
        return '<div class="banned banned--amber reveal"><div class="banned__head"><strong>' + b.ai + "</strong></div><p>" + b[lang] + "</p></div>";
      }).join("") + "</div>" +
      '<div class="card reveal" style="margin-top:18px"><h3 style="margin-top:0">' + APP.icons.search + " " + APP.t("ban.checkTitle") + "</h3>" +
      "<p>" + APP.t("ban.checkBody") + "</p>" +
      '<div class="crop__actions" style="margin-top:8px"><a class="btn btn--green btn--sm" href="http://www.portal.doa.gov.my/racunberdaftar/" target="_blank" rel="noopener">' + APP.t("crop.regCheckLink") + "</a>" +
      '<a class="btn btn--outline btn--sm" href="' + BANNED.source + '" target="_blank" rel="noopener">' + APP.t("ban.fullList") + "</a></div></div>" +
      '<h3 class="reveal">' + APP.t("ban.fertTitle") + "</h3>" +
      '<div class="card reveal">' + APP.t("ban.fertBody") + "</div>" +
      '<p class="note">' + APP.t("ban.sourceNote") + "</p>";
    APP.reveal(els.banned);
  }

  function setTab(tab, scroll) {
    state.tab = tab;
    if (scroll) {
      var top = els.tabs.getBoundingClientRect().top + window.pageYOffset - 80;
      if (window.pageYOffset > top) window.scrollTo(0, top);
    }
    els.tabs.querySelectorAll("[data-tab]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === tab ? "true" : "false"); });
    els.pestsPane.hidden = tab !== "pests";
    els.banned.hidden = tab !== "banned";
    if (tab === "banned") renderBanned();
  }

  document.addEventListener("DOMContentLoaded", function () {
    els.list = document.getElementById("crop-list");
    if (!els.list) return;
    els.types = document.getElementById("crop-types");
    els.syms = document.getElementById("crop-syms");
    els.count = document.getElementById("crop-count");
    els.search = document.getElementById("crop-search");
    els.tabs = document.getElementById("crop-tabs");
    els.pestsPane = document.getElementById("crop-pests");
    els.banned = document.getElementById("crop-banned");

    var q = new URLSearchParams(location.search);
    if (q.get("sym") && CROP_SYMPTOMS.indexOf(q.get("sym")) !== -1) state.sym = q.get("sym");
    renderFilters();
    var hash = location.hash.slice(1);
    if (hash === "banned") { render(); setTab("banned"); }
    else render(hash === "scan" ? "" : hash);

    els.tabs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]");
      if (b) setTab(b.getAttribute("data-tab"), true);
    });
    els.types.addEventListener("click", function (e) {
      var b = e.target.closest("[data-type]");
      if (!b) return;
      state.type = b.getAttribute("data-type");
      renderFilters(); render();
    });
    els.syms.addEventListener("click", function (e) {
      var b = e.target.closest("[data-sym]");
      if (!b) return;
      var s = b.getAttribute("data-sym");
      state.sym = state.sym === s ? "" : s;
      renderFilters(); render();
    });
    els.search.addEventListener("input", function () { state.q = els.search.value.trim(); render(); });
    window.addEventListener("hashchange", function () {
      var h = location.hash.slice(1);
      if (h === "banned") { setTab("banned", true); return; }
      if (h === "scan") return;
      setTab("pests");
      state = { type: "all", sym: "", q: "", tab: "pests" }; els.search.value = ""; renderFilters(); render(h);
    });
    document.addEventListener("langchange", function () { renderFilters(); render(); if (state.tab === "banned") renderBanned(); });
  });
})();
