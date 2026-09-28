/* ============================================================
   SawahKu — "Jadual sawah saya" (my field schedule)
   The farmer enters the sowing date and field size; the app works
   out when to fertilise, the water level, when to check for pests
   and when to harvest, with dates and amounts for their field.

   Source: Jabatan Pertanian "Rice Check Padi 2022" — direct-seeded
   paddy, 95–105-day varieties (the common varieties in IADA BLS).

   Used on:
   - jadual.html  full schedule (#plan-app)
   - index.html   small card (#plan-mini)
   - weather.html highlights today's water level (.water-stages)
   Saved only on this phone (localStorage).
   ============================================================ */

(function () {
  "use strict";

  var KEYS = { sow: "sk-sow", size: "sk-size", unit: "sk-unit" };
  var HA_PER = { ha: 1, acre: 0.4047, relung: 0.2878 };

  /* ---------- Growth stages (approximate, 95–105-day variety) ---------- */
  var STAGES = [
    { to: 14, ms: "Anak benih", en: "Seedling" },
    { to: 40, ms: "Beranak", en: "Tillering" },
    { to: 64, ms: "Bunting", en: "Panicle forming" },
    { to: 75, ms: "Berbunga", en: "Flowering" },
    { to: 94, ms: "Mengisi & masak", en: "Grain filling & ripening" },
    { to: 999, ms: "Sedia tuai", en: "Ready to harvest" }
  ];

  /* ---------- Water level by day (Rice Check 2022) ---------- */
  var WATER = [
    { to: 6, idx: 0, ms: "tanah tepu, tiada air bertakung", en: "saturated soil, no standing water" },
    { to: 14, idx: 1, ms: "3–5 cm", en: "3–5 cm" },
    { to: 39, idx: 2, ms: "5 cm", en: "5 cm" },
    { to: 84, idx: 3, ms: "5–10 cm", en: "5–10 cm" },
    { to: 999, idx: 4, ms: "keringkan sawah untuk tuai", en: "drain the field for harvest" }
  ];

  /* ---------- The schedule ----------
     from/to = days after sowing (HLT). rate = kg per hectare.
     cal = put in the phone calendar; remind = alarm the day before. */
  var FERT = {
    compound: { ms: "Baja sebatian (17.5:15.5:10 atau 17:20:10)", en: "Compound fertiliser (17.5:15.5:10 or 17:20:10)" },
    urea: { ms: "Urea", en: "Urea" },
    extra: { ms: "Baja tambahan 17:3:25+2MgO", en: "Additional fertiliser 17:3:25+2MgO" }
  };

  var TASKS = [
    { id: "sow", type: "harvest", from: 0, to: 0, cal: false,
      items: [{ ms: "Benih sah (berlabel)", en: "Certified seed (labelled)", rate: [120, 140] }],
      ms: { t: "Tabur benih", why: "Kadar untuk tabur terus basah. Guna benih sah dan tabur serentak dengan jiran supaya perosak tidak berpindah-pindah." },
      en: { t: "Sow the seed", why: "Rate for wet direct seeding. Use certified seed and sow at the same time as your neighbours so pests can't move between fields." },
      link: "learn.html#ricecheck" },

    { id: "w0", type: "water", from: 0, to: 6, water: 0,
      ms: { t: "Air: tanah tepu, tiada air bertakung", why: "Benih perlu udara untuk bercambah. Air bertakung juga memudahkan siput memakan anak benih." },
      en: { t: "Water: saturated soil, no standing water", why: "Seeds need air to sprout. Standing water also helps snails eat the seedlings." } },

    { id: "pre", type: "check", from: 0, to: 7, cal: true,
      items: [{ ms: "Racun rumpai pra-cambah: pretilaklor", en: "Pre-emergence herbicide: pretilachlor", label: true }],
      ms: { t: "Racun rumpai awal", why: "Dalam 7 hari pertama, sebelum rumpai tumbuh. Padi Clearfield (MR220CL1/CL2) sahaja: imazapik + imazapir pada hari 0–7." },
      en: { t: "Early weed control", why: "In the first 7 days, before weeds come up. Clearfield paddy (MR220CL1/CL2) only: imazapic + imazapyr at days 0–7." },
      link: "crop.html#weeds" },

    { id: "snail", type: "check", from: 0, to: 20, cal: true,
      ms: { t: "Awasi siput gondang emas", why: "Kekalkan air cetek, kutip siput dan hancurkan telur merah jambu setiap hari. Racun siput hanya jika 1 siput atau lebih setiap meter persegi." },
      en: { t: "Watch for golden apple snails", why: "Keep water shallow, pick up snails and crush the pink eggs every day. Use a molluscicide only at 1 or more snails per square metre." },
      link: "crop.html#snail" },

    { id: "w1", type: "water", from: 7, to: 14, water: 1,
      ms: { t: "Air: 3–5 cm", why: "Naikkan air perlahan-lahan bila anak benih sudah tegak." },
      en: { t: "Water: 3–5 cm", why: "Raise the water slowly once the seedlings stand up." } },

    { id: "f1", type: "fert", from: 15, to: 20, cal: true, remind: true,
      items: [{ fert: "compound", rate: 140 }],
      ms: { t: "Baja pertama", why: "Membantu padi beranak dengan kuat. Bubuh ketika sawah berair dan tutup saliran keluar." },
      en: { t: "First fertiliser", why: "Helps the paddy tiller strongly. Apply when the field has water and close the outlet." },
      link: "learn.html#masa" },

    { id: "w2", type: "water", from: 15, to: 39, water: 2,
      ms: { t: "Air: 5 cm", why: "Air yang cukup ialah cara paling murah untuk menekan rumpai." },
      en: { t: "Water: 5 cm", why: "Enough water is the cheapest way to hold back weeds." } },

    { id: "check", type: "check", from: 15, to: 90, cal: "weekly",
      ms: { t: "Pantau sawah setiap 7–14 hari", why: "Sembur hanya bila mencapai paras ekonomi: bena perang 5 dewasa atau 10 nimfa setiap kuadrat; pengorek batang 1 kelompok telur atau 1 rama-rama setiap m²; ulat pelipat daun 30% daun rosak; tikus 5% kerosakan." },
      en: { t: "Check the field every 7–14 days", why: "Spray only at the economic threshold: brown planthopper 5 adults or 10 nymphs per quadrat; stem borer 1 egg mass or 1 moth per m²; leaf folder 30% of leaves damaged; rats 5% damage." },
      link: "crop.html" },

    { id: "f2", type: "fert", from: 25, to: 30, cal: true, remind: true,
      items: [{ fert: "urea", rate: 80 }],
      ms: { t: "Baja kedua", why: "Nitrogen untuk anak padi. Jangan lebih dari sukatan — urea berlebihan menarik bena perang dan karah." },
      en: { t: "Second fertiliser", why: "Nitrogen for tillers. Don't use more than this — too much urea attracts planthoppers and blast." },
      link: "learn.html#masa" },

    { id: "weed", type: "check", from: 10, to: 40, cal: false,
      items: [{ ms: "Rumput: sihalofop-butil (sebelum berdaun 4). Rusiga & daun lebar: bensulfuron-metil atau propanil", en: "Grasses: cyhalofop-butyl (before 4 leaves). Sedges & broadleaf: bensulfuron-methyl or propanil", label: true }],
      ms: { t: "Kawal rumpai sebelum hari 40", why: "Hanya jika rumpai banyak. Cabut dengan tangan jika sedikit." },
      en: { t: "Control weeds before day 40", why: "Only if there are many weeds. Pull by hand if there are few." },
      link: "crop.html#weeds" },

    { id: "f3", type: "fert", from: 35, to: 45, cal: true, remind: true,
      items: [{ fert: "compound", rate: 100 }, { fert: "extra", rate: 100 }],
      ms: { t: "Baja ketiga", why: "Untuk pembentukan tangkai. Kalium menguatkan batang dan bijirin." },
      en: { t: "Third fertiliser", why: "For panicle forming. Potassium makes stems and grains stronger." },
      link: "learn.html#masa" },

    { id: "w3", type: "water", from: 40, to: 84, water: 3,
      ms: { t: "Air: 5–10 cm", why: "Kekalkan sekurang-kurangnya 5 cm semasa padi berbunga (sekitar hari 65–70)." },
      en: { t: "Water: 5–10 cm", why: "Keep at least 5 cm while the paddy flowers (around days 65–70)." } },

    { id: "blast", type: "check", from: 55, to: 75, cal: true,
      items: [{ ms: "Jika perlu: trisiklazol atau isoprotiolan", en: "If needed: tricyclazole or isoprothiolane", label: true }],
      ms: { t: "Awasi karah tangkai", why: "Masa bunting hingga keluar tangkai. Sembur pencegahan hanya untuk varieti mudah dijangkiti atau bila bintik karah mula kelihatan." },
      en: { t: "Watch for neck blast", why: "From booting to heading. Spray to prevent it only on susceptible varieties or when the first blast spots appear." },
      link: "crop.html#blast" },

    { id: "f4", type: "fert", from: 70, to: 80, cal: true, remind: true,
      items: [{ fert: "extra", rate: 50 }],
      ms: { t: "Baja keempat", why: "Membantu bijirin berisi penuh." },
      en: { t: "Fourth fertiliser", why: "Helps the grains fill fully." },
      link: "learn.html#masa" },

    { id: "weedy", type: "check", from: 70, to: 80, cal: true,
      ms: { t: "Cabut padi angin", why: "Padi angin lebih tinggi dan cepat luruh. Cabut sebelum bijinya gugur ke tanah." },
      en: { t: "Pull out weedy rice", why: "Weedy rice is taller and sheds early. Pull it before its seeds drop." },
      link: "crop.html#weedyrice" },

    { id: "w4", type: "water", from: 85, to: 94, water: 4, cal: true, remind: true,
      ms: { t: "Keringkan sawah", why: "Kira-kira 14 hari sebelum tuai, supaya tanah keras untuk mesin tuai." },
      en: { t: "Drain the field", why: "About 14 days before harvest, so the soil is firm for the harvester." },
      link: "learn.html#air" },

    { id: "harvest", type: "harvest", from: 95, to: 105, cal: true, remind: true,
      ms: { t: "Tuai", why: "Bila 85–90% bijirin sudah kuning, pada hari kering. Hantar ke kilang secepat mungkin." },
      en: { t: "Harvest", why: "When 85–90% of grains are yellow, on a dry day. Send to the mill as soon as possible." },
      link: "learn.html#tuai" }
  ];

  var TAG = { fert: "tag--fert", water: "tag--water", check: "tag--pest", harvest: "tag--harvest" };

  /* ---------- Helpers ---------- */
  function L() { return APP.getLang(); }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function daysBetween(a, b) { return Math.round((b - a) / 86400000); }

  function load() {
    var sow = APP.parseISODate(APP.store.get(KEYS.sow));
    var size = parseFloat(APP.store.get(KEYS.size));
    var unit = APP.store.get(KEYS.unit);
    if (!HA_PER[unit]) unit = "relung";
    if (!(size > 0)) size = null;
    return { sow: sow, size: size, unit: unit, ha: size ? size * HA_PER[unit] : null, day: sow ? daysBetween(sow, today()) : null };
  }

  function pick(list, day) { for (var i = 0; i < list.length; i++) if (day <= list[i].to) return list[i]; return list[list.length - 1]; }
  function stageFor(day) { return pick(STAGES, Math.max(0, day))[L()]; }
  function waterFor(day) { return pick(WATER, Math.max(0, day)); }

  function dayLabel(r) { return r.from === r.to ? APP.t("plan.day", { a: r.from }) : APP.t("plan.days", { a: r.from, b: r.to }); }
  function fmt(d, long) { return APP.formatDate(d, long ? { weekday: "short", day: "numeric", month: "short" } : { day: "numeric", month: "short" }); }
  function dateLabel(r, sow) {
    var a = fmt(APP.addDays(sow, r.from));
    return r.from === r.to ? a : a + " – " + fmt(APP.addDays(sow, r.to));
  }
  function kg(n) { return APP.formatNumber(n, n < 10 ? 1 : 0); }

  function itemName(it) { return it.fert ? FERT[it.fert][L()] : it[L()]; }
  function itemAmount(it, ha, plain) {
    if (it.label) return plain ? "" : APP.t("plan.label");
    if (!it.rate) return "";
    var r = it.rate, range = Array.isArray(r);
    var perHa = APP.t("plan.perHa", { rate: range ? r[0] + "–" + r[1] : r });
    if (!ha) return perHa;
    var mine = range ? kg(r[0] * ha) + "–" + kg(r[1] * ha) : kg(r * ha);
    return plain ? mine + " kg" : "<b>" + APP.t("plan.forYou", { kg: mine }) + "</b> <small>(" + perHa + ")</small>";
  }

  function status(r, day) {
    if (day === null) return "";
    if (r.to < day) return "done";
    if (r.from <= day) return "now";
    return "";
  }
  // The next task that hasn't started yet (water rows are not "tasks")
  function nextTask(day) {
    var list = TASKS.filter(function (r) { return (r.type !== "water" || r.id === "w4") && r.id !== "check" && r.from > day; });
    list.sort(function (a, b) { return a.from - b.from; });
    return list[0] || null;
  }
  function nowTasks(day) {
    return TASKS.filter(function (r) { return (r.type !== "water" || r.id === "w4") && r.from <= day && day <= r.to; });
  }
  function whenText(n) { return n === 0 ? APP.t("plan.today") : n === 1 ? APP.t("plan.tomorrow") : APP.t("plan.inDays", { n: n }); }

  /* ================= Full page (jadual.html) ================= */
  var els = {};
  var filter = "all";
  var showDone = false;

  function taskHTML(r, st, isNext, s) {
    var d = r[L()];
    var items = (r.items || []).map(function (it) {
      var amt = itemAmount(it, s.ha);
      return '<li><span>' + itemName(it) + "</span>" + (amt ? '<span class="plan-task__amt">' + amt + "</span>" : "") + "</li>";
    }).join("");
    var tag = st === "done" ? "plan.status.done" : st === "now" ? "plan.status.now" : isNext ? "plan.status.next" : "";
    return '<article class="plan-task plan-task--' + r.type + (st ? " is-" + st : "") + (isNext ? " is-next" : "") + ' reveal">' +
      '<div class="plan-task__when"><strong>' + dayLabel(r) + "</strong>" +
      (s.sow ? "<span>" + dateLabel(r, s.sow) + "</span>" : "") + "</div>" +
      '<div class="plan-task__body">' +
      '<div class="plan-task__head"><span class="tag ' + TAG[r.type] + '">' + APP.t("plan.type." + (r.id === "sow" ? "sow" : r.type)) + "</span>" +
      (tag ? '<span class="tag tag--' + (st || "next") + '">' + APP.t(tag) + "</span>" : "") + "</div>" +
      "<h3>" + d.t + "</h3>" +
      (items ? '<ul class="plan-task__items">' + items + "</ul>" : "") +
      "<p>" + d.why + "</p>" +
      (r.link ? '<a class="plan-task__link" href="' + r.link + '">' + APP.t("plan.more") + " " + APP.icons.next + "</a>" : "") +
      "</div></article>";
  }

  function renderToday(s) {
    var box = els.today;
    if (!s.sow) {
      box.className = "card plan-today plan-today--empty";
      box.innerHTML = '<div class="plan-today__icon">' + APP.icons.calendar + "</div><div><h2>" + APP.t("plan.emptyT") + "</h2><p>" + APP.t("plan.emptyB") + "</p>" +
        '<button type="button" class="btn btn--outline btn--sm" id="plan-demo">' + APP.t("plan.demo") + "</button></div>";
      return;
    }
    var day = s.day;
    box.className = "card plan-today";
    if (day < 0) {
      box.innerHTML = '<div class="plan-today__big"><small>' + APP.t("plan.dayLabel") + "</small><strong>" + APP.t("plan.before", { n: -day }) + "</strong></div>" + nextBlock(s, day);
      return;
    }
    if (day > 110) {
      box.innerHTML = '<div class="plan-today__big"><small>' + APP.t("plan.dayLabel") + "</small><strong>" + APP.t("plan.dayN", { n: day }) + "</strong></div>" +
        '<div class="plan-today__info"><p>' + APP.t("plan.after", { n: day }) + "</p></div>";
      return;
    }
    var now = nowTasks(day).filter(function (r) { return r.id !== "check"; });
    var w = waterFor(day);
    box.innerHTML =
      '<div class="plan-today__big"><small>' + APP.t("plan.dayLabel") + "</small><strong>" + APP.t("plan.dayN", { n: day }) + "</strong>" +
      "<span>" + APP.t("plan.stageNow", { stage: stageFor(day) }) + "</span></div>" +
      '<div class="plan-today__info">' +
      '<p class="plan-today__water">' + APP.icons.drop + "<span>" + APP.t("plan.waterNow", { water: w[L()] }) + "</span></p>" +
      "<h3>" + APP.t("plan.nowTitle") + "</h3>" +
      (now.length ? "<ul>" + now.map(function (r) {
        var left = r.to - day;
        var amt = (r.items || []).map(function (it) { var a = itemAmount(it, s.ha, true); return a ? itemName(it).split(" (")[0] + " " + a : ""; }).filter(Boolean).join(" + ");
        return "<li><b>" + r[L()].t + "</b>" + (amt ? " — " + amt : "") + ' <small>(' + (left === 0 ? APP.t("plan.lastDay") : APP.t("plan.untilDate", { date: fmt(APP.addDays(s.sow, r.to)) })) + ")</small></li>";
      }).join("") + "</ul>" : "<p>" + APP.t("plan.nothingNow") + "</p>") +
      (day >= 15 && day <= 90 ? '<p class="plan-today__tip">' + APP.icons.search + "<span>" + APP.t("plan.checkTip") + "</span></p>" : "") +
      "</div>" + nextBlock(s, day);
  }

  function nextBlock(s, day) {
    var n = nextTask(day);
    if (!n) return "";
    var amt = (n.items || []).map(function (it) { var a = itemAmount(it, s.ha, true); return a ? itemName(it).split(" (")[0] + " " + a : ""; }).filter(Boolean).join(" + ");
    return '<div class="plan-today__next"><h3>' + APP.t("plan.nextTitle") + "</h3>" +
      "<p><b>" + n[L()].t + "</b>" + (amt ? " — " + amt : "") + "</p>" +
      "<p>" + fmt(APP.addDays(s.sow, n.from), true) + " · <b>" + whenText(n.from - day) + "</b></p>" +
      (n.type === "fert" || n.id === "pre" ? '<a class="btn btn--green btn--sm" href="weather.html">' + APP.icons.weather + APP.t("plan.checkWx") + "</a>" : "") +
      "</div>";
  }

  function render() {
    var s = load();
    renderToday(s);
    els.actions.hidden = !s.sow;
    var day = s.day;
    var nxt = day !== null ? nextTask(day) : null;
    var rows = TASKS.filter(function (r) { return filter === "all" || r.type === filter; })
      .slice().sort(function (a, b) { return a.from - b.from || a.to - b.to; });
    var done = rows.filter(function (r) { return status(r, day) === "done"; });
    var hideDone = done.length && !showDone;
    var toggle = done.length ? '<button type="button" class="link-btn plan-done-toggle" id="plan-done">' +
      APP.t(showDone ? "plan.hideDone" : "plan.showDone", { n: done.length }) + "</button>" : "";
    els.list.innerHTML = toggle + rows.filter(function (r) { return !hideDone || status(r, day) !== "done"; })
      .map(function (r) { return taskHTML(r, status(r, day), nxt && nxt.id === r.id, s); }).join("");
    APP.reveal(els.list);
  }

  function renderFilters() {
    els.filters.innerHTML = ["all", "fert", "water", "check", "harvest"].map(function (f) {
      return '<button type="button" class="chip" data-f="' + f + '" aria-pressed="' + (filter === f) + '">' + APP.t("plan.filter." + f) + "</button>";
    }).join("");
  }

  function readInputs() {
    APP.store.set(KEYS.sow, els.sow.value || "");
    APP.store.set(KEYS.size, els.size.value || "");
    APP.store.set(KEYS.unit, els.unit.value);
    render();
  }

  /* ---------- Phone calendar file (.ics) ---------- */
  function icsEsc(t) { return String(t).replace(/<[^>]+>/g, "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
  function icsDate(d) { return APP.toISODate(d).replace(/-/g, ""); }

  function downloadICS() {
    var s = load();
    if (!s.sow) return;
    var day = Math.max(s.day, 0);
    var stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    var out = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SawahKu//Jadual Sawah//MS", "CALSCALE:GREGORIAN", "X-WR-CALNAME:SawahKu"];
    TASKS.filter(function (r) { return r.cal && r.to >= day; }).forEach(function (r) {
      var d = r[L()];
      var details = (r.items || []).map(function (it) { var a = itemAmount(it, s.ha, true); return itemName(it) + (a ? ": " + a : ""); }).join("\n");
      var start = r.cal === "weekly" ? Math.max(r.from, day) : r.from;
      var ev = [
        "BEGIN:VEVENT",
        "UID:sawahku-" + r.id + "-" + icsDate(s.sow) + "@sawahku",
        "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + icsDate(APP.addDays(s.sow, start)),
        "DTEND;VALUE=DATE:" + icsDate(APP.addDays(s.sow, (r.cal === "weekly" ? start : r.to) + 1)),
        "SUMMARY:" + icsEsc("SawahKu: " + d.t),
        "DESCRIPTION:" + icsEsc((details ? details + "\n\n" : "") + d.why)
      ];
      if (r.cal === "weekly") ev.push("RRULE:FREQ=WEEKLY;COUNT=" + Math.max(1, Math.floor((r.to - start) / 7) + 1));
      if (r.remind) ev.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(APP.t("plan.icsRemind", { task: d.t })), "TRIGGER:-PT15H", "END:VALARM");
      ev.push("END:VEVENT");
      out = out.concat(ev);
    });
    out.push("END:VCALENDAR");
    var blob = new Blob([out.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sawahku-" + icsDate(s.sow) + ".ics";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function shareText() {
    var s = load();
    if (!s.sow) return "";
    var lines = [APP.t("plan.shareHead", { date: APP.formatDate(s.sow) })];
    TASKS.filter(function (r) { return r.type === "fert" || r.type === "harvest" || r.id === "w4"; }).forEach(function (r) {
      var amt = (r.items || []).map(function (it) { var a = itemAmount(it, s.ha, true); return a ? itemName(it).split(" (")[0] + " " + a : ""; }).filter(Boolean).join(" + ");
      lines.push("• " + dateLabel(r, s.sow) + ": " + r[L()].t + (amt ? " — " + amt : ""));
    });
    lines.push(location.href.split("#")[0]);
    return lines.join("\n");
  }

  function initPage() {
    els.sow = document.getElementById("plan-sow");
    els.size = document.getElementById("plan-size");
    els.unit = document.getElementById("plan-unit");
    els.today = document.getElementById("plan-today");
    els.actions = document.getElementById("plan-actions");
    els.filters = document.getElementById("plan-filters");
    els.list = document.getElementById("plan-list");

    var s = load();
    els.sow.value = s.sow ? APP.toISODate(s.sow) : "";
    els.size.value = s.size || "";
    els.unit.value = s.unit;

    [els.sow, els.size, els.unit].forEach(function (el) {
      el.addEventListener("change", readInputs);
      el.addEventListener("input", readInputs);
    });
    els.today.addEventListener("click", function (e) {
      if (!e.target.closest("#plan-demo")) return;
      els.sow.value = APP.toISODate(APP.addDays(today(), -20));
      if (!els.size.value) els.size.value = "3";
      readInputs();
    });
    els.list.addEventListener("click", function (e) {
      if (!e.target.closest("#plan-done")) return;
      showDone = !showDone; render();
    });
    els.filters.addEventListener("click", function (e) {
      var b = e.target.closest("[data-f]");
      if (!b) return;
      filter = b.getAttribute("data-f");
      renderFilters(); render();
    });
    document.getElementById("plan-ics").addEventListener("click", downloadICS);
    document.getElementById("plan-print").addEventListener("click", function () { window.print(); });
    document.getElementById("plan-share").addEventListener("click", function () {
      window.open(APP.waShare(shareText()), "_blank", "noopener");
    });
    document.addEventListener("langchange", function () { renderFilters(); render(); });
    renderFilters();
    render();
  }

  /* ================= Home card (index.html) ================= */
  function renderMini(el) {
    var s = load();
    var body;
    if (!s.sow || s.day > 110) {
      body = "<strong>" + APP.t("plan.miniT") + "</strong><span>" + APP.t("plan.miniEmpty") + "</span>";
    } else {
      var n = nextTask(s.day);
      var nowFert = nowTasks(s.day).filter(function (r) { return r.type === "fert" || r.id === "harvest" || r.id === "w4"; })[0];
      var line = nowFert ? APP.t("plan.miniNow", { task: nowFert[L()].t, date: fmt(APP.addDays(s.sow, nowFert.to)) })
        : n ? APP.t("plan.miniNext", { task: n[L()].t, when: whenText(n.from - s.day) }) : APP.t("plan.miniNone");
      body = "<strong>" + (s.day < 0 ? APP.t("plan.before", { n: -s.day }) : APP.t("plan.dayN", { n: s.day }) + " · " + stageFor(s.day)) + "</strong>" +
        "<span>" + line + "</span>";
    }
    el.innerHTML = '<span class="plan-mini__icon">' + APP.icons.calendar + '</span><span class="plan-mini__text">' + body + '</span><span class="plan-mini__go">' + APP.icons.next + "</span>";
    el.classList.toggle("is-empty", !s.sow);
  }

  /* ================= Weather page: highlight today's water level ================= */
  function markWater(wrap) {
    var s = load();
    var stages = wrap.querySelectorAll(".water-stage");
    stages.forEach(function (x) { x.classList.remove("is-now"); });
    var note = document.getElementById("plan-wx");
    if (!s.sow || s.day < 0 || s.day > 110) { if (note) note.hidden = true; return; }
    var w = waterFor(s.day);
    if (stages[w.idx]) stages[w.idx].classList.add("is-now");
    if (note) {
      note.hidden = false;
      note.innerHTML = APP.icons.drop + '<span>' + APP.t("plan.wxLine", { n: s.day, water: w[L()] }) + ' <a href="jadual.html">' + APP.t("plan.open") + "</a></span>";
    }
  }

  window.SK_PLAN = { load: load, tasks: TASKS, stageFor: stageFor, waterFor: waterFor, nextTask: nextTask };

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("plan-app")) initPage();
    var mini = document.getElementById("plan-mini");
    if (mini) { renderMini(mini); document.addEventListener("langchange", function () { renderMini(mini); }); }
    var ws = document.querySelector(".water-stages");
    if (ws) { markWater(ws); document.addEventListener("langchange", function () { markWater(ws); }); }
  });
})();
