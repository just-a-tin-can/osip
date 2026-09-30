/* ============================================================
   SawahKu — connection to the AI Worker (Gemini, Claude or ChatGPT)
   Used by the Ask AI chat (chat.js) and the photo scan (scan.js).
   If no Worker is set in config.js, SK_AI.enabled() is false and
   the pages fall back to the built-in offline answers.
   ============================================================ */

(function () {
  "use strict";

  function endpoint() {
    var e = (window.SK_CONFIG && window.SK_CONFIG.aiEndpoint) || "";
    return e.replace(/\/+$/, "");
  }

  function post(path, body, timeoutMs) {
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 30000) : null;
    return fetch(endpoint() + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || j.error) throw new Error(j.error || ("HTTP " + r.status));
        return j;
      });
    }, function (err) { if (timer) clearTimeout(timer); throw err; });
  }

  // Shrink a photo on the phone before sending (saves data and cost)
  function resizeImage(file, maxSide) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var s = Math.min(1, (maxSide || 1024) / Math.max(img.width, img.height));
          var c = document.createElement("canvas");
          c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Live connection indicator ----------
     Asks the Worker "are you there?" (GET /). This does not use any
     AI quota. The answer is kept for 5 minutes in this browser tab. */
  var STATUS_KEY = "sk-ai-status";
  var NAMES = { gemini: "Google Gemini", claude: "Claude", openai: "ChatGPT" };
  var current = null;

  function readCache() {
    try { var c = JSON.parse(sessionStorage.getItem(STATUS_KEY) || "null"); return c && Date.now() - c.t < 300000 ? c : null; } catch (e) { return null; }
  }
  function setStatus(st) {
    current = st;
    try { sessionStorage.setItem(STATUS_KEY, JSON.stringify({ state: st.state, provider: st.provider || "", t: Date.now() })); } catch (e) { /* ignore */ }
    paint();
  }
  function paint() {
    document.querySelectorAll("[data-ai-status]").forEach(function (el) {
      var st = current || { state: "checking" };
      el.hidden = false;
      el.className = "ai-status ai-status--" + st.state;
      var name = NAMES[st.provider] || st.provider || "AI";
      el.innerHTML = '<i aria-hidden="true"></i><span>' + APP.t("ai." + st.state, { p: name }) + "</span>";
      el.setAttribute("role", "status");
    });
  }
  function checkStatus(force) {
    if (!endpoint()) { setStatus({ state: "none" }); return; }
    var cached = !force && readCache();
    if (cached) { current = cached; paint(); return; }
    current = { state: "checking" }; paint();
    var ctrl = "AbortController" in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 10000) : null;
    fetch(endpoint() + "/", { signal: ctrl ? ctrl.signal : undefined }).then(function (r) { return r.json(); }).then(function (j) {
      if (timer) clearTimeout(timer);
      setStatus(j && j.ok && j.provider && j.provider !== "none" ? { state: "on", provider: j.provider } : { state: "off" });
    }).catch(function () { if (timer) clearTimeout(timer); setStatus({ state: "off" }); });
  }
  // After a real request: remember if the AI worked, failed or ran out of quota
  function noteResult(err) {
    if (!err) { if (!current || current.state !== "on") checkStatus(true); return; }
    if (err.message === "busy") setStatus({ state: "busy", provider: current && current.provider });
    else if (err.message === "overloaded") setStatus({ state: "overload", provider: current && current.provider });
    else if (err.name === "TypeError" || err.name === "AbortError") setStatus({ state: "off" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector("[data-ai-status]")) checkStatus(false);
  });
  document.addEventListener("langchange", paint);

  window.SK_AI = {
    enabled: function () { return !!endpoint(); },
    status: function () { return current; },
    checkStatus: checkStatus,
    // messages: [{role: "user"|"assistant", content: "..."}]
    chat: function (messages, lang) {
      return post("/chat", { lang: lang, messages: messages.slice(-10) }, 45000)
        .then(function (j) { noteResult(null); return j.reply || ""; }, function (e) { noteResult(e); throw e; });
    },
    // image: data URL (JPEG). Returns {id, confidence, name, signs, advice}
    scan: function (image, lang) {
      return post("/scan", { lang: lang, image: image }, 60000)
        .then(function (j) { noteResult(null); return j; }, function (e) { noteResult(e); throw e; });
    },
    resizeImage: resizeImage,
    // Very small, safe formatter for AI text: escape, then **bold** and "- " lists
    format: function (text) {
      var esc = APP.escapeHTML(String(text || "").trim());
      var lines = esc.split(/\n/);
      var out = [], list = null;
      lines.forEach(function (line) {
        var l = line.trim();
        var m = l.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
        if (m) { if (!list) { list = []; } list.push(m[1]); return; }
        if (list) { out.push("<ul><li>" + list.join("</li><li>") + "</li></ul>"); list = null; }
        if (l) out.push("<p>" + l + "</p>");
      });
      if (list) out.push("<ul><li>" + list.join("</li><li>") + "</li></ul>");
      return out.join("").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    }
  };
})();
