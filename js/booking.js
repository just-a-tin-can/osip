/* ============================================================
   ADP Sytech — booking form (front-end demo only)
   Bookings are kept in this browser's localStorage so the
   "My bookings" list works. Nothing is sent to a server.
   ============================================================ */

(function () {
  "use strict";

  var SLOTS = ["07:00", "08:30", "10:00", "16:00", "17:30"];
  var BOOKINGS_KEY = "adp-bookings";

  var form, els = {};

  /* ---------- Storage ---------- */
  function loadBookings() {
    try { return JSON.parse(ADP.store.get(BOOKINGS_KEY) || "[]"); } catch (e) { return []; }
  }
  function saveBookings(list) { ADP.store.set(BOOKINGS_KEY, JSON.stringify(list)); }

  /* ---------- Helpers ---------- */
  function radioValue(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }

  function serviceLabel(v) {
    return v ? ADP.t("book.svc." + v) : ADP.t("book.sum.empty");
  }

  function unitLabel(u) { return ADP.t("guide.unit." + u); }

  function needsPestForm(service) { return service === "pest" || service === "both"; }

  // Show the granular / liquid choice only when pesticide is part of the job.
  function updatePestForm() {
    var show = needsPestForm(radioValue("service"));
    els.pestField.hidden = !show;
    if (!show) {
      form.querySelectorAll('input[name="pestForm"]').forEach(function (r) { r.checked = false; });
      els.pestField.classList.remove("has-error");
    }
  }

  function pestFormLabel(v) { return v ? ADP.t("book.pestForm." + v) : ADP.t("book.sum.empty"); }

  function tomorrow() { return ADP.addDays(new Date(), 1); }

  // Simple repeatable "availability": some slots look taken on some dates.
  function takenSlots(iso) {
    var hash = 0;
    for (var i = 0; i < iso.length; i++) hash = (hash * 31 + iso.charCodeAt(i)) % 997;
    var taken = [SLOTS[hash % SLOTS.length]];
    if (hash % 3 === 0) taken.push(SLOTS[(hash + 2) % SLOTS.length]);
    return taken;
  }

  function normalisePhone(raw) {
    var digits = String(raw).replace(/\D/g, "");
    if (digits.indexOf("60") === 0) digits = "0" + digits.slice(2);
    return digits;
  }

  function makeRef() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var out = "ADP-";
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  /* ---------- Time slots ---------- */
  function renderSlots() {
    var iso = els.date.value;
    var chosen = radioValue("slot");
    if (!iso) {
      els.slots.innerHTML = '<span class="empty">' + ADP.t("book.noDate") + "</span>";
      return;
    }
    var taken = takenSlots(iso);
    els.slots.innerHTML = SLOTS.map(function (s, i) {
      var disabled = taken.indexOf(s) !== -1;
      var checked = !disabled && s === chosen;
      return '<div class="slot"><input type="radio" name="slot" id="slot-' + i + '" value="' + s + '"' +
        (disabled ? " disabled" : "") + (checked ? " checked" : "") + '>' +
        '<label for="slot-' + i + '">' + s + "</label></div>";
    }).join("");
  }

  /* ---------- Summary ---------- */
  function summaryRows(data) {
    var empty = ADP.t("book.sum.empty");
    var date = ADP.parseISODate(data.date);
    var rows = [
      [ADP.t("book.sum.service"), serviceLabel(data.service)]
    ];
    if (needsPestForm(data.service)) rows.push([ADP.t("book.sum.pestForm"), pestFormLabel(data.pestForm)]);
    return rows.concat([
      [ADP.t("book.sum.field"), data.size ? ADP.escapeHTML(data.size) + " " + unitLabel(data.unit) : empty],
      [ADP.t("book.sum.date"), date ? ADP.formatDate(date, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : empty],
      [ADP.t("book.sum.time"), data.slot || empty],
      [ADP.t("book.sum.quote"), ADP.t("book.sum.quoteV")]
    ]).map(function (r) { return "<li><span>" + r[0] + "</span><span>" + r[1] + "</span></li>"; }).join("");
  }

  function formData() {
    return {
      name: els.name.value.trim(),
      phone: els.phone.value.trim(),
      village: els.village.value.trim(),
      district: els.district.value,
      size: els.size.value,
      unit: els.unit.value,
      sow: els.sow.value,
      service: radioValue("service"),
      pestForm: needsPestForm(radioValue("service")) ? radioValue("pestForm") : "",
      date: els.date.value,
      slot: radioValue("slot"),
      notes: els.notes.value.trim()
    };
  }

  function renderSummary() { els.summary.innerHTML = summaryRows(formData()); }

  /* ---------- My bookings ---------- */
  function renderBookings() {
    var list = loadBookings();
    if (!list.length) {
      els.list.innerHTML = '<p class="empty">' + ADP.t("book.myEmpty") + "</p>";
      return;
    }
    els.list.innerHTML = list.map(function (b) {
      var date = ADP.parseISODate(b.date);
      return '<div class="booking-item">' +
        "<header><strong>" + serviceLabel(b.service) + (b.pestForm ? " · " + pestFormLabel(b.pestForm) : "") + '</strong><span class="ref">' + b.ref + "</span></header>" +
        "<div>" + (date ? ADP.formatDate(date, { weekday: "short", day: "numeric", month: "short" }) : "") + " · " + b.slot + "</div>" +
        "<div>" + ADP.escapeHTML(b.village) + " · " + ADP.escapeHTML(b.size) + " " + unitLabel(b.unit) + "</div>" +
        '<button type="button" data-cancel="' + b.ref + '">' + ADP.t("book.cancel") + "</button>" +
        "</div>";
    }).join("");
  }

  /* ---------- Validation ---------- */
  function setError(fieldEl, hasError) {
    fieldEl.classList.toggle("has-error", hasError);
    return hasError;
  }

  function validate(data) {
    var errors = [];
    function check(el, bad) {
      var field = el.closest(".field");
      if (setError(field, bad)) errors.push(field);
    }
    check(els.name, data.name.length < 2);
    check(els.phone, !/^0\d{8,10}$/.test(normalisePhone(data.phone)));
    check(els.village, data.village.length < 2);
    check(els.district, !data.district);
    check(els.size, !(parseFloat(data.size) > 0));
    setError(document.getElementById("service-field"), !data.service) && errors.push(document.getElementById("service-field"));
    setError(els.pestField, needsPestForm(data.service) && !data.pestForm) && errors.push(els.pestField);
    var d = ADP.parseISODate(data.date);
    check(els.date, !d || d < tomorrow());
    setError(document.getElementById("slot-field"), !data.slot) && errors.push(document.getElementById("slot-field"));
    setError(document.getElementById("consent-field"), !els.consent.checked) && errors.push(document.getElementById("consent-field"));
    return errors;
  }

  /* ---------- Submit ---------- */
  function onSubmit(e) {
    e.preventDefault();
    var data = formData();
    var errors = validate(data);
    if (errors.length) {
      errors[0].scrollIntoView({ behavior: "smooth", block: "center" });
      var focusable = errors[0].querySelector("input, select, textarea");
      if (focusable) focusable.focus({ preventScroll: true });
      return;
    }

    data.ref = makeRef();
    data.phone = normalisePhone(data.phone);
    data.created = new Date().toISOString();
    var list = loadBookings();
    list.unshift(data);
    saveBookings(list);

    document.getElementById("confirm-ref").textContent = data.ref;
    document.getElementById("confirm-summary").innerHTML = summaryRows(data);
    els.modal.classList.add("is-open");
    document.getElementById("confirm-close").focus();

    renderBookings();
  }

  function closeModal() {
    els.modal.classList.remove("is-open");
    form.reset();
    // keep the field details for the next booking
    prefill();
    form.querySelectorAll(".has-error").forEach(function (f) { f.classList.remove("has-error"); });
    renderSlots();
    renderSummary();
  }

  /* ---------- Prefill (from the guide page link or saved values) ---------- */
  function prefill() {
    var q = new URLSearchParams(window.location.search);
    els.size.value = q.get("size") || ADP.store.get("adp-size") || "";
    els.unit.value = q.get("unit") || ADP.store.get("adp-unit") || "ha";
    els.sow.value = q.get("sow") || ADP.store.get("adp-sow") || "";
    var svc = q.get("service");
    if (svc) {
      var r = document.getElementById("svc-" + svc);
      if (r) r.checked = true;
    }
    updatePestForm();
    var date = ADP.parseISODate(q.get("date"));
    if (date && date >= tomorrow()) els.date.value = ADP.toISODate(date);
  }

  /* ---------- Start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    form = document.getElementById("booking-form");
    els.name = document.getElementById("b-name");
    els.phone = document.getElementById("b-phone");
    els.village = document.getElementById("b-village");
    els.district = document.getElementById("b-district");
    els.size = document.getElementById("b-size");
    els.unit = document.getElementById("b-unit");
    els.sow = document.getElementById("b-sow");
    els.date = document.getElementById("b-date");
    els.slots = document.getElementById("slots");
    els.notes = document.getElementById("b-notes");
    els.consent = document.getElementById("b-consent");
    els.summary = document.getElementById("summary");
    els.list = document.getElementById("my-bookings");
    els.modal = document.getElementById("confirm-modal");
    els.pestField = document.getElementById("pestform-field");

    els.date.min = ADP.toISODate(tomorrow());

    prefill();
    renderSlots();
    renderSummary();
    renderBookings();

    els.date.addEventListener("change", function () { renderSlots(); renderSummary(); });
    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field) field.classList.remove("has-error");
      renderSummary();
    });
    form.addEventListener("change", function (e) {
      var field = e.target.closest(".field");
      if (field) field.classList.remove("has-error");
      if (e.target.name === "service") updatePestForm();
      renderSummary();
    });
    form.addEventListener("submit", onSubmit);

    els.list.addEventListener("click", function (e) {
      var ref = e.target.getAttribute("data-cancel");
      if (!ref) return;
      saveBookings(loadBookings().filter(function (b) { return b.ref !== ref; }));
      renderBookings();
    });

    document.getElementById("confirm-close").addEventListener("click", closeModal);
    els.modal.addEventListener("click", function (e) { if (e.target === els.modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && els.modal.classList.contains("is-open")) closeModal();
    });

    document.addEventListener("langchange", function () {
      renderSlots();
      renderSummary();
      renderBookings();
    });
  });
})();
