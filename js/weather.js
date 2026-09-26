/* ============================================================
   SawahKu — weather
   Live 7-day forecast from Open-Meteo (free, no key). If it can't
   load (e.g. no internet), sample data is shown instead.
   - weather.html: full 7-day planner (#wx-forecast)
   - index.html:   small "today" card (#wx-mini)
   ============================================================ */

(function () {
  "use strict";

  var LOCATIONS = [
    { id: "sgbesar", name: "Sungai Besar, Selangor", lat: 3.6743, lon: 100.9868 },
    { id: "sekinchan", name: "Sekinchan, Selangor", lat: 3.5058, lon: 101.1044 },
    { id: "tjkarang", name: "Tanjong Karang, Selangor", lat: 3.4236, lon: 101.1864 },
    { id: "shahalam", name: "Shah Alam, Selangor", lat: 3.0733, lon: 101.5185 },
    { id: "alorsetar", name: "Alor Setar, Kedah", lat: 6.121, lon: 100.3678 },
    { id: "kerian", name: "Kerian, Perak", lat: 5.0333, lon: 100.4833 },
    { id: "kotabharu", name: "Kota Bharu, Kelantan", lat: 6.1254, lon: 102.2381 }
  ];
  var PLACE_KEY = "sk-wx-place";

  var els = {};
  var current = null;   // { place, days, live }
  var myPlace = null;

  /* ---------- Weather icons ---------- */
  var ICONS = {
    clear: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="9" fill="#f6c14b"/><g stroke="#f6c14b" stroke-width="3" stroke-linecap="round"><path d="M24 5v5M24 38v5M5 24h5M38 24h5M10.5 10.5l3.5 3.5M34 34l3.5 3.5M10.5 37.5l3.5-3.5M34 14l3.5-3.5"/></g></svg>',
    partly: '<svg viewBox="0 0 48 48"><circle cx="18" cy="18" r="8" fill="#f6c14b"/><path d="M16 38h20a8 8 0 0 0 0-16 11 11 0 0 0-20 3 6.5 6.5 0 0 0 0 13z" fill="#dfe6ea" stroke="#b9c4ca" stroke-width="1.5"/></svg>',
    cloudy: '<svg viewBox="0 0 48 48"><path d="M13 36h22a9 9 0 0 0 0-18 12 12 0 0 0-22 3 7.5 7.5 0 0 0 0 15z" fill="#cfd8dd" stroke="#a9b5bb" stroke-width="1.5"/></svg>',
    fog: '<svg viewBox="0 0 48 48"><path d="M13 28h22a8 8 0 0 0 0-16 11 11 0 0 0-20 3 6.5 6.5 0 0 0-2 13z" fill="#dfe6ea"/><g stroke="#a9b5bb" stroke-width="3" stroke-linecap="round"><path d="M9 34h30M13 40h22"/></g></svg>',
    drizzle: '<svg viewBox="0 0 48 48"><path d="M13 30h22a8 8 0 0 0 0-16 11 11 0 0 0-20 3 6.5 6.5 0 0 0-2 13z" fill="#cfd8dd" stroke="#a9b5bb" stroke-width="1.5"/><g stroke="#2f7fb8" stroke-width="2.5" stroke-linecap="round"><path d="M17 36v3M25 36v3M33 36v3"/></g></svg>',
    rain: '<svg viewBox="0 0 48 48"><path d="M13 28h22a8 8 0 0 0 0-16 11 11 0 0 0-20 3 6.5 6.5 0 0 0-2 13z" fill="#b9c4ca" stroke="#95a3aa" stroke-width="1.5"/><g stroke="#2f7fb8" stroke-width="3" stroke-linecap="round"><path d="M16 33l-2 6M24 33l-2 6M32 33l-2 6"/></g></svg>',
    storm: '<svg viewBox="0 0 48 48"><path d="M13 26h22a8 8 0 0 0 0-16 11 11 0 0 0-20 3 6.5 6.5 0 0 0-2 13z" fill="#8f9ca3"/><path d="M25 28l-6 9h6l-3 8 9-11h-6l3-6z" fill="#f6c14b"/><g stroke="#2f7fb8" stroke-width="2.5" stroke-linecap="round"><path d="M14 31l-2 5M35 31l-2 5"/></g></svg>'
  };
  ICONS.showers = ICONS.rain;

  function condition(code) {
    if (code === 0) return "clear";
    if (code <= 2) return "partly";
    if (code === 3) return "cloudy";
    if (code === 45 || code === 48) return "fog";
    if (code >= 51 && code <= 57) return "drizzle";
    if ((code >= 61 && code <= 67) || (code >= 71 && code <= 77)) return "rain";
    if (code >= 80 && code <= 86) return "showers";
    if (code >= 95) return "storm";
    return "cloudy";
  }

  /* ---------- Advice rules ---------- */
  // Spraying pesticide or fertiliser: rain washes it off, wind blows it away.
  function sprayAdvice(d) {
    if (d.wind > 6 || d.rain >= 5 || d.prob >= 70 || d.cond === "storm") return "bad";
    if (d.wind > 4 || d.rain >= 1 || d.prob >= 40) return "caution";
    return "good";
  }
  function waterAdvice(d) {
    if (d.rain >= 20) return "heavy";
    if (d.rain >= 5) return "rain";
    if (d.tmax >= 33) return "hot";
    return "keep";
  }

  /* ---------- Data ---------- */
  function fetchForecast(place) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + place.lat + "&longitude=" + place.lon +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max" +
      "&wind_speed_unit=ms&timezone=Asia%2FKuala_Lumpur&forecast_days=7";
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (j) {
      var d = j.daily;
      return d.time.map(function (iso, i) {
        return {
          date: APP.parseISODate(iso),
          cond: condition(d.weather_code[i]),
          tmax: Math.round(d.temperature_2m_max[i]),
          tmin: Math.round(d.temperature_2m_min[i]),
          rain: Math.round((d.precipitation_sum[i] || 0) * 10) / 10,
          prob: d.precipitation_probability_max[i] == null ? 0 : d.precipitation_probability_max[i],
          wind: Math.round((d.wind_speed_10m_max[i] || 0) * 10) / 10
        };
      });
    });
  }

  function sampleForecast() {
    var s = [
      { cond: "partly", tmax: 32, tmin: 24, rain: 0.4, prob: 20, wind: 3.1 },
      { cond: "clear", tmax: 33, tmin: 24, rain: 0, prob: 10, wind: 2.6 },
      { cond: "showers", tmax: 31, tmin: 24, rain: 8.2, prob: 65, wind: 4.4 },
      { cond: "storm", tmax: 30, tmin: 23, rain: 24.5, prob: 90, wind: 7.2 },
      { cond: "rain", tmax: 30, tmin: 24, rain: 6.1, prob: 60, wind: 4.9 },
      { cond: "partly", tmax: 32, tmin: 24, rain: 1.2, prob: 35, wind: 3.4 },
      { cond: "clear", tmax: 34, tmin: 25, rain: 0, prob: 5, wind: 2.2 }
    ];
    return s.map(function (x, i) { var c = Object.assign({}, x); c.date = APP.addDays(new Date(), i); return c; });
  }

  // "wx.rain" is the rainfall text, so the "Rain" condition uses its own key.
  function condLabel(c) { return APP.t(c === "rain" ? "wx.rain.cond" : "wx." + c); }

  function placeName(p) { return p.id === "mine" ? APP.t("wx.myLocation") : p.name; }

  function savedPlace() {
    var id = APP.store.get(PLACE_KEY);
    return LOCATIONS.filter(function (l) { return l.id === id; })[0] || LOCATIONS[0];
  }

  function load(place) {
    if (els.status) { els.status.classList.remove("is-error"); els.status.textContent = APP.t("wx.loading"); }
    fetchForecast(place)
      .then(function (days) { current = { place: place, days: days, live: true }; render(); })
      .catch(function () { current = { place: place, days: sampleForecast(), live: false }; render(); });
  }

  /* ---------- Rendering ---------- */
  function render() {
    if (!current) return;
    if (els.forecast) renderFull();
    if (els.mini) renderMini();
  }

  function pill(kind, key) {
    var cls = { good: "pill--good", caution: "pill--warn", bad: "pill--bad" }[kind] || "pill--info";
    return '<span class="pill ' + cls + '">' + APP.t(key) + "</span>";
  }

  function renderMini() {
    var d = current.days[0];
    els.mini.innerHTML =
      '<div class="today__icon" role="img" aria-label="' + condLabel(d.cond) + '">' + ICONS[d.cond] + "</div>" +
      '<div><div class="today__temp">' + d.tmax + "°C</div>" +
      "<div>" + condLabel(d.cond) + " · " + APP.t("wx.rain", { mm: APP.formatNumber(d.rain), p: d.prob }) + "</div>" +
      '<div class="today__place">' + APP.escapeHTML(placeName(current.place)) + (current.live ? "" : " · " + APP.t("wx.sampleShort")) + "</div></div>" +
      '<div class="today__advice">' + pill(sprayAdvice(d), "wx.spray." + sprayAdvice(d)) + pill("info", "wx.water." + waterAdvice(d)) + "</div>";
  }

  function renderFull() {
    var place = current.place;
    if (current.live) {
      els.status.classList.remove("is-error");
      els.status.textContent = APP.t("wx.updated", { place: placeName(place) });
    } else {
      els.status.classList.add("is-error");
      els.status.textContent = APP.t("wx.offline");
    }

    var totalRain = 0, goodDays = [];
    els.forecast.innerHTML = current.days.map(function (d, i) {
      totalRain += d.rain;
      var spray = sprayAdvice(d), water = waterAdvice(d);
      var name = i === 0 ? APP.t("wx.today") : APP.formatDate(d.date, { weekday: "long" });
      if (spray === "good") goodDays.push(i === 0 ? APP.t("wx.today").toLowerCase() : name);
      return '<article class="day' + (i === 0 ? " is-today" : "") + '">' +
        '<div class="day__name">' + name + "</div>" +
        '<div class="day__date">' + APP.formatDate(d.date, { day: "numeric", month: "short" }) + "</div>" +
        '<div class="day__icon" role="img" aria-label="' + condLabel(d.cond) + '">' + ICONS[d.cond] + "</div>" +
        '<div class="day__temp">' + d.tmax + "° <small>/ " + d.tmin + "°C</small></div>" +
        '<div class="day__meta"><span>' + condLabel(d.cond) + "</span>" +
        "<span>" + APP.t("wx.rain", { mm: APP.formatNumber(d.rain), p: d.prob }) + "</span>" +
        "<span>" + APP.t("wx.wind", { w: APP.formatNumber(d.wind) }) + "</span></div>" +
        '<div class="day__advice">' + pill(spray, "wx.spray." + spray) + pill("info", "wx.water." + water) + "</div></article>";
    }).join("");

    var rain = APP.formatNumber(totalRain, 0);
    var summary = goodDays.length
      ? APP.t("wx.summary", { rain: rain, days: goodDays.join(", ") })
      : APP.t("wx.summaryNone", { rain: rain });
    els.summary.innerHTML = "<span>" + APP.escapeHTML(summary) +
      ' <a class="wx-share" href="' + APP.waShare(placeName(place) + ": " + summary) + '" target="_blank" rel="noopener">' +
      APP.icons.whatsapp + APP.t("common.shareWa") + "</a></span>";
  }

  function fillLocations() {
    els.select.innerHTML = LOCATIONS.map(function (l) {
      return '<option value="' + l.id + '">' + APP.escapeHTML(l.name) + "</option>";
    }).join("") + (myPlace ? '<option value="mine">' + APP.t("wx.myLocation") + "</option>" : "");
    els.select.value = current && current.place.id === "mine" ? "mine" : savedPlace().id;
  }

  /* ---------- Start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    els.forecast = document.getElementById("wx-forecast");
    els.mini = document.getElementById("wx-mini");
    els.status = document.getElementById("wx-status");
    els.summary = document.getElementById("wx-summary");
    els.select = document.getElementById("wx-location");
    if (!els.forecast && !els.mini) return;

    if (els.select) {
      fillLocations();
      els.select.addEventListener("change", function () {
        if (els.select.value !== "mine") APP.store.set(PLACE_KEY, els.select.value);
        load(els.select.value === "mine" && myPlace ? myPlace : savedPlace());
      });
    }

    var geo = document.getElementById("wx-geo");
    if (geo) geo.addEventListener("click", function () {
      if (!navigator.geolocation) { els.status.textContent = APP.t("wx.geoFail"); return; }
      els.status.textContent = APP.t("wx.loading");
      navigator.geolocation.getCurrentPosition(function (pos) {
        myPlace = { id: "mine", name: "", lat: pos.coords.latitude.toFixed(3), lon: pos.coords.longitude.toFixed(3) };
        current = { place: myPlace, days: [], live: true };
        fillLocations();
        load(myPlace);
      }, function () {
        els.status.classList.add("is-error");
        els.status.textContent = APP.t("wx.geoFail");
      }, { timeout: 10000 });
    });

    document.addEventListener("langchange", function () { if (els.select) fillLocations(); render(); });
    load(savedPlace());
  });
})();
