/* ============================================================
   ADP Sytech — booking (front-end demo only)
   A simple 4-step flow, like GrabFood / foodpanda:
     1. Where  2. What  3. When  4. Confirm
   "My bookings" shows each job's status and lets the farmer
   rate the job and leave feedback once it is done.
   Everything is saved in this browser only (localStorage).
   ============================================================ */

(function () {
  "use strict";

  var SLOTS = ["pagi", "petang", "malam"];
  var STATUSES = ["received", "confirmed", "onway", "done"];
  var DAYS_SHOWN = 14;
  var BOOKINGS_KEY = "adp-bookings";
  var PROFILE_KEY = "adp-profile";

  var form, els = {};
  var step = 1;
  var loc = null;        // { lat, lon } from the location button
  var chosenDate = "";   // "YYYY-MM-DD"

  /* ---------- Storage ---------- */
  function loadJSON(key, fallback) {
    try { return JSON.parse(ADP.store.get(key) || "null") || fallback; } catch (e) { return fallback; }
  }
  function loadBookings() { return loadJSON(BOOKINGS_KEY, []); }
  function saveBookings(list) { ADP.store.set(BOOKINGS_KEY, JSON.stringify(list)); }
  function updateBooking(ref, fn) {
    saveBookings(loadBookings().map(function (b) { if (b.ref === ref) fn(b); return b; }));
  }

  /* ---------- Small helpers ---------- */
  var esc = function (s) { return ADP.escapeHTML(s == null ? "" : s); };
  function radioValue(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : "";
  }
  function setRadio(name, value) {
    form.querySelectorAll('input[name="' + name + '"]').forEach(function (r) { r.checked = r.value === value; });
  }
  function tomorrow() { return ADP.addDays(new Date(), 1); }
  function needsPestForm(s) { return s === "pest" || s === "both"; }
  function serviceLabel(v) { return v ? ADP.t("book.svc." + v) : "—"; }
  function pestFormLabel(v) { return v ? ADP.t("book.pestForm." + v) : "—"; }
  function unitLabel(u) { return ADP.t("guide.unit." + (u || "acre")); }
  function slotLabel(v) {
    if (!v) return "—";
    return SLOTS.indexOf(v) !== -1 ? ADP.t("book.slot." + v) + " (" + ADP.t("book.slot." + v + "Sub") + ")" : esc(v);
  }
  function dateLabel(iso, withYear) {
    var d = ADP.parseISODate(iso);
    if (!d) return "—";
    var o = { weekday: "short", day: "numeric", month: "short" };
    if (withYear) o.year = "numeric";
    return ADP.formatDate(d, o);
  }
  function mapLink(l) {
    return '<a href="https://www.google.com/maps?q=' + l.lat + "," + l.lon + '" target="_blank" rel="noopener">' + ADP.t("book.locMap") + "</a>";
  }
  function normalisePhone(raw) {
    var digits = String(raw).replace(/\D/g, "");
    if (digits.indexOf("60") === 0) digits = "0" + digits.slice(2);
    return digits;
  }
  function makeRef() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", out = "ADP-";
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }
  // Repeatable fake "fully booked" slots so the demo looks realistic.
  function takenSlots(iso) {
    var hash = 0;
    for (var i = 0; i < iso.length; i++) hash = (hash * 31 + iso.charCodeAt(i)) % 997;
    return hash % 3 === 0 ? [SLOTS[hash % SLOTS.length]] : [];
  }
  function setError(field, bad) { field.classList.toggle("has-error", !!bad); return !!bad; }

  /* =========================================================
     NEW BOOKING
     ========================================================= */

  /* ----- Step 1: location ----- */
  function renderLocStatus() {
    els.locStatus.classList.remove("is-error");
    els.locStatus.innerHTML = loc ? "✓ " + ADP.t("book.locOk") + " " + mapLink(loc) : "";
  }
  function markLocation() {
    if (!navigator.geolocation) { locFail(); return; }
    els.locStatus.classList.remove("is-error");
    els.locStatus.textContent = ADP.t("book.locGetting");
    navigator.geolocation.getCurrentPosition(function (pos) {
      loc = { lat: pos.coords.latitude.toFixed(5), lon: pos.coords.longitude.toFixed(5) };
      els.whereField.classList.remove("has-error");
      renderLocStatus();
    }, locFail, { enableHighAccuracy: true, timeout: 15000 });
  }
  function locFail() {
    els.locStatus.classList.add("is-error");
    els.locStatus.textContent = ADP.t("book.locFail");
  }

  /* ----- Step 2: service ----- */
  function updatePestForm() {
    var show = needsPestForm(radioValue("service"));
    els.pestField.hidden = !show;
    if (!show) { setRadio("pestForm", ""); els.pestField.classList.remove("has-error"); }
  }
  function changeSize(delta) {
    var v = parseFloat(els.size.value) || 0;
    v = Math.max(0.5, Math.round((v + delta * 0.5) * 2) / 2);
    els.size.value = v;
    els.sizeField.classList.remove("has-error");
  }

  /* ----- Step 3: date chips + time ----- */
  function renderDateChips() {
    var days = [];
    for (var i = 0; i < DAYS_SHOWN; i++) days.push(ADP.toISODate(ADP.addDays(tomorrow(), i)));
    if (chosenDate && days.indexOf(chosenDate) === -1) days.push(chosenDate); // date sent from the guide page
    els.dateChips.innerHTML = days.map(function (iso, i) {
      var d = ADP.parseISODate(iso);
      var top = i === 0 ? ADP.t("bk.tomorrow") : ADP.formatDate(d, { weekday: "short" });
      return '<button type="button" class="chip' + (iso === chosenDate ? " is-on" : "") + '" data-date="' + iso + '">' +
        "<small>" + top + "</small><b>" + d.getDate() + "</b><small>" + ADP.formatDate(d, { month: "short" }) + "</small></button>";
    }).join("");
  }
  function renderSlots() {
    var chosen = radioValue("slot");
    var taken = chosenDate ? takenSlots(chosenDate) : [];
    els.slots.innerHTML = SLOTS.map(function (s, i) {
      var disabled = taken.indexOf(s) !== -1;
      return '<div class="slot slot--big"><input type="radio" name="slot" id="slot-' + i + '" value="' + s + '"' +
        (disabled ? " disabled" : "") + (!disabled && s === chosen ? " checked" : "") + ">" +
        '<label for="slot-' + i + '">' + ADP.t("book.slot." + s) + "<small>" + ADP.t("book.slot." + s + "Sub") + "</small></label></div>";
    }).join("");
  }

  /* ----- Step 4: review ----- */
  function formData() {
    var service = radioValue("service");
    return {
      loc: loc,
      village: els.village.value.trim(),
      lot: els.lot.value.trim(),
      service: service,
      pestForm: needsPestForm(service) ? radioValue("pestForm") : "",
      size: els.size.value,
      unit: els.unit.value,
      product: els.product.value.trim(),
      date: chosenDate,
      slot: radioValue("slot"),
      name: els.name.value.trim(),
      phone: els.phone.value.trim(),
      notes: els.notes.value.trim(),
      sow: ADP.store.get("adp-sow") || ""
    };
  }
  function whereText(b) {
    var parts = [];
    if (b.village) parts.push(esc(b.village));
    if (b.lot) parts.push(esc(b.lot));
    return (parts.join(" · ") || "") + (b.loc ? (parts.length ? " · " : "") + mapLink(b.loc) : "");
  }
  function renderReview() {
    var b = formData();
    var what = serviceLabel(b.service) + (b.pestForm ? " · " + pestFormLabel(b.pestForm) : "");
    var rows = [
      [1, ADP.t("bk.step1"), whereText(b)],
      [2, ADP.t("bk.step2"), what + "<br>" + esc(b.size) + " " + unitLabel(b.unit) + (b.product ? " · " + esc(b.product) : "")],
      [3, ADP.t("bk.step3"), dateLabel(b.date, true) + "<br>" + slotLabel(b.slot)],
      [0, ADP.t("book.sum.quote"), ADP.t("book.sum.quoteV")]
    ];
    els.summary.innerHTML = rows.map(function (r) {
      return "<li><span>" + r[1] + (r[0] ? ' <button type="button" class="link-btn" data-go="' + r[0] + '">' + ADP.t("bk.change") + "</button>" : "") +
        "</span><span>" + r[2] + "</span></li>";
    }).join("");
  }

  /* ----- Validation per step ----- */
  function validateStep(n, quiet) {
    var b = formData(), bad = [];
    function flag(field, isBad) {
      if (quiet) { if (isBad) bad.push(field); return; }
      if (setError(field, isBad)) bad.push(field);
    }
    if (n === 1) flag(els.whereField, !b.loc && b.village.length < 2);
    if (n === 2) {
      flag(els.serviceField, !b.service);
      flag(els.pestField, needsPestForm(b.service) && !b.pestForm);
      flag(els.sizeField, !(parseFloat(b.size) > 0));
    }
    if (n === 3) {
      flag(els.dateField, !b.date);
      flag(els.slotField, !b.slot);
    }
    if (n === 4) {
      flag(els.name.closest(".field"), b.name.length < 2);
      flag(els.phone.closest(".field"), !/^0\d{8,10}$/.test(normalisePhone(b.phone)));
      flag(els.consentField, !els.consent.checked);
    }
    if (bad.length && !quiet) {
      bad[0].scrollIntoView({ behavior: "smooth", block: "center" });
      var f = bad[0].querySelector("input, select, textarea");
      if (f && f.type !== "radio" && f.type !== "checkbox") f.focus({ preventScroll: true });
    }
    return bad.length === 0;
  }

  /* ----- Moving between steps ----- */
  function showStep(n) {
    step = n;
    form.querySelectorAll(".step").forEach(function (s) { s.hidden = Number(s.getAttribute("data-step")) !== n; });
    els.stepper.querySelectorAll("li").forEach(function (li) {
      var i = Number(li.getAttribute("data-go"));
      li.classList.toggle("is-active", i === n);
      li.classList.toggle("is-done", i < n);
    });
    els.back.hidden = n === 1;
    els.next.querySelector("span").textContent = ADP.t(n === 4 ? "bk.book" : "bk.next");
    if (n === 3) { renderDateChips(); renderSlots(); }
    if (n === 4) renderReview();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goNext() {
    if (!validateStep(step)) return;
    if (step < 4) showStep(step + 1); else submit();
  }
  function goTo(n) {
    // Jump back freely; jump forward only past steps that are already filled in.
    for (var i = 1; i < n; i++) {
      if (!validateStep(i, true)) { showStep(i); validateStep(i); return; }
    }
    showStep(n);
  }

  /* ----- WhatsApp message with the full booking ----- */
  function plain(html) { var d = document.createElement("div"); d.innerHTML = html; return d.textContent; }
  function waBookingText(b) {
    var rows = [
      ["wa.l.ref", b.ref],
      ["book.name", b.name],
      ["book.phone", b.phone],
      ["wa.l.service", plain(serviceLabel(b.service) + (b.pestForm ? " · " + pestFormLabel(b.pestForm) : ""))],
      ["wa.l.size", b.size + " " + unitLabel(b.unit)],
      ["wa.l.where", [b.village, b.lot].filter(Boolean).join(", ")],
      ["wa.l.map", b.loc ? "https://www.google.com/maps?q=" + b.loc.lat + "," + b.loc.lon : ""],
      ["wa.l.date", dateLabel(b.date, true)],
      ["wa.l.time", plain(slotLabel(b.slot))],
      ["wa.l.product", b.product],
      ["wa.l.notes", b.notes]
    ];
    return ADP.t("wa.intro") + "\n\n" + rows.filter(function (r) { return r[1]; }).map(function (r) {
      return ADP.t(r[0]) + ": " + r[1];
    }).join("\n");
  }
  function setQuickLink() { els.waQuick.href = ADP.waLink(ADP.t("wa.quickMsg")); }

  /* ----- Submit ----- */
  function submit() {
    var b = formData();
    b.ref = makeRef();
    b.phone = normalisePhone(b.phone);
    b.status = 0;
    b.created = new Date().toISOString();
    var list = loadBookings();
    list.unshift(b);
    saveBookings(list);

    // Remember the farmer's details for next time (like a saved address).
    ADP.store.set(PROFILE_KEY, JSON.stringify({ name: b.name, phone: b.phone, village: b.village, lot: b.lot, loc: b.loc, unit: b.unit, size: b.size }));

    els.confirmRef.textContent = b.ref;
    els.confirmWa.href = ADP.waLink(waBookingText(b));
    els.modal.classList.add("is-open");
    els.confirmOrders.focus();
    renderOrders();
  }

  function resetForm() {
    form.reset();
    chosenDate = "";
    loc = null;
    form.querySelectorAll(".has-error").forEach(function (f) { f.classList.remove("has-error"); });
    prefill(true);
    updatePestForm();
    showStep(1);
  }

  /* ----- Prefill from saved profile or the guide page link ----- */
  function prefill(ignoreLink) {
    var p = loadJSON(PROFILE_KEY, {});
    var q = ignoreLink ? new URLSearchParams() : new URLSearchParams(window.location.search);
    els.name.value = p.name || "";
    els.phone.value = p.phone || "";
    els.village.value = p.village || "";
    els.lot.value = p.lot || "";
    loc = p.loc || null;
    els.size.value = q.get("size") || p.size || ADP.store.get("adp-size") || "1";
    els.unit.value = q.get("unit") || p.unit || ADP.store.get("adp-unit") || "acre";
    if (q.get("service")) setRadio("service", q.get("service"));
    var d = ADP.parseISODate(q.get("date"));
    if (d && d >= tomorrow()) chosenDate = ADP.toISODate(d);
    renderLocStatus();
  }

  /* =========================================================
     MY BOOKINGS: status tracker and "book again"
     ========================================================= */
  function starsHTML(n) {
    var out = "";
    for (var i = 1; i <= 5; i++) out += '<span class="star' + (n >= i ? " is-on" : "") + '">★</span>';
    return out;
  }

  function trackerHTML(status) {
    return '<ol class="tracker">' + STATUSES.map(function (s, i) {
      return '<li class="' + (i < status ? "is-done" : i === status ? "is-now" : "") + '"><i></i><span>' + ADP.t("bk.st." + s) + "</span></li>";
    }).join("") + "</ol>";
  }

  function jobTitle(b) {
    return serviceLabel(b.service) + (b.pestForm ? " · " + pestFormLabel(b.pestForm) : "");
  }

  function renderOrders() {
    var list = loadBookings().map(function (b) { if (typeof b.status !== "number") b.status = 0; return b; });
    els.count.textContent = list.length ? "(" + list.length + ")" : "";

    if (!list.length) {
      els.orders.innerHTML = '<div class="card empty-card"><p>' + ADP.t("bk.noOrders") + '</p><button type="button" class="btn btn--primary" data-newbooking="1">' + ADP.t("bk.tabNew") + "</button></div>";
      return;
    }

    els.orders.innerHTML = list.map(function (b) {
      var sow = ADP.parseISODate(b.sow), date = ADP.parseISODate(b.date);
      var cropDay = sow && date ? ADP.daysBetween(sow, date) : null;
      var done = b.status >= STATUSES.length - 1;
      var rating = "";
      if (done && b.rating) {
        rating = '<div class="feedback feedback--done"><div class="feedback__head"><span>' + ADP.t("bk.yourRating") +
          '</span><span class="stars">' + starsHTML(b.rating) + "</span></div></div>";
      } else if (done) {
        rating = '<button type="button" class="btn btn--primary btn--block" style="margin-top:14px" data-ratejob="' + b.ref + '">★ ' + ADP.t("fb.rateThis") + "</button>";
      }
      return '<article class="card order">' +
        "<header><strong>" + jobTitle(b) + '</strong><span class="ref">' + b.ref + "</span></header>" +
        trackerHTML(b.status) +
        '<ul class="order__info">' +
        "<li>" + dateLabel(b.date) + " · " + slotLabel(b.slot) + "</li>" +
        "<li>" + whereText(b) + "</li>" +
        "<li>" + esc(b.size) + " " + unitLabel(b.unit) + (b.product ? " · " + esc(b.product) + (cropDay !== null && cropDay >= 0 ? " (" + ADP.t("book.day", { n: cropDay }) + ")" : "") : "") + "</li>" +
        "</ul>" +
        rating +
        '<div class="order__actions">' +
        '<button type="button" class="btn btn--green" data-reorder="' + b.ref + '">' + ADP.t("bk.reorder") + "</button>" +
        '<a class="wa-link" href="' + ADP.waLink(ADP.t("wa.askMsg", { ref: b.ref })) + '" target="_blank" rel="noopener">' + ADP.waIcon() + ADP.t("wa.ask") + "</a>" +
        (!done ? '<button type="button" class="link-btn" data-advance="' + b.ref + '">' + ADP.t("bk.demoNext") + "</button>" : "") +
        (!done ? '<button type="button" class="link-btn link-btn--danger" data-cancel="' + b.ref + '">' + ADP.t("book.cancel") + "</button>" : "") +
        "</div></article>";
    }).join("");
  }

  function onOrdersClick(e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.hasAttribute("data-newbooking")) { showTab("new"); return; }
    if (t.hasAttribute("data-ratejob")) { showTab("feedback"); pickJob(t.getAttribute("data-ratejob")); return; }
    if (t.hasAttribute("data-advance")) {
      updateBooking(t.getAttribute("data-advance"), function (b) { b.status = Math.min((b.status || 0) + 1, STATUSES.length - 1); });
      renderOrders();
      return;
    }
    if (t.hasAttribute("data-cancel")) {
      var ref = t.getAttribute("data-cancel");
      saveBookings(loadBookings().filter(function (b) { return b.ref !== ref; }));
      renderOrders();
      return;
    }
    if (t.hasAttribute("data-reorder")) {
      var old = loadBookings().filter(function (b) { return b.ref === t.getAttribute("data-reorder"); })[0];
      if (!old) return;
      resetForm();
      loc = old.loc || null;
      els.village.value = old.village || "";
      els.lot.value = old.lot || "";
      setRadio("service", old.service);
      updatePestForm();
      setRadio("pestForm", old.pestForm);
      els.size.value = old.size;
      els.unit.value = old.unit || "acre";
      els.product.value = old.product || "";
      renderLocStatus();
      showTab("new");
      showStep(3); // same field and service — just pick a new day and time
    }
  }

  /* =========================================================
     FEEDBACK TAB
     Works from a direct link (booking.html#feedback), even if the
     booking was made by phone or on another device.
     ========================================================= */
  var FEEDBACK_KEY = "adp-feedback";
  var TAGS = { good: ["g1", "g2", "g3", "g4"], bad: ["b1", "b2", "b3", "b4"] };
  var fb = { job: "", stars: 0, tags: [] };   // job = booking ref, or "other"

  function loadFeedback() { return loadJSON(FEEDBACK_KEY, []); }

  function jobsToRate() {
    return loadBookings().filter(function (b) { return b.status >= STATUSES.length - 1 && !b.rating; });
  }

  function renderFbJobs() {
    var jobs = jobsToRate();
    els.fbJobField.hidden = !jobs.length;
    if (!jobs.length) { fb.job = "other"; els.fbRefField.hidden = false; return; }
    if (!fb.job) fb.job = jobs[0].ref;
    els.fbJobs.innerHTML = jobs.map(function (b) {
      return '<label class="fb-job' + (fb.job === b.ref ? " is-on" : "") + '"><input type="radio" name="fbjob" value="' + b.ref + '"' + (fb.job === b.ref ? " checked" : "") + ">" +
        "<span><strong>" + jobTitle(b) + "</strong><small>" + dateLabel(b.date) + " · " + whereText(b) + "</small></span></label>";
    }).join("") +
      '<label class="fb-job' + (fb.job === "other" ? " is-on" : "") + '"><input type="radio" name="fbjob" value="other"' + (fb.job === "other" ? " checked" : "") + ">" +
      "<span><strong>" + ADP.t("fb.other") + "</strong><small>" + ADP.t("fb.otherSub") + "</small></span></label>";
    els.fbRefField.hidden = fb.job !== "other";
  }

  function renderFbStars() {
    var out = "";
    for (var i = 1; i <= 5; i++) {
      out += '<button type="button" class="star star--big' + (fb.stars >= i ? " is-on" : "") + '" data-fbstar="' + i + '" aria-label="' + i + '/5">★</button>';
    }
    els.fbStars.innerHTML = out;
    var set = fb.stars && fb.stars <= 3 ? TAGS.bad : TAGS.good;
    els.fbTags.innerHTML = fb.stars ? set.map(function (t) {
      return '<button type="button" class="tagchip' + (fb.tags.indexOf(t) !== -1 ? " is-on" : "") + '" data-fbtag="' + t + '">' + ADP.t("bk.tag." + t) + "</button>";
    }).join("") : "";
  }

  function renderFbHistory() {
    var list = loadFeedback();
    var avg = list.length ? list.reduce(function (s, f) { return s + f.stars; }, 0) / list.length : 0;
    els.ratingSummary.innerHTML = list.length
      ? "<h2>" + ADP.t("fb.yours") + '</h2><p class="avg"><span class="stars">' + starsHTML(Math.round(avg)) + "</span> " +
        ADP.t("bk.avg", { avg: ADP.formatNumber(avg, 1), n: list.length }) + "</p>"
      : "";
    els.fbList.innerHTML = list.map(function (f) {
      return '<article class="card order"><header><strong>' + (f.title || ADP.t("fb.other")) + "</strong>" +
        (f.ref ? '<span class="ref">' + esc(f.ref) + "</span>" : "") + "</header>" +
        '<div class="feedback feedback--done" style="margin-top:0">' +
        '<div class="feedback__head"><span class="stars">' + starsHTML(f.stars) + "</span><span class=\"note\" style=\"margin:0\">" +
        ADP.formatDate(new Date(f.created), { day: "numeric", month: "short", year: "numeric" }) + "</span></div>" +
        (f.tags && f.tags.length ? '<div class="tags">' + f.tags.map(function (t) { return '<span class="tagchip is-on">' + ADP.t("bk.tag." + t) + "</span>"; }).join("") + "</div>" : "") +
        (f.comment ? '<p class="feedback__comment">“' + esc(f.comment) + "”</p>" : "") +
        "</div></article>";
    }).join("");
  }

  function renderFeedback() {
    renderFbJobs();
    renderFbStars();
    renderFbHistory();
  }

  function pickJob(ref) {
    resetFeedback();
    var jobs = jobsToRate();
    if (jobs.some(function (b) { return b.ref === ref; })) {
      fb.job = ref;
    } else if (ref) {
      fb.job = "other";
      els.fbRef.value = ref;
    }
    renderFeedback();
  }

  function sendFeedback() {
    if (!fb.stars) {
      els.fbStarsField.classList.add("has-error");
      els.fbStarsField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var job = fb.job !== "other" ? loadBookings().filter(function (b) { return b.ref === fb.job; })[0] : null;
    var entry = {
      ref: job ? job.ref : els.fbRef.value.trim().toUpperCase(),
      title: job ? jobTitle(job) : "",
      stars: fb.stars,
      tags: fb.tags.slice(),
      comment: els.fbComment.value.trim(),
      name: els.fbName.value.trim(),
      created: new Date().toISOString()
    };
    var list = loadFeedback();
    list.unshift(entry);
    ADP.store.set(FEEDBACK_KEY, JSON.stringify(list));
    if (job) updateBooking(job.ref, function (b) { b.rating = entry.stars; b.tags = entry.tags; b.comment = entry.comment; });

    els.fbForm.hidden = true;
    els.fbThanks.hidden = false;
    renderFbHistory();
    renderOrders();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetFeedback() {
    fb = { job: "", stars: 0, tags: [] };
    els.fbRef.value = "";
    els.fbComment.value = "";
    els.fbStarsField.classList.remove("has-error");
    els.fbForm.hidden = false;
    els.fbThanks.hidden = true;
    renderFeedback();
  }

  /* ----- Tabs (the address bar shows #book, #orders or #feedback, so each can be linked to) ----- */
  var TAB_IDS = { new: "book", orders: "orders", feedback: "feedback" };
  function showTab(which) {
    ["new", "orders", "feedback"].forEach(function (k) {
      var on = k === which;
      els["panel_" + k].hidden = !on;
      els["tab_" + k].setAttribute("aria-selected", on ? "true" : "false");
    });
    if (which === "orders") renderOrders();
    if (which === "feedback") { if (!els.fbThanks.hidden) resetFeedback(); else renderFeedback(); }
    try { history.replaceState(null, "", "#" + TAB_IDS[which]); } catch (e) { /* file:// in some browsers */ }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function tabFromHash() {
    var h = (window.location.hash || "").replace("#", "");
    if (h === "feedback") return "feedback";
    if (h === "orders") return "orders";
    return null;
  }

  /* =========================================================
     START
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    form = document.getElementById("booking-form");
    [
      ["village", "b-village"], ["lot", "b-lot"], ["size", "b-size"], ["unit", "b-unit"], ["product", "b-product"],
      ["name", "b-name"], ["phone", "b-phone"], ["notes", "b-notes"], ["consent", "b-consent"],
      ["locStatus", "loc-status"], ["whereField", "where-field"], ["serviceField", "service-field"],
      ["pestField", "pestform-field"], ["sizeField", "size-field"], ["dateField", "date-field"],
      ["slotField", "slot-field"], ["consentField", "consent-field"], ["dateChips", "date-chips"],
      ["slots", "slots"], ["summary", "summary"], ["stepper", "stepper"], ["back", "back-btn"], ["next", "next-btn"],
      ["modal", "confirm-modal"], ["confirmRef", "confirm-ref"], ["confirmOrders", "confirm-orders"],
      ["panel_new", "panel-new"], ["panel_orders", "panel-orders"], ["panel_feedback", "panel-feedback"],
      ["tab_new", "tab-new"], ["tab_orders", "tab-orders"], ["tab_feedback", "tab-feedback"],
      ["orders", "orders"], ["ratingSummary", "rating-summary"], ["count", "orders-count"],
      ["waQuick", "wa-quick"], ["confirmWa", "confirm-wa"],
      ["fbForm", "fb-form"], ["fbThanks", "fb-thanks"], ["fbJobField", "fb-job-field"], ["fbJobs", "fb-jobs"],
      ["fbRefField", "fb-ref-field"], ["fbRef", "fb-ref"], ["fbStarsField", "fb-stars-field"], ["fbStars", "fb-stars"],
      ["fbTags", "fb-tags"], ["fbComment", "fb-comment"], ["fbName", "fb-name"], ["fbList", "fb-list"]
    ].forEach(function (p) { els[p[0]] = document.getElementById(p[1]); });

    prefill();
    updatePestForm();
    showStep(1);
    renderOrders();
    setQuickLink();
    // Coming from the fertiliser guide: the service is already chosen, so start at step 2.
    if (new URLSearchParams(window.location.search).get("service") && validateStep(1, true)) showStep(2);

    document.getElementById("loc-btn").addEventListener("click", markLocation);
    els.next.addEventListener("click", goNext);
    els.back.addEventListener("click", function () { if (step > 1) showStep(step - 1); });
    form.addEventListener("submit", function (e) { e.preventDefault(); goNext(); });

    els.stepper.addEventListener("click", function (e) {
      var li = e.target.closest("li");
      if (li) goTo(Number(li.getAttribute("data-go")));
    });
    els.summary.addEventListener("click", function (e) {
      var b = e.target.closest("[data-go]");
      if (b) showStep(Number(b.getAttribute("data-go")));
    });

    form.addEventListener("click", function (e) {
      var q = e.target.closest(".qty");
      if (q) changeSize(Number(q.getAttribute("data-qty")));
      var chip = e.target.closest(".chip");
      if (chip) {
        chosenDate = chip.getAttribute("data-date");
        els.dateField.classList.remove("has-error");
        renderDateChips();
        renderSlots();
      }
    });
    form.addEventListener("input", function (e) {
      var f = e.target.closest(".field");
      if (f) f.classList.remove("has-error");
    });
    form.addEventListener("change", function (e) {
      var f = e.target.closest(".field");
      if (f) f.classList.remove("has-error");
      if (e.target.name === "service") updatePestForm();
    });

    // Tabs
    els.tab_new.addEventListener("click", function () { showTab("new"); });
    els.tab_orders.addEventListener("click", function () { showTab("orders"); });
    els.tab_feedback.addEventListener("click", function () { showTab("feedback"); });
    window.addEventListener("hashchange", function () { var t = tabFromHash(); if (t) showTab(t); });

    // My bookings
    els.orders.addEventListener("click", onOrdersClick);

    // Feedback
    els.fbName.value = loadJSON(PROFILE_KEY, {}).name || "";
    els.fbJobs.addEventListener("change", function (e) {
      if (e.target.name === "fbjob") { fb.job = e.target.value; renderFbJobs(); }
    });
    els.fbStars.addEventListener("click", function (e) {
      var s = e.target.closest("[data-fbstar]");
      if (!s) return;
      var wasGood = fb.stars > 3;
      fb.stars = Number(s.getAttribute("data-fbstar"));
      if ((fb.stars > 3) !== wasGood) fb.tags = [];
      els.fbStarsField.classList.remove("has-error");
      renderFbStars();
    });
    els.fbTags.addEventListener("click", function (e) {
      var t = e.target.closest("[data-fbtag]");
      if (!t) return;
      var tag = t.getAttribute("data-fbtag"), i = fb.tags.indexOf(tag);
      if (i === -1) fb.tags.push(tag); else fb.tags.splice(i, 1);
      renderFbStars();
    });
    document.getElementById("fb-send").addEventListener("click", sendFeedback);
    document.getElementById("fb-again").addEventListener("click", resetFeedback);

    // Direct links: booking.html#feedback (optionally ?ref=ADP-XXXXXX) or #orders
    var startTab = tabFromHash() || (new URLSearchParams(window.location.search).get("tab") === "feedback" ? "feedback" : null);
    if (startTab) {
      showTab(startTab);
      var linkRef = new URLSearchParams(window.location.search).get("ref");
      if (startTab === "feedback" && linkRef) pickJob(linkRef.toUpperCase());
    }

    // Confirmation pop-up
    function closeModal(toOrders) {
      els.modal.classList.remove("is-open");
      resetForm();
      if (toOrders) showTab("orders");
    }
    els.confirmOrders.addEventListener("click", function () { closeModal(true); });
    document.getElementById("confirm-close").addEventListener("click", function () { closeModal(false); });
    els.modal.addEventListener("click", function (e) { if (e.target === els.modal) closeModal(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && els.modal.classList.contains("is-open")) closeModal(false);
    });

    document.addEventListener("langchange", function () {
      setQuickLink();
      renderLocStatus();
      els.next.querySelector("span").textContent = ADP.t(step === 4 ? "bk.book" : "bk.next");
      if (step === 3) { renderDateChips(); renderSlots(); }
      if (step === 4) renderReview();
      renderOrders();
      renderFeedback();
    });
  });
})();
