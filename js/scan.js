/* ============================================================
   SawahKu — "Scan your crop" (photo → AI identifies pest/disease)
   Lives on crop.html (#scan). Uses SK_AI (ai.js) → Cloudflare
   Worker → AI vision model (Gemini, Claude or ChatGPT). Without the Worker it explains
   that the scan needs the AI connection and offers other routes.
   ============================================================ */

(function () {
  "use strict";

  var els = {};
  var lastResult = null;

  function cropById(id) { return CROP.filter(function (c) { return c.id === id; })[0]; }

  function confidenceLabel(c) {
    var k = { high: "scan.confHigh", medium: "scan.confMed", low: "scan.confLow" }[c] || "scan.confLow";
    return '<span class="conf conf--' + (c || "low") + '">' + APP.t(k) + "</span>";
  }

  function renderResult(r) {
    lastResult = r;
    var lang = APP.getLang();
    var c = r && r.id ? cropById(r.id) : null;
    var html;
    if (c) {
      var d = c[lang];
      html = '<div class="scan-result scan-result--found">' +
        '<div class="scan-result__head"><img src="' + c.photo.src.replace("width=640", "width=160") + '" alt="" onerror="this.remove()">' +
        "<div><small>" + APP.t("scan.likely") + "</small><h3>" + d.name + "</h3>" + confidenceLabel(r.confidence) + "</div></div>" +
        (r.signs ? "<p><b>" + APP.t("scan.seen") + ":</b> " + APP.escapeHTML(r.signs) + "</p>" : "") +
        (r.advice ? "<p><b>" + APP.t("scan.advice") + ":</b> " + APP.escapeHTML(r.advice) + "</p>" : "") +
        '<a class="btn btn--green" href="#' + c.id + '" data-open="' + c.id + '">' + APP.t("scan.more") + " " + APP.icons.next + "</a></div>";
    } else if (r && r.id === "healthy") {
      html = '<div class="scan-result scan-result--ok"><h3>' + APP.icons.check + " " + APP.t("scan.healthy") + "</h3>" +
        (r.advice ? "<p>" + APP.escapeHTML(r.advice) + "</p>" : "") + "</div>";
    } else {
      html = '<div class="scan-result"><h3>' + APP.t("scan.unsure") + "</h3>" +
        (r && r.advice ? "<p>" + APP.escapeHTML(r.advice) + "</p>" : "") +
        "<p>" + APP.t("scan.unsureTip") + "</p>" +
        '<div class="crop__actions"><a class="btn btn--outline btn--sm" href="forum.html?new=1&cat=pest">' + APP.icons.forum + APP.t("common.askCommunity") + "</a></div></div>";
    }
    els.result.innerHTML = html + '<p class="note">' + APP.t("scan.disclaimer") + "</p>";
  }

  function notConnected() {
    els.result.innerHTML = '<div class="scan-result"><h3>' + APP.t("scan.offTitle") + "</h3><p>" + APP.t("scan.offBody") + "</p>" +
      '<div class="crop__actions"><a class="btn btn--outline btn--sm" href="#crop-syms">' + APP.t("scan.offSymptoms") + "</a>" +
      '<a class="btn btn--outline btn--sm" href="forum.html?new=1&cat=pest">' + APP.icons.forum + APP.t("scan.offForum") + "</a></div></div>";
  }

  function onFile(file) {
    if (!file) return;
    APP.speech && APP.speech.stop && APP.speech.stop();
    SK_AI.resizeImage(file, 1024).then(function (dataUrl) {
      els.preview.hidden = false;
      els.previewImg.src = dataUrl;
      if (!SK_AI.enabled()) { notConnected(); return; }
      els.result.innerHTML = '<div class="scan-loading"><span class="spinner" aria-hidden="true"></span>' + APP.t("scan.working") + "</div>";
      els.preview.classList.add("is-scanning");
      return SK_AI.scan(dataUrl, APP.getLang()).then(function (r) {
        els.preview.classList.remove("is-scanning");
        renderResult(r);
      });
    }).catch(function (err) {
      els.preview.classList.remove("is-scanning");
      var busy = err && err.message === "busy";
      var offline = !busy && navigator.onLine === false;
      els.result.innerHTML = '<div class="scan-result"><h3>' + APP.t(busy ? "scan.busy" : "scan.error") + "</h3><p>" +
        APP.t(busy ? "scan.busyBody" : offline ? "scan.errorBody" : "scan.errorServer") + "</p>" +
        (!busy && !offline && err && err.message ? '<p class="note">' + APP.escapeHTML(String(err.message).slice(0, 160)) + "</p>" : "") + "</div>";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    els.input = document.getElementById("scan-input");
    if (!els.input || !window.SK_AI) return;
    els.preview = document.getElementById("scan-preview");
    els.previewImg = els.preview.querySelector("img");
    els.result = document.getElementById("scan-result");
    [els.input, document.getElementById("scan-gallery")].forEach(function (inp) {
      if (inp) inp.addEventListener("change", function () { onFile(inp.files && inp.files[0]); inp.value = ""; });
    });
    els.result.addEventListener("click", function (e) {
      var a = e.target.closest("[data-open]");
      if (!a) return;
      e.preventDefault();
      location.hash = a.getAttribute("data-open");
    });
    document.addEventListener("langchange", function () { if (lastResult) renderResult(lastResult); });
    if (location.hash === "#scan") setTimeout(function () { document.getElementById("scan").scrollIntoView({ block: "start" }); }, 100);
  });
})();
