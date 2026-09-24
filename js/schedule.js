/* ============================================================
   ADP Sytech — fertiliser / pesticide / water schedule
   Source: Department of Agriculture Malaysia "Rice Check"
   guideline for direct-seeded paddy (~110–120 day varieties).
   ============================================================ */

(function () {
  "use strict";

  var DRONE_LOAD_KG = 25; // DJI Agras T20P spreading payload

  /* ---------- Schedule data ----------
     from / to  = days after sowing (HLT)
     items      = what to apply; rate in kg per hectare (null = follow label)
  */
  var SCHEDULE = [
    // Fertiliser
    { id: "f1", type: "fert", from: 15, to: 15, stage: "veg", why: "why.f1",
      items: [{ p: "prod.compound", rate: 140 }, { p: "prod.tsp", rate: 57 }, { p: "prod.mop", rate: 42 }] },
    { id: "f2", type: "fert", from: 25, to: 30, stage: "till", why: "why.f2",
      items: [{ p: "prod.urea", rate: 80 }] },
    { id: "f3", type: "fert", from: 45, to: 50, stage: "panicle", why: "why.f3",
      items: [{ p: "prod.compound", rate: 107 }, { p: "prod.additional", rate: 100 }, { p: "prod.urea", rate: 12 }] },
    { id: "f4", type: "fert", from: 65, to: 70, stage: "flower", why: "why.f4",
      items: [{ p: "prod.additional", rate: 50 }, { p: "prod.urea", rate: 20 }] },

    // Pesticide & weeds (dose always from the product label)
    { id: "p1", type: "pest", from: 0, to: 5, stage: "germ", why: "why.p1", items: [{ p: "prod.preHerb", rate: null }] },
    { id: "p2", type: "pest", from: 10, to: 20, stage: "estab", why: "why.p2", items: [{ p: "prod.postHerb", rate: null }] },
    { id: "p3", type: "pest", from: 20, to: 60, stage: "till", why: "why.p3", items: [{ p: "prod.insect", rate: null }] },
    { id: "p4", type: "pest", from: 55, to: 75, stage: "flower", why: "why.p4", items: [{ p: "prod.fungi", rate: null }] },

    // Water
    { id: "w0", type: "water", from: 0, to: 7, stage: "germ", why: "why.w0", items: [{ p: "prod.water0" }] },
    { id: "w1", type: "water", from: 7, to: 14, stage: "estab", why: "why.w1", items: [{ p: "prod.water1" }] },
    { id: "w2", type: "water", from: 15, to: 40, stage: "till", why: "why.w2", items: [{ p: "prod.water2" }] },
    { id: "w3", type: "water", from: 40, to: 99, stage: "fill", why: "why.w3", items: [{ p: "prod.water3" }] },
    { id: "w4", type: "water", from: 100, to: 105, stage: "ripen", why: "why.w4", items: [{ p: "prod.water4" }] },

    // Harvest
    { id: "h1", type: "harvest", from: 110, to: 120, stage: "harvest", why: "why.h", items: [{ p: "prod.harvest" }] }
  ];

  /* ---------- Growth stage & water target by day ---------- */
  function stageForDay(d) {
    if (d < 0) return "prep";
    if (d <= 7) return "germ";
    if (d <= 14) return "estab";
    if (d <= 24) return "veg";
    if (d <= 44) return "till";
    if (d <= 64) return "panicle";
    if (d <= 79) return "flower";
    if (d <= 99) return "fill";
    if (d <= 109) return "ripen";
    return "harvest";
  }

  function waterForDay(d) {
    if (d < 0 || d <= 7) return ADP.t("weather.wsSat");
    if (d <= 14) return "3–5 cm";
    if (d <= 40) return "5–7 cm";
    if (d <= 99) return "5–10 cm";
    return ADP.t("weather.wsDrain");
  }

  /* ---------- State ---------- */
  var els = {};
  var filter = "all";

  function getInputs() {
    var sow = ADP.parseISODate(els.sow.value);
    var size = els.size.value;
    var unit = els.unit.value;
    return { sow: sow, size: size, unit: unit, ha: ADP.toHectares(size, unit) };
  }

  function saveInputs() {
    ADP.store.set("adp-sow", els.sow.value);
    ADP.store.set("adp-size", els.size.value);
    ADP.store.set("adp-unit", els.unit.value);
  }

  /* ---------- Rendering ---------- */
  function typeLabel(type) {
    if (type === "harvest") return ADP.t("stage.harvest");
    return ADP.t("guide.type." + type);
  }

  function tagClass(type) {
    return { fert: "tag--fert", pest: "tag--pest", water: "tag--water", harvest: "tag--next" }[type];
  }

  function dayRange(row) {
    return row.from === row.to
      ? ADP.t("guide.day", { a: row.from })
      : ADP.t("guide.days", { a: row.from, b: row.to });
  }

  function dateRange(row, sow) {
    if (!sow) return "—";
    var opts = { day: "numeric", month: "short" };
    var a = ADP.formatDate(ADP.addDays(sow, row.from), opts);
    if (row.from === row.to) return a;
    return a + " – " + ADP.formatDate(ADP.addDays(sow, row.to), opts);
  }

  function amountCell(row, ha) {
    if (row.type === "pest") return '<span class="purpose">' + ADP.t("guide.label") + "</span>";
    if (row.type !== "fert") return '<span class="purpose">—</span>';
    return row.items.map(function (it) {
      var perHa = ADP.t("guide.perHa", { rate: it.rate });
      if (!ha) return '<div class="amount">' + perHa + "</div>";
      var kg = it.rate * ha;
      var loads = Math.max(1, Math.ceil(kg / DRONE_LOAD_KG));
      return '<div class="amount" style="margin-bottom:6px">' + ADP.formatNumber(kg, kg < 10 ? 1 : 0) + " kg" +
        '<span class="bags">' + perHa + " · " + ADP.t("guide.loads", { n: loads }) + "</span></div>";
    }).join("");
  }

  function bookLink(row, inp) {
    if (row.type !== "fert" && row.type !== "pest") return "";
    var params = new URLSearchParams();
    params.set("service", row.type);
    if (inp.sow) {
      var target = ADP.addDays(inp.sow, row.from);
      var tomorrow = ADP.addDays(new Date(), 1);
      if (target < tomorrow) target = tomorrow;
      params.set("date", ADP.toISODate(target));
      params.set("sow", ADP.toISODate(inp.sow));
    }
    if (inp.ha) { params.set("size", inp.size); params.set("unit", inp.unit); }
    return '<div><a class="btn btn--primary book-btn" href="booking.html?' +
      params.toString() + '">' + ADP.bookIcon() + "<span>" + ADP.t("guide.book") + "</span></a></div>";
  }

  function render() {
    var inp = getInputs();
    var today = new Date();
    var day = inp.sow ? ADP.daysBetween(inp.sow, today) : null;

    var rows = SCHEDULE
      .filter(function (r) { return filter === "all" || r.type === filter; })
      .slice()
      .sort(function (a, b) { return a.from - b.from || a.to - b.to; });

    // Which rows are done / happening now or next?
    var nextFrom = null;
    if (day !== null) {
      rows.forEach(function (r) {
        if (r.to >= day && (nextFrom === null || r.from < nextFrom)) nextFrom = r.from;
      });
    }

    els.body.innerHTML = rows.map(function (r) {
      var status = "";
      var cls = "";
      if (day !== null) {
        if (r.to < day) { status = "done"; }
        else if (r.from <= day && day <= r.to) { status = "now"; cls = "is-next"; }
        else if (r.from === nextFrom) { status = "next"; cls = "is-next"; }
      }
      var statusTag = status
        ? ' <span class="tag ' + ({ done: "tag--done", now: "tag--now", next: "tag--next" }[status]) + '">' + ADP.t("guide.status." + status) + "</span>"
        : "";
      var products = r.items.map(function (it) { return "<div style=\"margin-bottom:6px\">" + ADP.t(it.p) + "</div>"; }).join("");

      function td(labelKey, html, extraClass) {
        return '<td' + (extraClass ? ' class="' + extraClass + '"' : "") +
          (labelKey ? ' data-label="' + ADP.t(labelKey) + '"' : "") + ">" + html + "</td>";
      }
      return '<tr class="' + cls + '"' + (status === "done" ? ' style="opacity:.6"' : "") + ">" +
        td(null, '<div class="stage">' + dayRange(r) + '</div><div class="purpose">' + ADP.t("stage." + r.stage) + "</div>") +
        td("guide.th.date", dateRange(r, inp.sow) + statusTag + (status === "done" ? "" : bookLink(r, inp)), "date") +
        td(null, '<span class="tag ' + tagClass(r.type) + '">' + typeLabel(r.type) + "</span>", "type-cell") +
        td("guide.th.product", products) +
        td("guide.th.amount", amountCell(r, inp.ha)) +
        td("guide.th.purpose", ADP.t(r.why), "purpose") +
        "</tr>";
    }).join("");

    // Status line above the table
    var msg = "";
    if (day !== null) {
      if (day < 0) msg = ADP.t("guide.dayBefore", { days: -day });
      else if (day >= 110) msg = ADP.t("guide.dayAfter", { day: day });
      else msg = ADP.t("guide.dayNow", { day: day, stage: ADP.t("stage." + stageForDay(day)).toLowerCase() });

      var nextFert = SCHEDULE.filter(function (r) { return r.type === "fert" && r.to >= day; })[0];
      if (nextFert && day >= -30) {
        var d = ADP.addDays(inp.sow, Math.max(nextFert.from, day));
        msg += " " + ADP.t("guide.nextUp", {
          task: ADP.t("guide.type.fert") + " (" + ADP.t("stage." + nextFert.stage).toLowerCase() + ")",
          date: ADP.formatDate(d, { weekday: "short", day: "numeric", month: "short" })
        });
      }
    }
    els.status.textContent = msg;
    renderTiming(inp, day);

    document.dispatchEvent(new CustomEvent("schedulechange", { detail: { day: day } }));
  }

  /* ---------- Fertiliser window countdown ---------- */
  function renderTiming(inp, day) {
    var card = document.getElementById("timing-card");
    if (!card) return;
    if (day === null) { card.hidden = true; return; }
    card.hidden = false;
    card.classList.remove("is-open", "is-done");

    var fert = SCHEDULE.filter(function (r) { return r.type === "fert"; });
    var next = fert.filter(function (r) { return r.to >= day; })[0];
    var main = document.getElementById("timing-main");
    var bookSlot = document.getElementById("timing-book");
    var opts = { weekday: "short", day: "numeric", month: "short" };

    if (!next) {
      card.classList.add("is-done");
      main.textContent = ADP.t("timing.done");
      bookSlot.innerHTML = "";
      return;
    }
    var stage = ADP.t("stage." + next.stage).toLowerCase();
    if (day >= next.from) {
      card.classList.add("is-open");
      var left = next.to - day;
      main.textContent = left === 0
        ? ADP.t("timing.openToday", { stage: stage })
        : ADP.t("timing.open", { stage: stage, n: left, date: ADP.formatDate(ADP.addDays(inp.sow, next.to), opts) });
    } else {
      var from = ADP.addDays(inp.sow, next.from);
      var to = ADP.addDays(inp.sow, next.to);
      var range = next.from === next.to
        ? ADP.formatDate(from, opts)
        : ADP.formatDate(from, opts) + " – " + ADP.formatDate(to, opts);
      main.textContent = ADP.t("timing.soon", { stage: stage, n: next.from - day, range: range });
    }
    bookSlot.innerHTML = bookLink(next, inp)
      .replace("book-btn", "btn--lg btn--glow btn--block")
      .replace(ADP.t("guide.book"), ADP.t("timing.book"));
  }

  /* ---------- Calendar file (.ics) with fertiliser reminders ---------- */
  function icsEscape(text) {
    return String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  }
  function icsDate(d) { return ADP.toISODate(d).replace(/-/g, ""); }

  function downloadICS() {
    var inp = getInputs();
    if (!inp.sow) return;
    var stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ADP Sytech//Paddy Guide//EN", "CALSCALE:GREGORIAN"];

    SCHEDULE.filter(function (r) { return r.type === "fert"; }).forEach(function (r) {
      var details = r.items.map(function (it) {
        var amount = inp.ha ? ADP.formatNumber(it.rate * inp.ha, 0) + " kg" : ADP.t("guide.perHa", { rate: it.rate });
        return ADP.t(it.p) + ": " + amount;
      }).join("\n");
      lines.push(
        "BEGIN:VEVENT",
        "UID:adp-" + r.id + "-" + icsDate(inp.sow) + "@adpsytech.example",
        "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + icsDate(ADP.addDays(inp.sow, r.from)),
        "DTEND;VALUE=DATE:" + icsDate(ADP.addDays(inp.sow, r.to + 1)),
        "SUMMARY:" + icsEscape(ADP.t("ics.title", { stage: ADP.t("stage." + r.stage) })),
        "DESCRIPTION:" + icsEscape(details + "\n\n" + ADP.t(r.why)),
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:" + icsEscape(ADP.t("ics.remind")),
        "TRIGGER:-PT15H",
        "END:VALARM",
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");

    var blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "adp-sytech-fertiliser-dates.ics";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  /* ---------- Public helpers for weather.js ---------- */
  ADP.schedule = {
    stageForDay: stageForDay,
    waterForDay: waterForDay,
    currentDay: function () {
      var sow = els.sow ? ADP.parseISODate(els.sow.value) : null;
      return sow ? ADP.daysBetween(sow, new Date()) : null;
    }
  };

  /* ---------- Start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    els.sow = document.getElementById("sow-date");
    els.size = document.getElementById("field-size");
    els.unit = document.getElementById("field-unit");
    els.body = document.getElementById("schedule-body");
    els.status = document.getElementById("day-status");

    // Restore last-used values, otherwise default to a crop sown 20 days ago
    var savedSow = ADP.store.get("adp-sow");
    els.sow.value = savedSow || ADP.toISODate(ADP.addDays(new Date(), -20));
    els.size.value = ADP.store.get("adp-size") || "1";
    els.unit.value = ADP.store.get("adp-unit") || "ha";

    [els.sow, els.size, els.unit].forEach(function (el) {
      el.addEventListener("input", function () { saveInputs(); render(); });
      el.addEventListener("change", function () { saveInputs(); render(); });
    });

    document.querySelectorAll("#type-tabs button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filter = btn.getAttribute("data-filter");
        document.querySelectorAll("#type-tabs button").forEach(function (b) {
          b.setAttribute("aria-selected", b === btn ? "true" : "false");
        });
        render();
      });
    });

    document.getElementById("print-btn").addEventListener("click", function () { window.print(); });
    document.getElementById("ics-btn").addEventListener("click", downloadICS);
    document.addEventListener("langchange", render);

    render();
  });
})();
