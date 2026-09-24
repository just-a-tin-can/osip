/* ============================================================
   ADP Sytech — 7-day weather planner
   Live data from Open-Meteo (free, no API key). If the request
   fails (e.g. no internet), sample data is shown instead.
   ============================================================ */

(function () {
  "use strict";

  var LOCATIONS = [
    { id: "sekinchan", name: "Sekinchan, Selangor", lat: 3.5058, lon: 101.1044 },
    { id: "tjkarang", name: "Tanjong Karang, Selangor", lat: 3.4236, lon: 101.1864 },
    { id: "sgbesar", name: "Sungai Besar, Selangor", lat: 3.6743, lon: 100.9868 },
    { id: "shahalam", name: "Shah Alam, Selangor", lat: 3.0733, lon: 101.5185 },
    { id: "alorsetar", name: "Alor Setar, Kedah (MADA)", lat: 6.121, lon: 100.3678 },
    { id: "kerian", name: "Kerian, Perak", lat: 5.0333, lon: 100.4833 },
    { id: "kotabharu", name: "Kota Bharu, Kelantan (KADA)", lat: 6.1254, lon: 102.2381 }
  ];

  var DRONE_MAX_WIND = 6; // m/s — DJI Agras T20P limit

  var els = {};
  var current = null;     // { place, days: [...], live: bool }
  var myPlace = null;     // set when "Use my location" succeeds

  /* ---------- Icons ---------- */
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

  // WMO weather code → our condition key
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
  function droneAdvice(day) {
    if (day.wind > DRONE_MAX_WIND || day.rain >= 5 || day.prob >= 70 || day.cond === "storm") return "bad";
    if (day.wind > 4 || day.rain >= 1 || day.prob >= 40) return "caution";
    return "good";
  }

  function waterAdvice(day) {
    if (day.rain >= 20) return "heavy";
    if (day.rain >= 5) return "rain";
    if (day.tmax >= 33) return "hot";
    return "keep";
  }

  /* ---------- Data loading ---------- */
  function fetchForecast(place) {
    var url = "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + place.lat + "&longitude=" + place.lon +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max" +
      "&wind_speed_unit=ms&timezone=Asia%2FKuala_Lumpur&forecast_days=7";

    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (json) {
      var d = json.daily;
      return d.time.map(function (iso, i) {
        return {
          date: ADP.parseISODate(iso),
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

  // Believable sample week for offline demos.
  function sampleForecast() {
    var sample = [
      { cond: "partly", tmax: 32, tmin: 24, rain: 0.4, prob: 20, wind: 3.1 },
      { cond: "clear", tmax: 33, tmin: 24, rain: 0, prob: 10, wind: 2.6 },
      { cond: "showers", tmax: 31, tmin: 24, rain: 8.2, prob: 65, wind: 4.4 },
      { cond: "storm", tmax: 30, tmin: 23, rain: 24.5, prob: 90, wind: 7.2 },
      { cond: "rain", tmax: 30, tmin: 24, rain: 6.1, prob: 60, wind: 4.9 },
      { cond: "partly", tmax: 32, tmin: 24, rain: 1.2, prob: 35, wind: 3.4 },
      { cond: "clear", tmax: 34, tmin: 25, rain: 0, prob: 5, wind: 2.2 }
    ];
    var today = new Date();
    return sample.map(function (s, i) {
      var copy = Object.assign({}, s);
      copy.date = ADP.addDays(today, i);
      return copy;
    });
  }

  function load(place) {
    els.status.classList.remove("is-error");
    els.status.textContent = ADP.t("weather.loading");
    fetchForecast(place)
      .then(function (days) { current = { place: place, days: days, live: true }; render(); })
      .catch(function () { current = { place: place, days: sampleForecast(), live: false }; render(); });
  }

  /* ---------- Rendering ---------- */
  function render() {
    if (!current) return;
    var place = current.place;
    var placeName = place.id === "mine" ? ADP.t("weather.myLocation") : place.name;

    if (current.live) {
      els.status.classList.remove("is-error");
      els.status.textContent = ADP.t("weather.updated", { place: placeName });
    } else {
      els.status.classList.add("is-error");
      els.status.textContent = ADP.t("weather.offline");
    }

    var totalRain = 0;
    var goodDays = [];

    els.forecast.innerHTML = current.days.map(function (d, i) {
      totalRain += d.rain;
      var drone = droneAdvice(d);
      var water = waterAdvice(d);
      var dayName = i === 0 ? ADP.t("weather.today") : ADP.formatDate(d.date, { weekday: "long" });
      if (drone === "good") goodDays.push(i === 0 ? ADP.t("weather.today").toLowerCase() : ADP.formatDate(d.date, { weekday: "long" }));

      var dronePill = { good: "pill--good", caution: "pill--warn", bad: "pill--bad" }[drone];
      return '<article class="day' + (i === 0 ? " is-today" : "") + '">' +
        '<div class="day__name">' + dayName + "</div>" +
        '<div class="day__date">' + ADP.formatDate(d.date, { day: "numeric", month: "short" }) + "</div>" +
        '<div class="day__icon" role="img" aria-label="' + ADP.t("wx." + d.cond) + '">' + ICONS[d.cond] + "</div>" +
        '<div class="day__temp">' + d.tmax + "° <small>/ " + d.tmin + "°C</small></div>" +
        '<div class="day__meta"><span>' + ADP.t("wx." + d.cond) + "</span>" +
        "<span>" + ADP.t("weather.rain", { mm: ADP.formatNumber(d.rain), p: d.prob }) + "</span>" +
        "<span>" + ADP.t("weather.wind", { w: ADP.formatNumber(d.wind) }) + "</span></div>" +
        '<div class="day__advice">' +
        '<span class="pill ' + dronePill + '">' + ADP.t("weather.drone." + drone) + "</span>" +
        '<span class="pill pill--info">' + ADP.t("weather.water." + water) + "</span>" +
        "</div></article>";
    }).join("");

    var rain = ADP.formatNumber(totalRain, 0);
    var summary = goodDays.length
      ? ADP.t("weather.summary", { rain: rain, days: goodDays.join(", ") })
      : ADP.t("weather.summaryNone", { rain: rain });
    // Farmers share news with each other on WhatsApp, so make the weekly summary easy to forward.
    var shareText = placeName + ": " + summary;
    els.summary.innerHTML = "<span>" + ADP.escapeHTML(summary) +
      ' <a class="wx-share" href="https://wa.me/?text=' + encodeURIComponent(shareText) + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>' +
      ADP.t("upd.share") + "</a></span>";

    renderTarget();
  }

  function renderTarget() {
    var day = ADP.schedule ? ADP.schedule.currentDay() : ADP.crop.currentDay();
    if (day === null) {
      els.target.textContent = ADP.t("weather.targetNone");
      return;
    }
    var stage = ADP.t("stage." + ADP.crop.stageForDay(day)).toLowerCase();
    els.target.textContent = ADP.t("weather.targetWater", {
      day: Math.max(day, 0),
      stage: stage,
      depth: ADP.crop.waterForDay(day)
    });
  }

  function fillLocations() {
    var saved = ADP.store.get("adp-wx");
    els.select.innerHTML = LOCATIONS.map(function (l) {
      return '<option value="' + l.id + '">' + ADP.escapeHTML(l.name) + "</option>";
    }).join("") + (myPlace ? '<option value="mine">' + ADP.t("weather.myLocation") + "</option>" : "");
    if (myPlace && current && current.place.id === "mine") els.select.value = "mine";
    else if (saved && LOCATIONS.some(function (l) { return l.id === saved; })) els.select.value = saved;
  }

  function selectedPlace() {
    if (els.select.value === "mine" && myPlace) return myPlace;
    return LOCATIONS.filter(function (l) { return l.id === els.select.value; })[0] || LOCATIONS[0];
  }

  /* ---------- Start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    els.select = document.getElementById("wx-location");
    els.status = document.getElementById("wx-status");
    els.summary = document.getElementById("wx-summary");
    els.target = document.getElementById("wx-target");
    els.forecast = document.getElementById("wx-forecast");

    fillLocations();

    els.select.addEventListener("change", function () {
      if (els.select.value !== "mine") ADP.store.set("adp-wx", els.select.value);
      load(selectedPlace());
    });

    document.getElementById("wx-geo").addEventListener("click", function () {
      if (!navigator.geolocation) { els.status.textContent = ADP.t("weather.geoFail"); return; }
      els.status.textContent = ADP.t("weather.loading");
      navigator.geolocation.getCurrentPosition(function (pos) {
        myPlace = { id: "mine", name: "", lat: pos.coords.latitude.toFixed(3), lon: pos.coords.longitude.toFixed(3) };
        current = { place: myPlace, days: [], live: true };
        fillLocations();
        els.select.value = "mine";
        load(myPlace);
      }, function () {
        els.status.classList.add("is-error");
        els.status.textContent = ADP.t("weather.geoFail");
      }, { timeout: 10000 });
    });

    document.addEventListener("langchange", function () { fillLocations(); render(); });
    document.addEventListener("schedulechange", renderTarget);

    load(selectedPlace());
  });
})();
