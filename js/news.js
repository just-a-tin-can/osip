/* ============================================================
   ADP Sytech — agricultural news for the "Info Semasa" page
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

  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';

  function waLink(text) {
    return "https://wa.me/?text=" + encodeURIComponent(text);
  }

  function render() {
    var list = document.getElementById("news-list");
    if (!list) return;
    var lang = ADP.getLang();

    list.innerHTML = NEWS.map(function (n) {
      var c = n[lang] || n.en;
      var date = ADP.formatDate(ADP.parseISODate(n.date), { day: "numeric", month: "long", year: "numeric" });
      return '<article class="card news">' +
        '<div class="news__meta"><span class="tag ' + (n.tag === "subsidy" ? "tag--fert" : "tag--water") + '">' + ADP.t("news.tag." + n.tag) + "</span>" +
        "<span>" + date + " · " + ADP.escapeHTML(n.source) + "</span></div>" +
        "<h3>" + ADP.escapeHTML(c.title) + "</h3>" +
        "<p>" + ADP.escapeHTML(c.text) + "</p>" +
        '<div class="news__actions">' +
        '<a href="' + n.url + '" target="_blank" rel="noopener">' + ADP.t("news.read") + " →</a>" +
        '<a class="wa" href="' + waLink(c.title + "\n" + n.url) + '" target="_blank" rel="noopener">' + WA_ICON + ADP.t("upd.share") + "</a>" +
        "</div></article>";
    }).join("");

    var updated = document.getElementById("news-updated");
    if (updated) updated.textContent = ADP.t("news.updated", { date: ADP.formatDate(ADP.parseISODate(NEWS_UPDATED), { day: "numeric", month: "long", year: "numeric" }) });
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("langchange", render);
})();
