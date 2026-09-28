/* ============================================================
   SawahKu — "Tanya AI" assistant
   ------------------------------------------------------------
   PROTOTYPE: this runs entirely in the browser. It matches the
   farmer's words against a small knowledge base (below and in
   cropdata.js) and replies in Malay or English. A real version
   would send the question to an AI model through a server.
   Voice: the microphone uses the browser's speech recognition,
   and "Listen" reads the answer aloud.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- General knowledge (Malay "ms" + English "en") ---------- */
  var KB = [
    {
      id: "greet", keys: ["assalamualaikum", "salam", "hai", "helo", "hello", "hi", "selamat pagi", "selamat petang", "good morning"],
      ms: "<p>Waalaikumussalam! Apa masalah sawah anda hari ini? Anda boleh tanya tentang perosak, penyakit, baja, air atau cuaca.</p>",
      en: "<p>Hello! What's happening in your field today? You can ask about pests, diseases, fertiliser, water or weather.</p>"
    },
    {
      id: "thanks", keys: ["terima kasih", "thank you", "thanks", "tq"],
      ms: "<p>Sama-sama! Semoga hasil padi anda baik musim ini.</p>",
      en: "<p>You're welcome! Wishing you a good harvest this season.</p>"
    },
    {
      id: "plan", keys: ["jadual", "kalendar", "peringatan", "tarikh tabur", "hari ke", "umur padi", "schedule", "calendar", "reminder", "sowing date", "paddy age", "field plan"],
      ms: "<p><b>Jadual sawah saya</b> kira semua kerja dari tarikh tabur anda (Rice Check 2022):</p><ul><li>Tarikh dan jumlah baja untuk keluasan sawah anda</li><li>Paras air mengikut umur padi</li><li>Bila memantau siput, rumpai, perosak dan karah tangkai</li><li>Bila keringkan sawah dan bila menuai (hari 95–105)</li></ul><p>Anda juga boleh simpan peringatan dalam kalendar telefon.</p>",
      en: "<p><b>My field schedule</b> works out every task from your sowing date (Rice Check 2022):</p><ul><li>Fertiliser dates and amounts for your field size</li><li>Water level by paddy age</li><li>When to watch for snails, weeds, pests and neck blast</li><li>When to drain the field and when to harvest (days 95–105)</li></ul><p>You can also save reminders to your phone calendar.</p>",
      link: { href: "jadual.html", key: "plan.miniT" }
    },
    {
      id: "fert", keys: ["jadual baja", "fertiliser schedule", "baja", "membaja", "urea", "npk", "fertiliser", "fertilizer", "bubuh", "kalium", "potash"],
      ms: "<p>Jadual baja <b>Rice Check 2022</b> (Jabatan Pertanian) untuk padi tabur terus, varieti 95–105 hari, <b>setiap hektar</b>:</p><ul>" +
        "<li><b>Hari 15–20:</b> baja sebatian (17.5:15.5:10 atau 17:20:10) 140 kg</li>" +
        "<li><b>Hari 25–30:</b> urea 80 kg</li>" +
        "<li><b>Hari 35–45:</b> baja sebatian 100 kg + baja tambahan 17:3:25+2MgO 100 kg</li>" +
        "<li><b>Hari 70–80:</b> baja tambahan 17:3:25+2MgO 50 kg</li></ul>" +
        "<p>1 hektar ≈ 2.5 ekar ≈ 3.5 relung. Bubuh ketika sawah berair. Jangan bubuh sebelum hujan lebat.</p><p>Masukkan tarikh tabur dalam <b>Jadual sawah saya</b> untuk dapat tarikh dan jumlah tepat bagi sawah anda.</p>",
      en: "<p><b>Rice Check 2022</b> fertiliser schedule (Department of Agriculture) for direct-seeded paddy, 95–105-day varieties, <b>per hectare</b>:</p><ul>" +
        "<li><b>Day 15–20:</b> compound fertiliser (17.5:15.5:10 or 17:20:10) 140 kg</li>" +
        "<li><b>Day 25–30:</b> urea 80 kg</li>" +
        "<li><b>Day 35–45:</b> compound 100 kg + additional 17:3:25+2MgO 100 kg</li>" +
        "<li><b>Day 70–80:</b> additional 17:3:25+2MgO 50 kg</li></ul>" +
        "<p>1 hectare ≈ 2.5 acres ≈ 3.5 relung. Apply when the field has water. Don't apply before heavy rain.</p><p>Enter your sowing date in <b>My field schedule</b> to get the exact dates and amounts for your field.</p>",
      link: { href: "jadual.html", key: "plan.miniT" }
    },
    {
      id: "water", keys: ["paras air", "air sawah", "pengairan", "mengairi", "water level", "water", "air", "takung", "irrigate", "irrigation", "banjir", "flood", "keringkan", "drain"],
      ms: "<p>Paras air mengikut umur padi:</p><ul><li><b>Hari 0–7:</b> tanah tepu, tiada air bertakung</li><li><b>Hari 7–10:</b> 3–5 cm</li><li><b>Hari 15–40:</b> 5 cm</li><li><b>Hari 40–90:</b> 5–10 cm</li><li><b>Hari 90 hingga tuai:</b> keringkan sawah (14 hari sebelum tuai)</li></ul><p>Semak halaman Cuaca untuk nasihat air setiap hari.</p>",
      en: "<p>Water level by paddy age:</p><ul><li><b>Day 0–7:</b> saturated soil, no standing water</li><li><b>Day 7–10:</b> 3–5 cm</li><li><b>Day 15–40:</b> 5 cm</li><li><b>Day 40–90:</b> 5–10 cm</li><li><b>Day 90 to harvest:</b> drain the field (14 days before harvest)</li></ul><p>Check the Weather page for daily water advice.</p>",
      link: { href: "weather.html", key: "nav.weather" }
    },
    {
      id: "spray", keys: ["bila sembur", "sesuai sembur", "masa sembur", "cuaca", "hujan", "angin", "when to spray", "safe to spray", "weather", "rain", "wind"],
      ms: "<p>Masa terbaik untuk menyembur racun atau baja:</p><ul><li>Awal pagi (sebelum pukul 10) atau lewat petang, bila angin tenang</li><li><b>Jangan sembur</b> jika hujan dijangka dalam beberapa jam — racun akan hanyut</li><li><b>Jangan sembur</b> jika angin kuat — semburan terbang ke tempat lain</li></ul><p>Halaman Cuaca menandakan setiap hari: <b>Sesuai sembur</b>, <b>awal pagi sahaja</b>, atau <b>Jangan sembur</b>.</p>",
      en: "<p>Best time to spray pesticide or fertiliser:</p><ul><li>Early morning (before 10 am) or late afternoon, when the wind is calm</li><li><b>Don't spray</b> if rain is expected within a few hours — it washes off</li><li><b>Don't spray</b> in strong wind — the spray drifts away</li></ul><p>The Weather page marks each day: <b>Good for spraying</b>, <b>early morning only</b>, or <b>Don't spray</b>.</p>",
      link: { href: "weather.html", key: "nav.weather" }
    },
    {
      id: "save", keys: ["jimat", "kos", "murah", "mahal", "kurang racun", "kurangkan racun", "save money", "cost", "cheaper", "expensive", "less pesticide", "reduce pesticide", "use less"],
      ms: "<p>Cara menjimatkan racun dan kos:</p><ul><li><b>Periksa dulu, sembur kemudian</b> — sembur hanya bila perosak benar-benar banyak</li><li>Sembur <b>kawasan yang diserang sahaja</b>, bukan seluruh sawah</li><li>Bandingkan <b>bahan aktif</b>, bukan jenama — jenama lain, bahan sama, harga berbeza</li><li>Jangan campur racun jadi \"koktel\"</li><li>Sembur pada hari cuaca sesuai supaya tidak hanyut</li><li>Jaga musuh semula jadi (labah-labah, burung pungguk jelapang) — jangan sembur terlalu awal</li><li>Baja seimbang: urea berlebihan menarik bena perang dan karah</li></ul>",
      en: "<p>Ways to use less pesticide and cut costs:</p><ul><li><b>Check first, spray later</b> — spray only when pests are really many</li><li>Spray <b>only the affected area</b>, not the whole field</li><li>Compare the <b>active ingredient</b>, not the brand — different brands, same ingredient, different price</li><li>Don't mix pesticides into a \"cocktail\"</li><li>Spray on a good weather day so it doesn't wash off</li><li>Protect natural enemies (spiders, barn owls) — don't spray too early</li><li>Balanced fertiliser: too much urea attracts planthoppers and blast</li></ul>",
      link: { href: "learn.html#ipm", key: "learn.readMore" }
    },
    {
      id: "mix", keys: ["campur", "koktel", "mix", "cocktail", "pelembut", "softener", "gabung racun"],
      ms: "<p><b>Jangan campur</b> beberapa racun menjadi satu \"koktel\", dan jangan tambah pelembut fabrik. Campuran boleh merosakkan padi, gagal membunuh perosak dan menjadikan perosak lali — akhirnya kos lebih tinggi. Guna <b>satu produk yang sesuai</b>, ikut sukatan pada label.</p>",
      en: "<p><b>Don't mix</b> several pesticides into one \"cocktail\", and don't add fabric softener. Mixes can harm the paddy, fail against the pest and make pests resistant — costing more in the end. Use <b>one suitable product</b> at the label dose.</p>"
    },
    {
      id: "brand", keys: ["jenama", "brand", "bahan aktif", "active ingredient", "racun apa", "which pesticide", "racun mana"],
      ms: "<p>Pilih racun mengikut <b>masalah</b> (perosak, penyakit atau rumpai), kemudian bandingkan <b>bahan aktif</b> pada label. Banyak jenama berbeza ada bahan aktif yang sama pada harga berbeza. Untuk cadangan terkini di kawasan anda, tanya Pejabat Pertanian Daerah atau pesawah lain di Komuniti.</p>",
      en: "<p>Choose a pesticide by the <b>problem</b> (pest, disease or weed), then compare the <b>active ingredient</b> on the label. Many brands share the same active ingredient at different prices. For current advice in your area, ask your District Agriculture Office or other farmers in the Community.</p>",
      link: { href: "forum.html", key: "nav.forum" }
    },
    {
      id: "safety", keys: ["keselamatan", "sarung tangan", "pelitup", "topeng", "keracunan", "pening", "safety", "gloves", "mask", "poisoning", "dizzy"],
      ms: "<p>Semasa menyembur:</p><ul><li>Pakai sarung tangan, pelitup muka, baju lengan panjang dan but</li><li>Jangan makan, minum atau merokok semasa menyembur</li><li>Basuh tangan dan mandi selepas itu</li><li>Simpan racun jauh daripada kanak-kanak dan makanan</li></ul><p><b>Jika rasa pening, loya atau muntah selepas menyembur:</b> berhenti, basuh kulit, dan dapatkan rawatan segera (hubungi 999). Bawa label racun ke klinik.</p>",
      en: "<p>When spraying:</p><ul><li>Wear gloves, a face mask, long sleeves and boots</li><li>Don't eat, drink or smoke while spraying</li><li>Wash your hands and shower afterwards</li><li>Keep pesticides away from children and food</li></ul><p><b>If you feel dizzy, sick or vomit after spraying:</b> stop, wash your skin, and get medical help immediately (call 999). Take the pesticide label to the clinic.</p>",
      link: { href: "learn.html#selamat", key: "learn.readMore" }
    },
    {
      id: "harvest", keys: ["tuai", "menuai", "harvest", "potongan", "hampa", "gred", "deduction", "grade"],
      ms: "<p>Untuk hasil yang baik dan potongan kilang yang kurang:</p><ul><li>Keringkan sawah <b>14 hari sebelum tuai</b></li><li>Tuai bila <b>85–90% bijirin sudah kuning</b></li><li>Jangan tuai terlalu awal (banyak hampa) atau terlalu lambat (bijirin gugur)</li></ul>",
      en: "<p>For a good harvest and a smaller mill deduction:</p><ul><li>Drain the field <b>14 days before harvest</b></li><li>Harvest when <b>85–90% of grains are yellow</b></li><li>Don't harvest too early (many empty grains) or too late (grains drop)</li></ul>",
      link: { href: "learn.html#tuai", key: "learn.readMore" }
    },
    {
      id: "seed", keys: ["benih", "varieti", "seed", "variety", "tabur", "sowing"],
      ms: "<p>Guna <b>benih sah</b> yang bersih — ia mengurangkan padi angin dan penyakit. Pilih varieti yang tahan penyakit di kawasan anda; MARDI dan Pejabat Pertanian Daerah boleh cadangkan varieti terkini. Tanam serentak dengan jiran untuk kurangkan serangan perosak.</p>",
      en: "<p>Use <b>certified clean seed</b> — it reduces weedy rice and disease. Choose a variety that resists the diseases in your area; MARDI and your District Agriculture Office can suggest current varieties. Plant at the same time as neighbours to reduce pest attacks.</p>",
      link: { href: "learn.html#asas", key: "learn.readMore" }
    },
    {
      id: "subsidy", keys: ["subsidi", "subsidy", "insentif", "incentive", "harga padi", "paddy price", "bantuan kerajaan"],
      ms: "<p>Berita terkini tentang subsidi dan harga padi ada di halaman Utama. Untuk permohonan dan kelayakan, hubungi Pejabat Pertanian Daerah, pejabat IADA/MADA, atau lihat laman web Kementerian Pertanian (KPKM).</p>",
      en: "<p>The latest subsidy and paddy price news is on the Home page. For applications and eligibility, contact your District Agriculture Office, IADA/MADA office, or the Agriculture Ministry (KPKM) website.</p>",
      link: { href: "info.html#g-money", key: "info.title" }
    },
    {
      id: "officer", keys: ["pegawai", "pejabat pertanian", "jabatan pertanian", "officer", "agriculture office", "pakar", "expert"],
      ms: "<p>Untuk masalah serius atau yang merebak cepat (contohnya tungro), hubungi <b>Pejabat Pertanian Daerah</b> anda. Mereka boleh datang melihat sawah dan memberi nasihat percuma. Laman web: doa.gov.my.</p>",
      en: "<p>For serious or fast-spreading problems (for example tungro), contact your <b>District Agriculture Office</b>. They can visit your field and advise for free. Website: doa.gov.my.</p>",
      link: { href: "https://www.doa.gov.my/index.php/edirectory/edirectory_list/1", key: "footer.doa" }
    },
    {
      id: "ricecheck", keys: ["rice check", "ricecheck", "semakan utama", "standard padi", "sasaran hasil", "10 semakan", "target yield"],
      ms: "<p><b>Rice Check</b> ialah panduan rasmi Jabatan Pertanian (disemak 2022) dengan <b>10 semakan utama</b>: tanah, petak, penyediaan tanah, penanaman, baja, air, perosak, tuai, lepas tuai dan alam sekitar.</p><ul><li>Sasaran: <b>8 tan/hektar</b> (tabur terus), <b>10 tan/hektar</b> (tanam alih)</li><li>Kadar benih tabur terus basah: <b>120–140 kg/hektar</b></li><li>Petak rata dalam <b>2.5 cm</b></li><li>Pantau sawah setiap <b>7–14 hari</b> dan catat semuanya</li></ul>",
      en: "<p><b>Rice Check</b> is the Department of Agriculture's official guide (revised 2022) with <b>10 key checks</b>: soil, plots, land preparation, planting, fertiliser, water, pests, harvest, post-harvest and environment.</p><ul><li>Targets: <b>8 t/ha</b> (direct seeding), <b>10 t/ha</b> (transplanting)</li><li>Wet direct seeding rate: <b>120–140 kg/ha</b></li><li>Plots level within <b>2.5 cm</b></li><li>Check the field every <b>7–14 days</b> and record everything</li></ul>",
      link: { href: "learn.html#ricecheck", key: "learn.readMore" }
    },
    {
      id: "banned", keys: ["haram", "diharamkan", "dilarang", "banned", "illegal", "paraquat", "karbofuran", "carbofuran", "furadan", "fentin", "endosulfan", "racun palsu", "fake pesticide", "baja palsu", "fake fertiliser"],
      ms: "<p>Racun yang <b>diharamkan</b> di Malaysia termasuk <b>paraquat</b> (2020), <b>karbofuran/Furadan</b> (2023), <b>endosulfan</b>, <b>butaklor</b> dan racun siput <b>fentin asetat</b> (tidak pernah didaftar). Pendaftaran <b>klorpirifos</b> tamat sepenuhnya pada 1 Julai 2026.</p><p>Racun yang sah ada nombor <b>LRMP.R1/</b> pada label. Tiada nombor? Jangan beli.</p>",
      en: "<p>Pesticides <b>banned</b> in Malaysia include <b>paraquat</b> (2020), <b>carbofuran/Furadan</b> (2023), <b>endosulfan</b>, <b>butachlor</b> and the snail poison <b>fentin acetate</b> (never registered). All <b>chlorpyrifos</b> registrations ended on 1 July 2026.</p><p>Legal pesticides have an <b>LRMP.R1/</b> number on the label. No number? Don't buy it.</p>",
      link: { href: "crop.html#banned", key: "crop.tabBanned" }
    },
    {
      id: "why", keys: ["chatgpt", "chat gpt", "gpt", "gemini", "copilot", "meta ai", "kenapa guna", "kenapa sawahku", "why use", "why sawahku", "beza", "different", "difference"],
      ms: "<p>Chatbot umum pandai menjawab soalan umum, tetapi SawahKu dibuat khas untuk sawah padi di Malaysia:</p><ul><li>Nasihat ikut panduan Jabatan Pertanian dan MARDI, bukan dari negara lain</li><li>Jawapan daripada panduan yang disemak, dengan pautan ke sumber rasmi</li><li>Cuaca untuk kawasan sawah anda, dengan nasihat sembur dan air</li><li>Komuniti pesawah sekitar yang tahu keadaan sebenar</li><li>Bahasa Melayu, huruf besar, boleh bercakap. Percuma.</li></ul>",
      en: "<p>General chatbots are good at general questions, but SawahKu is made for paddy fields in Malaysia:</p><ul><li>Advice follows Department of Agriculture and MARDI guidance, not other countries</li><li>Answers come from checked guides, with links to official sources</li><li>Weather for your paddy area, with spraying and water advice</li><li>A community of nearby farmers who know the real conditions</li><li>Malay language, large text, voice. Free.</li></ul>",
      link: { href: "info.html#why", key: "info.faqTitle" }
    },
    {
      id: "agency", keys: ["agensi", "kerajaan", "laman rasmi", "kpkm", "iada", "mada", "kada", "lpp", "ppk", "peladang", "agrobank", "takaful", "insurans", "insurance", "government", "agency", "official site", "pusat racun", "berdaftar", "registered"],
      ms: "<p>Semua laman rasmi untuk pesawah ada di satu halaman: KPKM, Jabatan Pertanian, MARDI, IADA Barat Laut Selangor, Pertubuhan Peladang, MetMalaysia, Public InfoBanjir, semakan racun berdaftar, Pusat Racun Negara, dan Skim Takaful Tanaman Padi.</p>",
      en: "<p>All the official sites for farmers are on one page: KPKM, the Department of Agriculture, MARDI, IADA North-West Selangor, Farmers' Organisations, MetMalaysia, Public InfoBanjir, the registered pesticide check, the National Poison Centre, and the Paddy Crop Takaful Scheme.</p>",
      link: { href: "info.html", key: "info.title" }
    },
    {
      id: "drone", keys: ["dron", "drone", "drones", "pesawat tanpa pemandu", "uav"],
      ms: "<p>Dron pertanian boleh menyembur racun atau baja dengan cepat dari udara:</p><ul><li><b>Kebaikan:</b> cepat, anda tidak terdedah kepada racun, padi tidak dipijak, boleh sembur bila sawah berlumpur</li><li><b>Had:</b> ada kos upah, tidak boleh terbang dalam hujan atau angin kuat, perlukan juruterbang terlatih dan kelulusan CAAM</li></ul><p>Kenal pasti masalah dahulu — dron yang cepat tidak membantu jika racun yang salah digunakan.</p>",
      en: "<p>Agricultural drones can spray pesticide or fertiliser quickly from the air:</p><ul><li><b>Benefits:</b> fast, you aren't exposed to pesticide, no trampled paddy, can spray when the field is muddy</li><li><b>Limits:</b> there is a fee, they can't fly in rain or strong wind, and they need a trained pilot and CAAM approval</li></ul><p>Identify the problem first — a fast drone doesn't help if the wrong product is used.</p>",
      link: { href: "learn.html#dron", key: "learn.readMore" }
    },
    {
      id: "ebook", keys: ["ebook", "e-book", "e buku", "ebuku", "e-buku", "buku", "belajar", "baca", "learn", "read", "book", "rekod", "record", "untung", "profit", "asas", "basics", "ipm", "bersepadu"],
      ms: "<p>SawahKu ada <b>e-buku</b> ringkas yang boleh dibaca atau didengar: Rice Check, asas menanam padi, masa membaja dan menyembur, panduan racun, dron, kawalan perosak bersepadu, air sawah, keselamatan racun, potongan kilang, dan buku rekod ladang.</p>",
      en: "<p>SawahKu has short <b>e-books</b> you can read or listen to: Rice Check, paddy basics, when to fertilise and spray, a pesticide guide, drones, integrated pest management, water, pesticide safety, mill deductions, and a farm record book.</p>",
      link: { href: "learn.html", key: "nav.learn" }
    },
    {
      id: "app", keys: ["cara guna", "macam mana guna", "how to use", "aplikasi ini", "this app", "tolong"],
      ms: "<p>SawahKu ada 6 bahagian (butang di bawah skrin):</p><ul><li><b>Cuaca</b> — ramalan 7 hari dan bila sesuai sembur</li><li><b>Tanya AI</b> — tanya soalan, taip atau bercakap</li><li><b>Tanaman</b> — kenal pasti perosak dan penyakit</li><li><b>Komuniti</b> — tanya dan kongsi dengan pesawah lain</li><li><b>E-Buku</b> — panduan ringkas untuk dibaca atau didengar</li><li><b>Agensi</b> — laman rasmi kerajaan dan soalan lazim</li></ul>",
      en: "<p>SawahKu has 6 parts (buttons at the bottom of the screen):</p><ul><li><b>Weather</b> — 7-day forecast and when to spray</li><li><b>Ask AI</b> — ask questions by typing or speaking</li><li><b>Crops</b> — identify pests and diseases</li><li><b>Community</b> — ask and share with other farmers</li><li><b>E-books</b> — short guides to read or listen to</li><li><b>Agencies</b> — official government sites and FAQ</li></ul>"
    }
  ];

  // Words that describe what the farmer sees → symptom tags in cropdata.js
  var SYMPTOM_WORDS = {
    yellow: ["kuning", "yellow", "oren", "orange"],
    spots: ["bintik", "tompok", "spot", "patch"],
    dying: ["kering", "mati", "terbakar", "layu", "dry", "dying", "dead", "burnt"],
    empty: ["hampa", "kosong", "tangkai putih", "empty", "white panicle"],
    seedling: ["anak benih", "seedling"],
    leaf: ["berlipat", "dimakan", "koyak", "folded", "eaten", "torn"],
    stunted: ["bantut", "kerdil", "rendah", "stunted", "short"],
    extra: ["rumpai", "rumput", "weed"]
  };

  var els = {};
  var recognition = null;

  /* ---------- Matching ---------- */
  function norm(s) { return " " + String(s).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ") + " "; }
  function has(text, key) {
    // whole words or phrases, so "air" does not match inside "baiki"
    return text.indexOf(" " + key.toLowerCase() + " ") !== -1 || (key.length > 5 && text.indexOf(key.toLowerCase()) !== -1);
  }
  function score(text, keys) {
    return keys.reduce(function (s, k) { return has(text, k) ? s + k.length : s; }, 0);
  }

  function answer(question) {
    var text = norm(question);
    var lang = APP.getLang();
    var best = null, bestScore = 0;

    // 1. A pest, disease or weed by name (names count most)
    CROP.forEach(function (c) {
      var s = score(text, c.keys.concat([c.ms.name, c.en.name])) * 1.5;
      if (s > bestScore) { best = { crop: c }; bestScore = s; }
    });
    // 2. General topics
    KB.forEach(function (k) {
      var s = score(text, k.keys);
      if (s > bestScore) { best = { kb: k }; bestScore = s; }
    });
    // 3. Symptoms ("daun kuning", "pokok kering")
    var syms = Object.keys(SYMPTOM_WORDS).filter(function (sym) { return score(text, SYMPTOM_WORDS[sym]) > 0; });
    if (syms.length && (!best || best.kb && ["spray", "water"].indexOf(best.kb.id) !== -1 || bestScore < 6)) {
      var matches = CROP.filter(function (c) { return syms.some(function (s) { return c.sym.indexOf(s) !== -1; }); });
      if (matches.length) return symptomAnswer(syms, matches, lang);
    }

    if (best && best.crop) return cropAnswer(best.crop, lang);
    if (best && best.kb) return { html: best.kb[lang] || best.kb.ms, link: best.kb.link };
    return fallback(question, lang);
  }

  function cropAnswer(c, lang) {
    var d = c[lang];
    return {
      html: "<p><b>" + d.name + "</b> (" + d.alt + ")</p><ul>" +
        "<li><b>" + APP.t("crop.signs") + ":</b> " + d.signs + "</li>" +
        "<li><b>" + APP.t("crop.threshold") + ":</b> " + d.threshold + "</li>" +
        "<li><b>" + APP.t("crop.chem") + ":</b> " + d.chem.join("; ") + "</li>" +
        "<li><b>" + APP.t("crop.action") + ":</b> " + d.action + "</li>" +
        "<li><b>" + APP.t("crop.prevent") + ":</b> " + d.prevent + "</li></ul>" +
        (d.warn ? "<p>⚠️ " + d.warn + "</p>" : "") +
        "<p><small>" + APP.t("crop.chemNote") + "</small></p>",
      link: { href: "crop.html#" + c.id, key: "ask.more" }
    };
  }

  function symptomAnswer(syms, matches, lang) {
    var intro = lang === "ms"
      ? "<p>Berdasarkan apa yang anda nampak, ia mungkin salah satu daripada ini. Semak tanda-tandanya:</p>"
      : "<p>From what you describe, it could be one of these. Check the signs:</p>";
    var list = "<ul>" + matches.slice(0, 5).map(function (c) {
      return '<li><a href="crop.html#' + c.id + '"><b>' + c[lang].name + "</b></a> — " + c[lang].signs + "</li>";
    }).join("") + "</ul>";
    var tip = lang === "ms"
      ? "<p>Jika tidak pasti, ambil gambar dan tanya di Komuniti, atau hubungi Pejabat Pertanian Daerah.</p>"
      : "<p>If unsure, take a photo and ask in the Community, or contact your District Agriculture Office.</p>";
    return { html: intro + list + tip, link: { href: "crop.html?sym=" + syms[0], key: "ask.more" }, forum: true };
  }

  function fallback(question, lang) {
    return {
      html: lang === "ms"
        ? "<p>Maaf, saya belum pasti tentang soalan itu. Cuba tanya dengan perkataan lain — contohnya nama perosak, \"daun kuning\" atau \"baja\". Atau tanya pesawah lain di Komuniti.</p>"
        : "<p>Sorry, I'm not sure about that yet. Try other words — for example a pest name, \"yellow leaves\" or \"fertiliser\". Or ask other farmers in the Community.</p>",
      forum: true
    };
  }

  /* ---------- Chat UI ---------- */
  function addMessage(who, html, extra) {
    var wrap = document.createElement("div");
    wrap.className = "msg msg--" + who;
    wrap.innerHTML = '<div class="msg__bubble">' + html + "</div>";
    if (who === "bot" && extra) {
      var tools = document.createElement("div");
      tools.className = "msg__tools";
      var plain = wrap.querySelector(".msg__bubble").textContent;
      if (APP.speech.canSpeak) {
        var b = document.createElement("button");
        b.type = "button";
        b.innerHTML = APP.icons.speaker + "<span>" + APP.t("ask.listen") + "</span>";
        b.addEventListener("click", function () { APP.speech.speak(plain); });
        tools.appendChild(b);
      }
      if (extra.link) tools.insertAdjacentHTML("beforeend", '<a href="' + extra.link.href + '"' + (/^https?:/.test(extra.link.href) ? ' target="_blank" rel="noopener"' : "") + ">" + APP.t(extra.link.key) + " →</a>");
      if (extra.forum) tools.insertAdjacentHTML("beforeend", '<a href="forum.html?new=1&title=' + encodeURIComponent(extra.question || "") + '">' + APP.icons.forum + APP.t("ask.toForum") + "</a>");
      wrap.appendChild(tools);
    }
    els.log.appendChild(wrap);
    els.log.scrollTop = els.log.scrollHeight;
  }

  var history = [];   // conversation sent to the AI (text only)

  function showTyping() {
    var typing = document.createElement("div");
    typing.className = "msg msg--bot";
    typing.innerHTML = '<div class="msg__bubble"><span class="typing"><i></i><i></i><i></i></span></div>';
    els.log.appendChild(typing);
    els.log.scrollTop = els.log.scrollHeight;
    return typing;
  }

  // Link to the crop page if the AI answer names a pest or disease we have
  function cropLinkFor(text) {
    var t = String(text).toLowerCase();
    for (var i = 0; i < CROP.length; i++) {
      var c = CROP[i];
      if (t.indexOf(c.ms.name.toLowerCase()) !== -1 || t.indexOf(c.en.name.toLowerCase()) !== -1) {
        return { href: "crop.html#" + c.id, key: "ask.more" };
      }
    }
    return null;
  }

  function offlineAnswer(question, typing, note) {
    setTimeout(function () {
      typing.remove();
      var a = answer(question);
      a.question = question;
      addMessage("bot", (note ? '<p class="msg__note">' + note + "</p>" : "") + a.html, a);
    }, note ? 0 : 600);
  }

  function ask(question) {
    question = String(question || "").trim();
    if (!question) return;
    APP.speech.stop();
    addMessage("me", APP.escapeHTML(question));
    els.input.value = "";
    autosize();
    var typing = showTyping();

    if (!window.SK_AI || !SK_AI.enabled()) { offlineAnswer(question, typing); return; }

    history.push({ role: "user", content: question });
    SK_AI.chat(history, APP.getLang()).then(function (reply) {
      if (!reply) throw new Error("empty");
      history.push({ role: "assistant", content: reply });
      typing.remove();
      addMessage("bot", SK_AI.format(reply), { question: question, link: cropLinkFor(reply), forum: true, ai: true });
    }).catch(function (err) {
      history.pop();
      offlineAnswer(question, typing, APP.t(err && err.message === "busy" ? "ask.aiBusy" : "ask.aiDown"));
    });
  }

  function renderQuick() {
    els.quick.innerHTML = ["q1", "q2", "q3", "q4", "q5", "q6"].map(function (k) {
      return '<button type="button" class="chip" data-q="' + k + '">' + APP.t("ask." + k) + "</button>";
    }).join("");
  }

  function autosize() {
    els.input.style.height = "auto";
    els.input.style.height = Math.min(els.input.scrollHeight, 140) + "px";
  }

  function toggleMic() {
    if (recognition) { recognition.stop(); return; }
    if (!APP.speech.canListen) { els.status.textContent = APP.t("ask.noMic"); return; }
    els.mic.classList.add("is-listening");
    els.status.textContent = APP.t("ask.listening");
    recognition = APP.speech.listen(function (text) {
      els.input.value = text;
      ask(text);
    }, function () {
      recognition = null;
      els.mic.classList.remove("is-listening");
      if (els.status.textContent === APP.t("ask.listening")) els.status.textContent = "";
    }, function () {
      els.status.textContent = APP.t("ask.micError");
    });
    if (!recognition) { els.mic.classList.remove("is-listening"); }
  }

  /* ---------- Start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    els.log = document.getElementById("chat-log");
    if (!els.log) return;
    els.input = document.getElementById("chat-input");
    els.quick = document.getElementById("chat-quick");
    els.mic = document.getElementById("chat-mic");
    els.status = document.getElementById("chat-status");

    // Show whether real AI is connected
    var flag = document.querySelector(".demo-flag");
    if (flag && window.SK_AI && SK_AI.enabled()) {
      flag.setAttribute("data-i18n", "ask.aiOn");
      flag.textContent = APP.t("ask.aiOn");
      flag.classList.add("is-ai");
    }

    addMessage("bot", "<p>" + APP.t("ask.hello") + "</p>");
    renderQuick();

    document.getElementById("chat-form").addEventListener("submit", function (e) { e.preventDefault(); ask(els.input.value); });
    els.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(els.input.value); }
    });
    els.input.addEventListener("input", autosize);
    els.quick.addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]");
      if (b) ask(b.textContent);
    });
    els.mic.addEventListener("click", toggleMic);
    document.addEventListener("langchange", renderQuick);

    // Question sent from the home page: ask.html?q=...
    var q = new URLSearchParams(location.search).get("q");
    if (q) ask(q);
    else if (new URLSearchParams(location.search).get("mic")) toggleMic();
  });
})();
