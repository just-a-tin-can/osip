/* ============================================================
   SawahKu — Government & local agency directory + FAQ
   Used by info.html (full list) and index.html (quick links).
   Links were checked in September 2026. SawahKu is not a
   government site: it only points farmers to the official ones.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Agencies, grouped ---------- */
  var GROUPS = [
    {
      id: "main",
      ms: "Kementerian & jabatan utama", en: "Main ministry & departments",
      items: [
        { abbr: "KPKM", color: "#1f5a33", url: "https://www.kpkm.gov.my",
          ms: ["Kementerian Pertanian dan Keterjaminan Makanan", "Dasar padi, subsidi dan insentif, kenyataan media terkini."],
          en: ["Ministry of Agriculture and Food Security", "Paddy policy, subsidies and incentives, latest announcements."] },
        { abbr: "DOA", color: "#2f7a3b", url: "https://www.doa.gov.my",
          ms: ["Jabatan Pertanian Malaysia", "Nasihat tanaman, perosak dan penyakit, panduan Rice Check."],
          en: ["Department of Agriculture", "Crop advice, pests and diseases, the Rice Check guide."],
          extra: [{ ms: "Cari pejabat pertanian berdekatan", en: "Find a nearby agriculture office", url: "https://www.doa.gov.my/index.php/edirectory/edirectory_list/1" }] },
        { abbr: "JPNS", color: "#3c8c3f", url: "https://pertanian.selangor.gov.my",
          ms: ["Jabatan Pertanian Negeri Selangor", "Program dan pejabat pertanian untuk pesawah di Selangor."],
          en: ["Selangor State Department of Agriculture", "Programmes and agriculture offices for Selangor farmers."] },
        { abbr: "MARDI", color: "#6b4f9e", url: "https://www.mardi.gov.my",
          ms: ["Institut Penyelidikan dan Kemajuan Pertanian Malaysia", "Varieti padi baharu dan hasil penyelidikan."],
          en: ["Malaysian Agricultural Research and Development Institute", "New paddy varieties and research."] }
      ]
    },
    {
      id: "area",
      ms: "Kawasan jelapang padi & pertubuhan peladang", en: "Granary areas & farmers' organisations",
      items: [
        { abbr: "IADA", color: "#b0741a", url: "https://www.kpkm.gov.my/en/programs-and-initiatives/kawasan-pembangunan-pertanian-bersepadu-iada-barat-laut-selangor",
          ms: ["IADA Barat Laut Selangor", "Kawasan padi Sungai Besar, Sekinchan dan Tanjong Karang."],
          en: ["IADA North-West Selangor", "The Sungai Besar, Sekinchan and Tanjong Karang paddy area."],
          extra: [
            { ms: "Jadual pengairan musim ini", en: "This season's irrigation schedule", url: "https://makgeopadi.mysa.gov.my/IBL/jdl.html" },
            { ms: "Facebook IADA BLS", en: "IADA BLS on Facebook", url: "https://www.facebook.com/iadabaratlautselangor/" }
          ] },
        { abbr: "LPP", color: "#8a6a12", url: "https://www.lpp.gov.my",
          ms: ["Lembaga Pertubuhan Peladang", "Pertubuhan Peladang Kawasan (PPK) — saluran bantuan dan input pertanian."],
          en: ["Farmers' Organisation Authority", "Area Farmers' Organisations (PPK) — the channel for aid and farm inputs."],
          extra: [{ ms: "Direktori Pertubuhan Peladang", en: "Farmers' organisation directory", url: "https://www.lpp.gov.my/category/view/93" }] },
        { abbr: "MADA", color: "#44505e", url: "https://www.mada.gov.my",
          ms: ["Lembaga Kemajuan Pertanian Muda", "Kawasan padi Kedah dan Perlis."],
          en: ["Muda Agricultural Development Authority", "Kedah and Perlis paddy area."] },
        { abbr: "KADA", color: "#44505e", url: "http://www.kada.gov.my",
          ms: ["Lembaga Kemajuan Pertanian Kemubu", "Kawasan padi Kelantan."],
          en: ["Kemubu Agricultural Development Authority", "Kelantan paddy area."] }
      ]
    },
    {
      id: "weather",
      ms: "Cuaca, air & banjir", en: "Weather, water & floods",
      items: [
        { abbr: "MET", color: "#2f7fb8", url: "https://www.met.gov.my",
          ms: ["Jabatan Meteorologi Malaysia (MetMalaysia)", "Amaran rasmi hujan lebat dan ribut petir."],
          en: ["Malaysian Meteorological Department (MetMalaysia)", "Official heavy rain and thunderstorm warnings."],
          extra: [{ ms: "Aplikasi myCuaca", en: "myCuaca app", url: "https://www.met.gov.my/info/mycuaca/" }] },
        { abbr: "JPS", color: "#1d6fa5", url: "https://publicinfobanjir.water.gov.my",
          ms: ["Public InfoBanjir (JPS)", "Paras air sungai dan amaran banjir seluruh negara."],
          en: ["Public InfoBanjir (DID)", "River levels and flood warnings nationwide."],
          extra: [{ ms: "Info Banjir JPS Selangor", en: "Selangor DID flood info", url: "https://infobanjirjps.selangor.gov.my/water-level.html" }] }
      ]
    },
    {
      id: "safety",
      ms: "Racun perosak & keselamatan", en: "Pesticides & safety",
      items: [
        { abbr: "RACUN", color: "#b3372f", url: "http://www.portal.doa.gov.my/racunberdaftar/",
          ms: ["Semakan racun berdaftar (Jabatan Pertanian)", "Pastikan racun yang anda beli berdaftar dan sah di Malaysia."],
          en: ["Registered pesticide check (Department of Agriculture)", "Make sure the pesticide you buy is registered and legal in Malaysia."] },
        { abbr: "PRN", color: "#b3372f", url: "https://prn.usm.my",
          ms: ["Pusat Racun Negara", "Nasihat keracunan: 04-653 6999 (Isnin–Jumaat 8 pg–10 mlm; Sabtu, Ahad & cuti umum 8 pg–5 ptg). Kecemasan: 999."],
          en: ["National Poison Centre", "Poisoning advice: 04-653 6999 (Mon–Fri 8am–10pm; Sat, Sun & public holidays 8am–5pm). Emergency: 999."],
          tel: "+6046536999" }
      ]
    },
    {
      id: "money",
      ms: "Jualan padi, subsidi & perlindungan", en: "Selling paddy, subsidies & protection",
      items: [
        { abbr: "KPB", color: "#1f5a33", url: "https://skpb.kpkm.gov.my/pb/",
          ms: ["Kawalselia Padi dan Beras (KPKM)", "Mengawal selia kilang padi, termasuk pemutuan dan potongan."],
          en: ["Paddy and Rice Regulatory Section (KPKM)", "Regulates paddy mills, including grading and deductions."] },
        { abbr: "MOF", color: "#44505e", url: "https://manfaat.mof.gov.my/taxonomy/term/72",
          ms: ["Portal Manfaat (Kementerian Kewangan)", "Senarai subsidi dan insentif kerajaan yang terkini."],
          en: ["Portal Manfaat (Ministry of Finance)", "The current list of government subsidies and incentives."] },
        { abbr: "AGRO", color: "#b0741a", url: "https://www.agrobank.com.my/product/skim-takaful-tanaman-padi/",
          ms: ["Skim Takaful Tanaman Padi (Agrobank)", "Perlindungan jika tanaman rosak akibat banjir, kemarau, perosak atau penyakit. Semak syarat dan cara daftar."],
          en: ["Paddy Crop Takaful Scheme (Agrobank)", "Cover if your crop is damaged by floods, drought, pests or disease. Check the terms and how to register."] }
      ]
    }
  ];

  // Shown on the home page
  var QUICK = ["KPKM", "DOA", "IADA", "MET"];

  /* ---------- FAQ ---------- */
  var FAQ = [
    { id: "why",
      ms: ["Kenapa guna SawahKu, bukan ChatGPT atau chatbot AI lain?",
        "<p>Chatbot umum pandai menjawab soalan umum. SawahKu dibuat khas untuk <b>sawah padi anda</b>:</p><ul>" +
        "<li><b>Nasihat tempatan.</b> Perosak, penyakit dan jadual baja ikut panduan Jabatan Pertanian dan MARDI — bukan nasihat dari negara lain, sukatan asing atau racun yang tiada di Malaysia.</li>" +
        "<li><b>Jawapan yang disemak.</b> Chatbot umum kadang-kadang memberi jawapan yang kedengaran yakin tetapi salah. Jawapan SawahKu datang daripada panduan yang disemak, dan setiap satunya menunjukkan ke mana untuk mendapatkan maklumat rasmi.</li>" +
        "<li><b>Tahu kawasan anda.</b> Cuaca 7 hari untuk kawasan sawah anda, dengan nasihat sama ada sesuai menyembur dan berapa paras air.</li>" +
        "<li><b>Pesawah sebenar.</b> Di Komuniti, anda bertanya kepada pesawah sekitar yang tahu keadaan sebenar — sesuatu yang AI tidak tahu.</li>" +
        "<li><b>Semua di satu tempat.</b> Cuaca, kenal perosak, e-buku, komuniti dan laman rasmi kerajaan.</li>" +
        "<li><b>Mudah untuk semua.</b> Bahasa Melayu, huruf besar, boleh bercakap dan mendengar. Percuma, tiada akaun.</li></ul>"],
      en: ["Why use SawahKu instead of ChatGPT or another AI chatbot?",
        "<p>General chatbots are good at general questions. SawahKu is made for <b>your paddy field</b>:</p><ul>" +
        "<li><b>Local advice.</b> Pests, diseases and the fertiliser schedule follow Department of Agriculture and MARDI guidance — not advice from other countries, foreign units, or products not sold in Malaysia.</li>" +
        "<li><b>Checked answers.</b> General chatbots sometimes give answers that sound confident but are wrong. SawahKu's answers come from checked guides, and each one points you to where the official information is.</li>" +
        "<li><b>Knows your area.</b> A 7-day forecast for your paddy area, with advice on whether to spray and what water level to keep.</li>" +
        "<li><b>Real farmers.</b> In the Community you ask nearby farmers who know the real conditions — something an AI doesn't know.</li>" +
        "<li><b>All in one place.</b> Weather, pest identification, e-books, community and official government sites.</li>" +
        "<li><b>Easy for everyone.</b> Malay language, large text, speak and listen. Free, no account.</li></ul>"] },
    { id: "free",
      ms: ["Adakah SawahKu percuma?", "<p>Ya, percuma sepenuhnya. Tiada akaun atau kata laluan diperlukan.</p>"],
      en: ["Is SawahKu free?", "<p>Yes, completely free. No account or password needed.</p>"] },
    { id: "install",
      ms: ["Perlu muat turun aplikasi?", "<p>Tidak. Buka sahaja di pelayar telefon. Untuk buka dengan satu sentuhan seperti aplikasi:</p><ul><li><b>Android (Chrome):</b> tekan menu ⋮ → <b>Tambah ke skrin utama</b></li><li><b>iPhone (Safari):</b> tekan butang Kongsi → <b>Tambah ke Skrin Utama</b></li></ul>"],
      en: ["Do I need to download an app?", "<p>No. Just open it in your phone's browser. To open it with one tap like an app:</p><ul><li><b>Android (Chrome):</b> tap the ⋮ menu → <b>Add to Home screen</b></li><li><b>iPhone (Safari):</b> tap the Share button → <b>Add to Home Screen</b></li></ul>"] },
    { id: "official",
      ms: ["Adakah SawahKu laman rasmi kerajaan?", "<p>Tidak. SawahKu ialah prototaip oleh pasukan projek pelajar. Kami hanya menunjukkan jalan ke laman rasmi. Untuk subsidi, permohonan atau aduan, gunakan laman agensi dalam senarai di atas.</p>"],
      en: ["Is SawahKu an official government site?", "<p>No. SawahKu is a prototype by a student project team. We only point you to the official sites. For subsidies, applications or complaints, use the agency sites listed above.</p>"] },
    { id: "trust",
      ms: ["Bolehkah saya percaya nasihat di sini?", "<p>Nasihat di SawahKu ialah panduan umum berdasarkan sumber rasmi seperti panduan Rice Check Jabatan Pertanian. Setiap sawah berbeza. Untuk masalah serius atau yang merebak cepat, hubungi Pejabat Pertanian Daerah anda.</p>"],
      en: ["Can I trust the advice here?", "<p>SawahKu's advice is general guidance based on official sources such as the Department of Agriculture's Rice Check guide. Every field is different. For serious or fast-spreading problems, contact your District Agriculture Office.</p>"] },
    { id: "weather",
      ms: ["Dari mana datangnya ramalan cuaca?", "<p>Daripada Open-Meteo, perkhidmatan ramalan cuaca antarabangsa. Untuk <b>amaran rasmi</b> hujan lebat, ribut dan banjir, semak MetMalaysia (aplikasi myCuaca) dan Public InfoBanjir.</p>"],
      en: ["Where does the weather forecast come from?", "<p>From Open-Meteo, an international weather forecast service. For <b>official warnings</b> of heavy rain, storms and floods, check MetMalaysia (the myCuaca app) and Public InfoBanjir.</p>"] },
    { id: "subsidy",
      ms: ["Bagaimana nak mohon subsidi atau insentif?", "<p>Biasanya melalui Pertubuhan Peladang Kawasan (PPK), pejabat IADA/MADA/KADA, atau Pejabat Pertanian Daerah. Maklumat terkini ada di laman KPKM dan Portal Manfaat.</p>"],
      en: ["How do I apply for subsidies or incentives?", "<p>Usually through your Area Farmers' Organisation (PPK), your IADA/MADA/KADA office, or the District Agriculture Office. The latest details are on the KPKM website and Portal Manfaat.</p>"] },
    { id: "registered",
      ms: ["Bagaimana tahu racun yang saya beli sah?", "<p>Semak nama produk atau nombor pendaftarannya di laman <b>Racun Berdaftar</b> Jabatan Pertanian. Elakkan racun tanpa label Bahasa Melayu atau tanpa nombor pendaftaran.</p>"],
      en: ["How do I know the pesticide I bought is legal?", "<p>Check the product name or registration number on the Department of Agriculture's <b>Registered Pesticides</b> site. Avoid products without a Malay label or registration number.</p>"] },
    { id: "flood",
      ms: ["Sawah rosak kerana banjir. Ada perlindungan?", "<p>Ada. <b>Skim Takaful Tanaman Padi</b> (Agrobank) memberi perlindungan jika tanaman rosak akibat bencana seperti banjir dan kemarau. Semak syarat dan cara mendaftar di laman Agrobank atau tanya PPK anda.</p>"],
      en: ["My field was damaged by flood. Is there any cover?", "<p>Yes. The <b>Paddy Crop Takaful Scheme</b> (Agrobank) gives cover when crops are damaged by disasters such as floods and drought. Check the terms and how to register on the Agrobank site or ask your PPK.</p>"] },
    { id: "poison",
      ms: ["Siapa perlu dihubungi jika keracunan racun?", "<p>Kecemasan: <b>999</b>. Untuk nasihat keracunan, <b>Pusat Racun Negara: 04-653 6999</b>. Bawa label atau botol racun ke klinik.</p>"],
      en: ["Who do I call for pesticide poisoning?", "<p>Emergency: <b>999</b>. For poisoning advice, <b>National Poison Centre: 04-653 6999</b>. Take the label or bottle to the clinic.</p>"] },
    { id: "privacy",
      ms: ["Adakah maklumat saya selamat?", "<p>Prototaip ini tidak menghantar maklumat anda ke mana-mana pelayan. Hantaran komuniti, undian dan bacaan e-buku disimpan di telefon anda sahaja.</p>"],
      en: ["Is my information safe?", "<p>This prototype doesn't send your information to any server. Community posts, votes and e-book progress are saved on your phone only.</p>"] },
    { id: "forum",
      ms: ["Kenapa orang lain tidak nampak hantaran saya di Komuniti?", "<p>Dalam prototaip ini, hantaran disimpan di telefon anda sahaja. Versi sebenar akan berkongsi hantaran dengan semua pesawah.</p>"],
      en: ["Why can't others see my Community posts?", "<p>In this prototype, posts are saved on your phone only. The real version would share posts with all farmers.</p>"] },
    { id: "voice",
      ms: ["Bagaimana tanya dengan suara?", "<p>Di Tanya AI, tekan butang <b>mikrofon</b>, benarkan telefon menggunakan mikrofon, kemudian bercakap. Paling baik di Chrome pada telefon Android. Tekan <b>Dengar</b> untuk mendengar jawapan atau e-buku.</p>"],
      en: ["How do I ask by voice?", "<p>In Ask AI, tap the <b>microphone</b> button, allow the phone to use the microphone, then speak. Works best in Chrome on Android phones. Tap <b>Listen</b> to hear answers or e-books read aloud.</p>"] },
    { id: "lang",
      ms: ["Bagaimana tukar bahasa atau besarkan tulisan?", "<p>Tekan <b>BM</b> atau <b>EN</b> di bahagian atas skrin. Untuk tulisan lebih besar, guna butang <b>A+</b> dalam e-buku, atau besarkan tulisan dalam tetapan telefon.</p>"],
      en: ["How do I change language or make the text bigger?", "<p>Tap <b>BM</b> or <b>EN</b> at the top of the screen. For bigger text, use the <b>A+</b> button in e-books, or increase the text size in your phone settings.</p>"] }
  ];

  function all() { return GROUPS.reduce(function (a, g) { return a.concat(g.items); }, []); }
  function extLink(url, label, cls) {
    return '<a class="' + (cls || "") + '" href="' + url + '" target="_blank" rel="noopener">' + label + "</a>";
  }
  function hostOf(url) { return url.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, ""); }

  function agencyCard(a) {
    var l = APP.getLang();
    var d = a[l];
    return '<article class="agency">' +
      '<span class="agency__badge" style="--c:' + a.color + '">' + a.abbr + "</span>" +
      '<div class="agency__body"><h3>' + d[0] + "</h3><p>" + d[1] + "</p>" +
      '<div class="agency__links">' +
      extLink(a.url, APP.t("info.visit") + " <small>" + hostOf(a.url) + "</small>" + APP.icons.external, "btn btn--outline btn--sm") +
      (a.tel ? '<a class="btn btn--green btn--sm" href="tel:' + a.tel + '">' + APP.icons.phone + APP.t("info.call") + "</a>" : "") +
      (a.extra || []).map(function (x) { return extLink(x.url, x[l] + " →", "agency__extra"); }).join("") +
      "</div></div></article>";
  }

  function renderInfo() {
    var l = APP.getLang();
    var nav = document.getElementById("info-jump");
    var list = document.getElementById("info-agencies");
    var faq = document.getElementById("info-faq");
    if (nav) nav.innerHTML = GROUPS.map(function (g) { return '<a class="chip" href="#g-' + g.id + '">' + g[l] + "</a>"; }).join("") +
      '<a class="chip" href="#faq">' + APP.t("info.faqTitle") + "</a>";
    if (list) list.innerHTML = GROUPS.map(function (g) {
      return '<section class="agency-group" id="g-' + g.id + '"><h2>' + g[l] + '</h2><div class="agency-grid">' + g.items.map(agencyCard).join("") + "</div></section>";
    }).join("");
    if (faq) {
      var h = location.hash.slice(1);
      var open = FAQ.some(function (f) { return f.id === h; }) ? h : "";
      faq.innerHTML = FAQ.map(function (f) {
        return '<details class="faq" id="' + f.id + '"' + (f.id === open ? " open" : "") + "><summary>" + f[l][0] + APP.icons.chevron + '</summary><div class="faq__a">' + f[l][1] + "</div></details>";
      }).join("");
      if (open) setTimeout(function () { var el = document.getElementById(open); if (el) el.scrollIntoView({ block: "start" }); }, 60);
    }
  }

  function renderQuick() {
    var el = document.getElementById("home-agencies");
    if (!el) return;
    var l = APP.getLang();
    el.innerHTML = all().filter(function (a) { return QUICK.indexOf(a.abbr) !== -1; }).map(function (a) {
      return '<a class="agency-quick" href="' + a.url + '" target="_blank" rel="noopener"><span class="agency__badge" style="--c:' + a.color + '">' + a.abbr + "</span>" +
        "<span><strong>" + a[l][0] + "</strong><small>" + a[l][1] + "</small></span></a>";
    }).join("");
  }

  window.SK_INFO = { groups: GROUPS, faq: FAQ };

  document.addEventListener("DOMContentLoaded", function () {
    renderInfo(); renderQuick();
    document.addEventListener("langchange", function () { renderInfo(); renderQuick(); });
    // Links like info.html#why open that question
    window.addEventListener("hashchange", function () {
      var el = document.getElementById(location.hash.slice(1));
      if (el && el.tagName === "DETAILS") { el.open = true; el.scrollIntoView({ block: "start" }); }
    });
  });
})();
