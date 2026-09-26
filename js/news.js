/* ============================================================
   SawahKu — farming news shown on the home page
   ------------------------------------------------------------
   HOW TO ADD NEWS: copy one item below, paste it at the TOP of
   the list, and change the date, source, link and the two
   short summaries (Malay "ms" and English "en").
   Only add real news with a working link to the source.
   ============================================================ */

var NEWS_UPDATED = "2026-09-24";

var NEWS = [
  {
    date: "2026-09-24",
    source: "Utusan Malaysia",
    url: "https://www.utusan.com.my/berita/2026/09/kadar-potongan-pemutuan-ikut-kualiti-hasil-padi-kpkm/",
    tag: "price",
    ms: {
      title: "KPKM: Potongan padi di kilang ikut kualiti hasil",
      text: "Kementerian menjelaskan kadar potongan bergantung pada kualiti fizikal padi ketika dijual, bukan kadar tetap. Pemantauan di kilang padi seluruh negara bermula 14 September."
    },
    en: {
      title: "Ministry: mill deductions depend on paddy quality",
      text: "The Agriculture Ministry says the milling deduction depends on the physical quality of the paddy when it is sold, not a fixed rate. Checks at rice mills nationwide began on 14 September."
    }
  },
  {
    date: "2026-09-21",
    source: "Utusan Malaysia",
    url: "https://www.utusan.com.my/nasional/2026/09/kadar-potongan-padi-naik-10-peratus-terus-himpit-petani/",
    tag: "price",
    ms: {
      title: "Pesawah minta potongan 20% di kilang dikaji semula",
      text: "Pertubuhan PeSAWAH berkata pesawah hanya dibayar untuk 800 kg daripada setiap 1 tan padi yang dihantar, dan meminta pihak berkuasa mengkaji semula sistem potongan."
    },
    en: {
      title: "Farmers ask for review of 20% mill deduction",
      text: "Farmers' group PeSAWAH says farmers are paid for only 800 kg out of every tonne of paddy delivered, and has asked the authorities to review the deduction system."
    }
  },
  {
    date: "2026-05-07",
    source: "Malay Mail",
    url: "https://www.malaymail.com/news/malaysia/2026/05/07/govt-rolls-out-advance-payments-to-boost-paddy-farmers-cash-flow-ahead-of-planting-season/219099",
    tag: "subsidy",
    ms: {
      title: "Bayaran awal RM200 sehektar untuk kerja membajak",
      text: "Pesawah di Semenanjung menerima bayaran awal RM200 sehektar mulai 19 Mei melalui Insentif Membajak. Baki RM100 sehektar dibayar selepas kerja membajak disahkan."
    },
    en: {
      title: "RM200 per hectare paid early for ploughing",
      text: "Paddy farmers in the Peninsula receive an advance of RM200 per hectare from 19 May under the Ploughing Incentive. The remaining RM100 per hectare is paid after the ploughing is verified."
    }
  },
  {
    date: "2026-03-26",
    source: "Malay Mail",
    url: "https://www.malaymail.com/news/malaysia/2026/03/26/agriculture-ministry-to-maintain-input-subsidies-for-seeds-fertilisers-and-pesticides-despite-rising-costs-from-west-asia-unrest/214022",
    tag: "subsidy",
    ms: {
      title: "Subsidi benih, baja dan racun diteruskan",
      text: "Kementerian mengekalkan subsidi input walaupun harga baja dunia naik. Bantuan membajak dinaikkan daripada RM100 kepada RM160 sehektar, dan subsidi upah menuai RM50 sehektar diperkenalkan."
    },
    en: {
      title: "Seed, fertiliser and pesticide subsidies to continue",
      text: "The Ministry is keeping input subsidies despite rising world fertiliser prices. Ploughing aid rises from RM100 to RM160 per hectare, and a harvesting wage subsidy of RM50 per hectare is added."
    }
  }
];

(function () {
  "use strict";

  function render() {
    var list = document.getElementById("news-list");
    if (!list) return;
    var lang = APP.getLang();
    var limit = Number(list.getAttribute("data-limit")) || NEWS.length;
    list.innerHTML = NEWS.slice(0, limit).map(function (n) {
      var c = n[lang] || n.en;
      var date = APP.formatDate(APP.parseISODate(n.date), { day: "numeric", month: "short", year: "numeric" });
      return '<article class="card news">' +
        '<div class="news__meta"><span class="tag ' + (n.tag === "subsidy" ? "tag--green" : "tag--sky") + '">' + APP.t("news.tag." + n.tag) + "</span>" +
        "<span>" + date + " · " + APP.escapeHTML(n.source) + "</span></div>" +
        "<h3>" + APP.escapeHTML(c.title) + "</h3>" +
        "<p>" + APP.escapeHTML(c.text) + "</p>" +
        '<div class="news__actions">' +
        '<a href="' + n.url + '" target="_blank" rel="noopener">' + APP.t("news.read") + " →</a>" +
        '<a class="wa-link" href="' + APP.waShare(c.title + "\n" + n.url) + '" target="_blank" rel="noopener">' + APP.icons.whatsapp + APP.t("common.shareWa") + "</a>" +
        "</div></article>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
