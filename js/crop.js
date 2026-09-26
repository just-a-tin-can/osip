/* ============================================================
   SawahKu — Crop info page (pests, diseases, weeds)
   Data is in cropdata.js. Links: crop.html#bph opens that entry,
   crop.html?sym=yellow shows everything with yellow leaves.
   ============================================================ */

(function () {
  "use strict";

  var els = {};
  var state = { type: "all", sym: "", q: "" };

  function matches(c) {
    if (state.type !== "all" && c.type !== state.type) return false;
    if (state.sym && c.sym.indexOf(state.sym) === -1) return false;
    if (!state.q) return true;
    var q = state.q.toLowerCase();
    var hay = [c.ms.name, c.en.name, c.ms.signs, c.en.signs].concat(c.keys).join(" ").toLowerCase();
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function render(openId) {
    var lang = APP.getLang();
    var list = CROP.filter(matches);
    els.count.textContent = APP.t("crop.count", { n: list.length });
    els.list.innerHTML = list.length ? list.map(function (c) {
      var d = c[lang];
      var askUrl = "ask.html?q=" + encodeURIComponent(d.name);
      var forumUrl = "forum.html?new=1&cat=pest&title=" + encodeURIComponent(d.name + ": ");
      var share = APP.waShare(d.name + " — " + d.signs + "\n" + APP.t("crop.action") + ": " + d.action);
      return '<details class="crop crop--' + c.type + '" id="' + c.id + '"' + (c.id === openId ? " open" : "") + ">" +
        '<summary><span class="crop__emoji" aria-hidden="true">' + c.emoji + '</span>' +
        '<span class="crop__title"><strong>' + d.name + "</strong><small>" + APP.t("crop." + c.type) + " · " + d.alt + "</small></span>" +
        '<span class="crop__chev">' + APP.icons.chevron + "</span></summary>" +
        '<div class="crop__body"><dl>' +
        "<dt>" + APP.t("crop.when") + "</dt><dd>" + d.when + "</dd>" +
        "<dt>" + APP.t("crop.signs") + "</dt><dd>" + d.signs + "</dd>" +
        "<dt>" + APP.t("crop.action") + "</dt><dd>" + d.action + "</dd>" +
        "<dt>" + APP.t("crop.prevent") + "</dt><dd>" + d.prevent + "</dd></dl>" +
        '<div class="crop__actions">' +
        '<a class="btn btn--outline btn--sm" href="' + askUrl + '">' + APP.icons.ask + APP.t("common.askAi") + "</a>" +
        '<a class="btn btn--outline btn--sm" href="' + forumUrl + '">' + APP.icons.forum + APP.t("common.askCommunity") + "</a>" +
        '<a class="wa-link" href="' + share + '" target="_blank" rel="noopener">' + APP.icons.whatsapp + APP.t("common.shareWa") + "</a>" +
        "</div></div></details>";
    }).join("") : emptyHTML();

    if (openId) {
      var el = document.getElementById(openId);
      if (el) { el.classList.add("is-flash"); setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50); }
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

  document.addEventListener("DOMContentLoaded", function () {
    els.list = document.getElementById("crop-list");
    if (!els.list) return;
    els.types = document.getElementById("crop-types");
    els.syms = document.getElementById("crop-syms");
    els.count = document.getElementById("crop-count");
    els.search = document.getElementById("crop-search");

    var q = new URLSearchParams(location.search);
    if (q.get("sym") && CROP_SYMPTOMS.indexOf(q.get("sym")) !== -1) state.sym = q.get("sym");
    renderFilters();
    render(location.hash.slice(1));

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
    window.addEventListener("hashchange", function () { state = { type: "all", sym: "", q: "" }; els.search.value = ""; renderFilters(); render(location.hash.slice(1)); });
    document.addEventListener("langchange", function () { renderFilters(); render(); });
  });
})();
