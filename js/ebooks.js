/* ============================================================
   SawahKu — E-books (short farming guides, BM + EN)
   Each book: id, colour, icon, title/sub in both languages,
   and chapters. Chapter text is simple HTML (p, ul, ol, b).
   To add a book: copy one block below and change the text.
   ============================================================ */

(function () {
  "use strict";

  function ul(items) { return "<ul><li>" + items.join("</li><li>") + "</li></ul>"; }
  function ol(items) { return "<ol><li>" + items.join("</li><li>") + "</li></ol>"; }
  function p(t) { return "<p>" + t + "</p>"; }
  function tip(t) { return '<p class="book-tip">' + t + "</p>"; }

  window.EBOOKS = [
    /* ---------------------------------------------------------- */
    {
      id: "ricecheck", color: "#0f6b5c", icon: "clipboard", featured: true,
      ms: { title: "Rice Check: Standard Padi Malaysia", sub: "10 semakan utama Jabatan Pertanian untuk hasil tinggi" },
      en: { title: "Rice Check: Malaysia's Paddy Standard", sub: "The Department of Agriculture's 10 key checks for high yields" },
      chapters: [
        {
          ms: ["Apa itu Rice Check?",
            p("<b>Rice Check</b> ialah panduan rasmi Jabatan Pertanian Malaysia untuk mengurus tanaman padi mengikut sasaran. Ia digunakan sejak <b>2002</b> dan disemak semula pada <b>2022</b>.") +
            p("Caranya mudah: <b>perhati, ukur dan catat</b> keadaan padi pada setiap peringkat, kemudian bandingkan dengan sasaran Rice Check. Apa yang tidak capai sasaran, itulah yang perlu dibaiki.") +
            ul(["Sasaran hasil <b>tabur terus: 8 tan sehektar</b>",
              "Sasaran hasil <b>tanam alih (cedung): 10 tan sehektar</b>",
              "Purata negara pada 2020 hanya sekitar <b>4.5 tan sehektar</b> — masih banyak ruang untuk naik"]) +
            tip("Rice Check tidak memerlukan alat mahal. Yang penting ialah buat kerja yang betul pada masa yang betul, dan catat apa yang anda buat.")],
          en: ["What is Rice Check?",
            p("<b>Rice Check</b> is the Department of Agriculture Malaysia's official guide for managing a paddy crop to targets. It has been used since <b>2002</b> and was revised in <b>2022</b>.") +
            p("The method is simple: <b>observe, measure and record</b> the crop at each stage, then compare with the Rice Check targets. Whatever misses the target is what to fix.") +
            ul(["Yield target for <b>direct seeding: 8 tonnes per hectare</b>",
              "Yield target for <b>transplanting: 10 tonnes per hectare</b>",
              "The national average in 2020 was only about <b>4.5 tonnes per hectare</b> — lots of room to improve"]) +
            tip("Rice Check doesn't need expensive tools. What matters is doing the right job at the right time, and writing down what you did.")]
        },
        {
          ms: ["10 semakan utama",
            ol(["<b>Penentuan kesesuaian tanah</b> — tanah sesuai untuk padi",
              "<b>Keadaan petak sawah</b> — batas kukuh, petak rata",
              "<b>Penyediaan tanah</b> — bajak dan gelek dengan baik",
              "<b>Penanaman</b> — benih sah yang berkualiti, kadar dan jarak betul",
              "<b>Pengurusan pembajaan</b> — baja yang betul, kadar tepat, pada waktunya",
              "<b>Pengurusan air</b> — air cekap untuk kawal rumpai",
              "<b>Pengurusan perosak bersepadu</b> — pantau dan kawal ikut paras ekonomi",
              "<b>Pengurusan penuaian</b> — tuai pada masa yang betul",
              "<b>Pengendalian lepas tuai</b> — jaga kualiti selepas tuai",
              "<b>Pengurusan alam sekitar</b> — jaga air, tanah dan kesihatan"]) +
            tip("Bab seterusnya menerangkan sasaran bagi setiap semakan.")],
          en: ["The 10 key checks",
            ol(["<b>Soil suitability</b> — soil suited to paddy",
              "<b>Field plot condition</b> — strong bunds, level plots",
              "<b>Land preparation</b> — plough and puddle well",
              "<b>Planting</b> — quality certified seed, right rate and spacing",
              "<b>Fertiliser management</b> — the right fertiliser, right rate, on time",
              "<b>Water management</b> — efficient water to control weeds",
              "<b>Integrated pest management</b> — monitor and act at the economic threshold",
              "<b>Harvest management</b> — harvest at the right time",
              "<b>Post-harvest handling</b> — keep quality after harvest",
              "<b>Environmental management</b> — protect water, soil and health"]) +
            tip("The next chapters give the targets for each check.")]
        },
        {
          ms: ["Semakan 1–3: Tanah dan petak",
            ul(["<b>pH tanah 5.5–6.5.</b> Minta Pejabat Pertanian menguji tanah jika hasil selalu rendah.",
              "<b>Batas selebar 30–45 cm</b> dan kukuh supaya air tidak bocor.",
              "<b>Petak rata</b> — beza tinggi rendah tidak lebih <b>2.5 cm</b>.",
              "Bajak dan gelek sehingga tanah lembut dan sekata."]) +
            tip("Petak yang rata membolehkan air sekata di seluruh petak. Air sekata = rumpai kurang, baja sekata, padi sama rata.")],
          en: ["Checks 1–3: Soil and plots",
            ul(["<b>Soil pH 5.5–6.5.</b> Ask the Agriculture Office to test the soil if yields are always low.",
              "<b>Bunds 30–45 cm wide</b> and strong so water doesn't leak.",
              "<b>Level plots</b> — high and low spots within <b>2.5 cm</b>.",
              "Plough and puddle until the soil is soft and even."]) +
            tip("A level plot keeps water even across the whole field. Even water = fewer weeds, even fertiliser, even crop.")]
        },
        {
          ms: ["Semakan 4: Benih dan penanaman",
            p("Guna <b>benih sah</b> yang berkualiti. Kadar benih setiap hektar:") +
            ul(["Tabur terus basah: <b>120–140 kg</b>",
              "Tabur terus dalam air: <b>150–180 kg</b>",
              "Cedung mesin: <b>80 kg</b> (jarak 18 × 30 cm)",
              "Cedung tangan: <b>40 kg</b> (jarak 25 × 25 cm), 3–5 anak benih serumpun"]) +
            p("Sasaran kepadatan untuk hasil 10 tan sehektar (kira dalam 1 meter persegi):") +
            ul(["Hari 15: <b>260 anak benih</b>", "Hari 35: <b>500 pokok</b>", "Semasa masak: <b>460 tangkai</b>"])],
          en: ["Check 4: Seed and planting",
            p("Use quality <b>certified seed</b>. Seed rate per hectare:") +
            ul(["Wet direct seeding: <b>120–140 kg</b>",
              "Direct seeding into water: <b>150–180 kg</b>",
              "Machine transplanting: <b>80 kg</b> (spacing 18 × 30 cm)",
              "Hand transplanting: <b>40 kg</b> (spacing 25 × 25 cm), 3–5 seedlings per hill"]) +
            p("Density targets for a 10-tonne yield (count within 1 square metre):") +
            ul(["Day 15: <b>260 seedlings</b>", "Day 35: <b>500 plants</b>", "At maturity: <b>460 panicles</b>"])]
        },
        {
          ms: ["Semakan 5: Baja",
            p("Jadual Rice Check 2022 untuk <b>tabur terus, varieti 95–105 hari</b>, setiap hektar:") +
            ul(["<b>Hari 15–20:</b> baja sebatian (17.5:15.5:10 atau 17:20:10) 140 kg",
              "<b>Hari 25–30:</b> urea 80 kg",
              "<b>Hari 35–45:</b> baja sebatian 100 kg + baja tambahan 17:3:25+2MgO 100 kg",
              "<b>Hari 70–80:</b> baja tambahan 17:3:25+2MgO 50 kg"]) +
            ul(["Bubuh ketika sawah <b>berair</b>, dan tutup saliran keluar.",
              "Guna <b>carta warna daun</b> (aplikasi LCC Padi) untuk tahu sama ada padi perlukan nitrogen tambahan.",
              "Varieti lebih lama dan padi cedung ada jadual berbeza — tanya Pejabat Pertanian."])],
          en: ["Check 5: Fertiliser",
            p("Rice Check 2022 schedule for <b>direct seeding, 95–105-day varieties</b>, per hectare:") +
            ul(["<b>Day 15–20:</b> compound fertiliser (17.5:15.5:10 or 17:20:10) 140 kg",
              "<b>Day 25–30:</b> urea 80 kg",
              "<b>Day 35–45:</b> compound 100 kg + additional 17:3:25+2MgO 100 kg",
              "<b>Day 70–80:</b> additional 17:3:25+2MgO 50 kg"]) +
            ul(["Apply when the field <b>has water</b>, and close the outlet.",
              "Use the <b>leaf colour chart</b> (LCC Padi app) to see if the paddy needs extra nitrogen.",
              "Longer varieties and transplanted paddy have different schedules — ask the Agriculture Office."])]
        },
        {
          ms: ["Semakan 6: Air",
            ul(["<b>Hari 0–7:</b> tanah tepu, tiada air bertakung",
              "<b>Hari 7–10:</b> 3–5 cm",
              "<b>Hari 15–40:</b> 5 cm",
              "<b>Hari 40–90:</b> 5–10 cm",
              "<b>14 hari sebelum tuai:</b> keringkan sawah"]) +
            p("<b>Cara jimat air (basah-kering berselang):</b> biarkan air turun sehingga 15 cm di bawah permukaan tanah, kemudian naikkan semula ke 5–6 cm. Kekalkan 5 cm semasa padi berbunga (hari 65–70).") +
            tip("Air yang cukup pada awal musim ialah cara paling murah untuk mengawal rumpai.")],
          en: ["Check 6: Water",
            ul(["<b>Day 0–7:</b> saturated soil, no standing water",
              "<b>Day 7–10:</b> 3–5 cm",
              "<b>Day 15–40:</b> 5 cm",
              "<b>Day 40–90:</b> 5–10 cm",
              "<b>14 days before harvest:</b> drain the field"]) +
            p("<b>Water-saving option (alternate wetting and drying):</b> let the water drop to 15 cm below the soil surface, then refill to 5–6 cm. Keep 5 cm while the paddy flowers (days 65–70).") +
            tip("Enough water early in the season is the cheapest way to control weeds.")]
        },
        {
          ms: ["Semakan 7: Perosak, penyakit dan rumpai",
            p("<b>Pantau sawah setiap 7–14 hari.</b> Sembur hanya bila mencapai paras ekonomi:") +
            ul(["Tikus: <b>5% kerosakan</b>",
              "Bena perang: <b>5 dewasa atau 10 nimfa</b> setiap kuadrat",
              "Ulat pelipat daun: <b>30% daun rosak</b>",
              "Pengorek batang: <b>1 kelompok telur atau 1 rama-rama</b> setiap meter persegi",
              "Siput gondang emas: <b>1 siput</b> setiap meter persegi"]) +
            ul(["Rumpai: racun pra-cambah pada <b>hari 0–7</b>, dan kawalan kimia sebelum <b>hari 40</b> (varieti awal) atau <b>hari 60</b> (varieti lewat)."]) +
            tip("Maklumat racun yang disyorkan untuk setiap perosak ada di halaman <b>Tanaman</b>.")],
          en: ["Check 7: Pests, diseases and weeds",
            p("<b>Check the field every 7–14 days.</b> Spray only when the economic threshold is reached:") +
            ul(["Rats: <b>5% damage</b>",
              "Brown planthopper: <b>5 adults or 10 nymphs</b> per quadrat",
              "Leaf folder: <b>30% of leaves damaged</b>",
              "Stem borer: <b>1 egg mass or 1 moth</b> per square metre",
              "Golden apple snail: <b>1 snail</b> per square metre"]) +
            ul(["Weeds: pre-emergence herbicide at <b>days 0–7</b>, and chemical control before <b>day 40</b> (early varieties) or <b>day 60</b> (late varieties)."]) +
            tip("The recommended pesticides for each pest are on the <b>Crops</b> page.")]
        },
        {
          ms: ["Semakan 8–10: Tuai, lepas tuai, alam sekitar",
            ul(["Tuai bila <b>85–90% bijirin</b> dalam tangkai sudah kuning, pada hari yang kering.",
              "Hantar padi ke kilang atau kompleks pengering <b>secepat mungkin</b>, dan tutup semasa diangkut.",
              "Bilas botol racun <b>tiga kali</b>, tebuk, dan jangan guna semula.",
              "Selepas menyembur, jangan lepaskan air sawah ke parit dengan segera — tahan sekurang-kurangnya sehari."]) +
            tip("Lihat e-buku <i>Kurangkan Potongan Kilang</i> untuk cara menjaga kualiti padi.")],
          en: ["Checks 8–10: Harvest, post-harvest, environment",
            ul(["Harvest when <b>85–90% of grains</b> on the panicle are yellow, on a dry day.",
              "Send the paddy to the mill or drying complex <b>as soon as possible</b>, covered during transport.",
              "Rinse pesticide bottles <b>three times</b>, puncture them, and never reuse them.",
              "After spraying, don't release field water into drains straight away — hold it for at least a day."]) +
            tip("See the e-book <i>Reduce Mill Deductions</i> for ways to keep paddy quality high.")]
        },
        {
          ms: ["Pantau, ukur, catat",
            p("Rice Check berjaya bila anda <b>mencatat</b>. Untuk setiap musim, tulis:") +
            ul(["Tarikh tabur, varieti dan kadar benih",
              "Kiraan anak benih (hari 15), pokok (hari 35) dan tangkai (masak)",
              "Tarikh, jenis dan jumlah setiap baja",
              "Paras air setiap minggu",
              "Perosak yang dijumpai, dan racun yang digunakan",
              "Hasil (tan sehektar) dan potongan kilang"]) +
            p("Bandingkan dengan sasaran dan dengan musim lepas. Bincang dengan jiran dan pegawai pertanian — apa yang mereka buat berbeza?") +
            p('Buku penuh: <a href="https://www.doa.gov.my/doa/resources/aktiviti_sumber/sumber_awam/penerbitan/pakej_teknologi/padi/rice_check_padi_2022.pdf" target="_blank" rel="noopener">Rice Check Padi 2022 (Jabatan Pertanian, PDF)</a>')],
          en: ["Observe, measure, record",
            p("Rice Check works when you <b>keep records</b>. Each season, write down:") +
            ul(["Sowing date, variety and seed rate",
              "Counts of seedlings (day 15), plants (day 35) and panicles (maturity)",
              "Date, type and amount of each fertiliser",
              "Water level each week",
              "Pests found, and pesticides used",
              "Yield (tonnes per hectare) and mill deduction"]) +
            p("Compare with the targets and with last season. Talk with neighbours and agriculture officers — what do they do differently?") +
            p('Full book: <a href="https://www.doa.gov.my/doa/resources/aktiviti_sumber/sumber_awam/penerbitan/pakej_teknologi/padi/rice_check_padi_2022.pdf" target="_blank" rel="noopener">Rice Check Padi 2022 (Department of Agriculture, PDF)</a>')]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "asas", color: "#1f5a33", icon: "sprout",
      ms: { title: "Asas Menanam Padi", sub: "Dari menyediakan sawah hingga menuai" },
      en: { title: "Paddy Farming Basics", sub: "From preparing the field to harvest" },
      chapters: [
        {
          ms: ["Kitaran hidup padi",
            p("Kebanyakan varieti padi di Malaysia matang dalam <b>lebih kurang 105 hingga 125 hari</b>, bergantung kepada varieti. Hidup padi ada tiga fasa:") +
            ol(["<b>Fasa tumbesaran (hari 0 – lebih kurang 45):</b> anak benih tumbuh dan mengeluarkan anak pokok (bertunas). Lebih banyak anak pokok, lebih banyak tangkai nanti.",
              "<b>Fasa pembiakan (lebih kurang hari 45 – 75):</b> tangkai mula terbentuk di dalam batang, padi bunting, kemudian berbunga. Fasa ini paling sensitif — kekurangan air atau baja di sini terus mengurangkan hasil.",
              "<b>Fasa pematangan (lebih kurang hari 75 hingga tuai):</b> bijirin berisi susu, menjadi keras, kemudian kuning dan masak."]) +
            tip("Tulis tarikh tabur di buku atau kalendar. Hampir semua kerja sawah — baja, air, racun — dikira dari hari tabur.")],
          en: ["The life of a paddy plant",
            p("Most paddy varieties in Malaysia mature in <b>about 105 to 125 days</b>, depending on the variety. The plant goes through three phases:") +
            ol(["<b>Growing phase (day 0 – about 45):</b> the seedling grows and produces tillers (side shoots). More tillers means more panicles later.",
              "<b>Reproductive phase (about day 45 – 75):</b> the panicle forms inside the stem, the plant swells (booting), then flowers. This is the most sensitive phase — lack of water or fertiliser here directly cuts yield.",
              "<b>Ripening phase (about day 75 to harvest):</b> grains fill with milk, harden, then turn yellow and ripen."]) +
            tip("Write down your sowing date in a notebook or calendar. Almost every field task — fertiliser, water, spraying — is counted from sowing day.")]
        },
        {
          ms: ["Menyediakan sawah",
            ul(["Bersihkan jerami dan tunggul musim lepas. Lebih baik dibajak masuk ke tanah daripada dibakar.",
              "Bajak dan gelek tanah supaya lembut.",
              "<b>Ratakan sawah.</b> Sawah yang rata mudah dijaga airnya, baja tersebar sama rata, dan rumpai kurang tumbuh.",
              "Baiki batas dan saliran supaya air boleh dimasukkan dan dikeluarkan dengan mudah."]) +
            tip("Kawasan yang terlalu tinggi dalam sawah selalu jadi tempat rumpai dan padi angin tumbuh. Kawasan rendah pula selalu ditenggelami air.")],
          en: ["Preparing the field",
            ul(["Clear last season's straw and stubble. Ploughing it into the soil is better than burning it.",
              "Plough and puddle the soil until it is soft.",
              "<b>Level the field.</b> A level field is easier to keep at the right water depth, fertiliser spreads evenly, and fewer weeds grow.",
              "Repair the bunds and drains so water can go in and out easily."]) +
            tip("High spots in a field are where weeds and weedy rice grow. Low spots stay flooded.")]
        },
        {
          ms: ["Benih dan menabur",
            ul(["Guna <b>benih sah</b> yang bersih. Benih sendiri atau benih murah sering bercampur padi angin.",
              "Rendam benih lebih kurang <b>24 jam</b>, kemudian peram lebih kurang <b>24–36 jam</b> sehingga mula bercambah.",
              "Tabur sama rata atas tanah yang lembap tetapi tidak bertakung air.",
              "Tabur <b>serentak dengan jiran</b> mengikut jadual kawasan. Bila semua sawah sebaya, perosak tidak berpindah dari satu sawah ke sawah lain sepanjang musim."]) +
            tip("Tanya Pejabat Pertanian Daerah atau MARDI tentang varieti yang tahan penyakit di kawasan anda.")],
          en: ["Seed and sowing",
            ul(["Use <b>certified clean seed</b>. Saved or cheap seed often contains weedy rice.",
              "Soak the seed for about <b>24 hours</b>, then incubate for about <b>24–36 hours</b> until it starts to sprout.",
              "Sow evenly on soil that is wet but has no standing water.",
              "Sow <b>at the same time as your neighbours</b>, following the area schedule. When all fields are the same age, pests can't move from field to field all season."]) +
            tip("Ask your District Agriculture Office or MARDI which varieties resist the diseases in your area.")]
        },
        {
          ms: ["Menjaga padi",
            ul(["<b>Air:</b> ikut paras yang sesuai dengan umur padi. Lihat e-buku <i>Pengurusan Air Sawah</i>.",
              "<b>Rumpai:</b> 30–40 hari pertama paling penting. Rumpai yang dibiarkan berebut baja dengan padi.",
              "<b>Baja:</b> ikut jadual mengikut umur padi. Lihat e-buku <i>Masa Terbaik Membaja &amp; Menyembur</i>.",
              "<b>Periksa sawah seminggu sekali.</b> Lihat daun, batang dan pangkal pokok. Masalah yang dikesan awal lebih murah untuk diatasi."]) +
            tip("Nampak sesuatu yang pelik? Buka halaman Tanaman dan pilih apa yang anda nampak, atau ambil gambar dan tanya di Komuniti.")],
          en: ["Looking after the crop",
            ul(["<b>Water:</b> keep the level right for the paddy's age. See the e-book <i>Water Management</i>.",
              "<b>Weeds:</b> the first 30–40 days matter most. Weeds left in the field compete with paddy for fertiliser.",
              "<b>Fertiliser:</b> follow the schedule by paddy age. See the e-book <i>Best Time to Fertilise &amp; Spray</i>.",
              "<b>Walk the field once a week.</b> Look at the leaves, stems and the base of the plants. Problems found early are cheaper to fix."]) +
            tip("See something strange? Open the Crops page and pick what you see, or take a photo and ask in the Community.")]
        },
        {
          ms: ["Menuai",
            ul(["Keringkan sawah <b>14 hari sebelum tuai</b> supaya tanah cukup keras untuk mesin.",
              "Tuai bila <b>85–90% bijirin sudah kuning</b>.",
              "Terlalu awal: banyak bijirin hampa dan hijau. Terlalu lambat: bijirin gugur dan patah.",
              "Hantar padi ke kilang secepat mungkin selepas tuai."]) +
            tip("Lihat e-buku <i>Kurangkan Potongan Kilang</i> untuk cara mendapat harga yang lebih baik.")],
          en: ["Harvest",
            ul(["Drain the field <b>14 days before harvest</b> so the soil is firm enough for the machine.",
              "Harvest when <b>85–90% of grains are yellow</b>.",
              "Too early: many empty and green grains. Too late: grains fall off and break.",
              "Send the paddy to the mill as soon as possible after harvest."]) +
            tip("See the e-book <i>Reduce Mill Deductions</i> for ways to get a better price.")]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "masa", color: "#b0741a", icon: "clock",
      ms: { title: "Masa Terbaik Membaja & Menyembur", sub: "Jadual baja dan waktu sesuai menyembur racun" },
      en: { title: "Best Time to Fertilise & Spray", sub: "Fertiliser schedule and the right time to spray" },
      chapters: [
        {
          ms: ["Kenapa masa penting",
            p("Baja dan racun yang sama boleh memberi hasil yang sangat berbeza bergantung kepada <b>bila</b> ia digunakan.") +
            ul(["Padi hanya memerlukan baja tertentu pada umur tertentu. Terlalu awal atau terlalu lambat, baja itu dibazirkan.",
              "Racun yang disembur sebelum hujan akan hanyut. Wang habis, perosak masih ada.",
              "Racun yang disembur terlalu awal membunuh musuh semula jadi perosak, lalu perosak datang semula lebih banyak."]) +
            tip("Setiap tempoh membaja hanya beberapa hari. Rancang awal dan semak cuaca 7 hari di SawahKu.")],
          en: ["Why timing matters",
            p("The same fertiliser and pesticide can give very different results depending on <b>when</b> they are used.") +
            ul(["Paddy needs certain nutrients at certain ages. Too early or too late, and the fertiliser is wasted.",
              "Pesticide sprayed just before rain washes away. The money is gone and the pests are still there.",
              "Pesticide sprayed too early kills the pests' natural enemies, and the pests come back in bigger numbers."]) +
            tip("Each fertiliser window is only a few days. Plan ahead and check the 7-day weather in SawahKu.")]
        },
        {
          ms: ["Jadual baja (setiap hektar)",
            p("Panduan <b>Rice Check Padi 2022</b> Jabatan Pertanian untuk padi tabur terus, varieti 95–105 hari:") +
            ul(["<b>Hari 15–20:</b> baja sebatian (17.5:15.5:10 atau 17:20:10) 140 kg",
              "<b>Hari 25–30:</b> urea 80 kg",
              "<b>Hari 35–45:</b> baja sebatian 100 kg + baja tambahan 17:3:25+2MgO 100 kg",
              "<b>Hari 70–80:</b> baja tambahan 17:3:25+2MgO 50 kg"]) +
            p("1 hektar ≈ 2.5 ekar ≈ 3.5 relung. Untuk sawah 1 ekar, bahagikan jumlah di atas dengan 2.5.") +
            tip("Varieti lebih lama, atau padi cedung/tanam alih, ada jadual lain. Lihat e-buku <i>Rice Check</i> atau tanya Pejabat Pertanian Daerah.")],
          en: ["Fertiliser schedule (per hectare)",
            p("The Department of Agriculture's <b>Rice Check Padi 2022</b> guideline for direct-seeded paddy, 95–105-day varieties:") +
            ul(["<b>Day 15–20:</b> compound fertiliser (17.5:15.5:10 or 17:20:10) 140 kg",
              "<b>Day 25–30:</b> urea 80 kg",
              "<b>Day 35–45:</b> compound 100 kg + additional 17:3:25+2MgO 100 kg",
              "<b>Day 70–80:</b> additional 17:3:25+2MgO 50 kg"]) +
            p("1 hectare ≈ 2.5 acres ≈ 3.5 relung. For a 1-acre field, divide the amounts above by 2.5.") +
            tip("Longer varieties, or transplanted paddy, have a different schedule. See the <i>Rice Check</i> e-book or ask your District Agriculture Office.")]
        },
        {
          ms: ["Cara membaja dengan betul",
            ul(["Bubuh baja bila <b>air sawah cetek</b>, dan tutup saliran keluar beberapa hari supaya baja tidak mengalir keluar.",
              "<b>Jangan bubuh sebelum hujan lebat</b> — baja akan hanyut.",
              "Tabur sama rata. Tompok yang terlalu banyak baja jadi terlalu subur dan mudah diserang penyakit.",
              "<b>Jangan berlebihan urea.</b> Padi yang terlalu hijau dan lembut menarik bena perang dan penyakit karah.",
              "Jika baja subsidi lambat sampai, jangan tunggu terlalu lama sehingga tempoh membaja terlepas."])],
          en: ["How to apply fertiliser properly",
            ul(["Apply when the <b>field water is shallow</b>, and close the outlet for a few days so the fertiliser doesn't flow out.",
              "<b>Don't apply before heavy rain</b> — it will wash away.",
              "Spread evenly. Patches with too much fertiliser grow too lush and catch disease easily.",
              "<b>Don't overdo urea.</b> Paddy that is too green and soft attracts brown planthoppers and blast disease.",
              "If subsidy fertiliser is late, don't wait so long that you miss the window."])]
        },
        {
          ms: ["Bila perlu menyembur racun",
            ul(["<b>Periksa dulu, sembur kemudian.</b> Sembur hanya bila perosak atau penyakit benar-benar banyak, bukan ikut jadual tetap.",
              "Dalam <b>40 hari pertama</b>, padi biasanya boleh pulih daripada daun yang dimakan ulat. Elakkan racun serangga terlalu awal.",
              "Kenal pasti masalah dahulu. Racun serangga tidak membunuh kulat, dan racun kulat tidak membunuh serangga.",
              "Sembur <b>kawasan yang diserang sahaja</b> jika serangan belum merebak."]) +
            tip("Tidak pasti apa masalahnya? Guna halaman Tanaman atau tanya pegawai pertanian sebelum membeli racun.")],
          en: ["When you need to spray",
            ul(["<b>Check first, spray later.</b> Spray only when pests or disease are really many, not on a fixed calendar.",
              "In the <b>first 40 days</b>, paddy usually recovers from leaves eaten by caterpillars. Avoid insecticide too early.",
              "Identify the problem first. Insecticide doesn't kill fungus, and fungicide doesn't kill insects.",
              "Spray <b>only the affected area</b> if the attack hasn't spread."]) +
            tip("Not sure what the problem is? Use the Crops page or ask an agriculture officer before buying pesticide.")]
        },
        {
          ms: ["Waktu dan cuaca untuk menyembur",
            ul(["<b>Awal pagi</b> (sebelum pukul 10) atau <b>lewat petang</b> (selepas pukul 4) — angin tenang dan tidak terlalu panas.",
              "<b>Jangan sembur</b> jika hujan dijangka dalam beberapa jam.",
              "<b>Jangan sembur</b> bila angin kuat — racun terbang ke sawah jiran atau ke muka anda.",
              "Ikut <b>tempoh sebelum tuai</b> pada label: berhenti menyembur beberapa hari sebelum menuai seperti yang tertulis."]) +
            tip("Halaman Cuaca SawahKu menandakan setiap hari sama ada sesuai sembur, awal pagi sahaja, atau jangan sembur.")],
          en: ["Time of day and weather for spraying",
            ul(["<b>Early morning</b> (before 10 am) or <b>late afternoon</b> (after 4 pm) — calm wind and not too hot.",
              "<b>Don't spray</b> if rain is expected within a few hours.",
              "<b>Don't spray</b> in strong wind — the spray drifts to your neighbour's field or into your face.",
              "Follow the <b>pre-harvest interval</b> on the label: stop spraying the number of days before harvest that it states."]) +
            tip("SawahKu's Weather page marks each day as good for spraying, early morning only, or don't spray.")]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "racun", color: "#8c2f39", icon: "flask",
      ms: { title: "Panduan Racun & Bahan Kimia", sub: "Pilih, baca label, sukat dan elak racun haram" },
      en: { title: "Pesticides & Chemicals Guide", sub: "Choose, read the label, measure and avoid illegal products" },
      chapters: [
        {
          ms: ["Jenis-jenis racun",
            ul(["<b>Racun serangga (insektisid)</b> — bena perang, pengorek batang, ulat",
              "<b>Racun kulat (fungisid)</b> — karah, hawar seludang, bintik perang",
              "<b>Racun rumpai (herbisid)</b> — rumput, rusiga, daun lebar, padi angin",
              "<b>Racun siput (moluskisid)</b> — siput gondang emas",
              "<b>Racun tikus (rodentisid)</b> — umpan tikus"]) +
            p("<b>Penyakit bakteria dan virus tidak boleh diubati dengan racun.</b> Hawar daun bakteria dikawal dengan cara pengurusan. Tungro dikawal dengan mengawal bena hijau yang membawanya.") +
            tip("Kenal pasti masalah dahulu. Racun serangga tidak membunuh kulat, dan racun kulat tidak membunuh serangga.")],
          en: ["Types of pesticide",
            ul(["<b>Insecticides</b> — planthoppers, stem borers, caterpillars",
              "<b>Fungicides</b> — blast, sheath blight, brown spot",
              "<b>Herbicides</b> — grasses, sedges, broadleaf weeds, weedy rice",
              "<b>Molluscicides</b> — golden apple snails",
              "<b>Rodenticides</b> — rat baits"]) +
            p("<b>Bacterial and viral diseases can't be cured with pesticide.</b> Bacterial leaf blight is managed with field practices. Tungro is managed by controlling the green leafhopper that spreads it.") +
            tip("Identify the problem first. Insecticide doesn't kill fungus, and fungicide doesn't kill insects.")]
        },
        {
          ms: ["Cara membaca label",
            ul(["<b>Bahan aktif dan kepekatannya</b> — inilah \"ubat\" sebenar. Jenama berbeza boleh ada bahan aktif yang sama pada harga berbeza.",
              "<b>Nombor pendaftaran LRMP.R1/…</b> — tanda racun ini sah di Malaysia. Tiada nombor = jangan beli.",
              "<b>Tanaman dan perosak</b> yang dibenarkan — pastikan padi disenaraikan.",
              "<b>Kadar penggunaan</b> — berapa banyak setiap hektar atau setiap tangki.",
              "<b>Tempoh sebelum tuai</b> — berapa hari mesti berhenti menyembur sebelum menuai.",
              "<b>Amaran dan pertolongan cemas</b>, serta <b>tarikh luput</b>."]) +
            tip("Label mesti ada dalam Bahasa Melayu. Racun dengan label bahasa asing sahaja mungkin diseludup.")],
          en: ["How to read a label",
            ul(["<b>Active ingredient and its strength</b> — this is the real \"medicine\". Different brands can have the same active ingredient at different prices.",
              "<b>Registration number LRMP.R1/…</b> — shows the product is legal in Malaysia. No number = don't buy.",
              "<b>Crops and pests</b> it is approved for — make sure paddy is listed.",
              "<b>Application rate</b> — how much per hectare or per tank.",
              "<b>Pre-harvest interval</b> — how many days before harvest you must stop spraying.",
              "<b>Warnings and first aid</b>, and the <b>expiry date</b>."]) +
            tip("The label must be in Malay. A product with only a foreign-language label may be smuggled.")]
        },
        {
          ms: ["Jenis formulasi",
            p("Huruf selepas nama racun menunjukkan bentuknya:") +
            ul(["<b>EC</b> — cecair yang bercampur dengan air menjadi putih susu",
              "<b>SC</b> — cecair pekat; goncang dahulu sebelum guna",
              "<b>SL</b> — cecair larut penuh dalam air",
              "<b>WP</b> — serbuk; bancuh dahulu dalam sedikit air sebelum masuk tangki",
              "<b>WG / WDG</b> — butiran yang larut dalam air, kurang berdebu daripada WP",
              "<b>GR</b> — butiran untuk ditabur terus, tidak dibancuh"]) +
            tip("Masukkan air separuh tangki dahulu, kemudian racun, kemudian penuhkan air sambil dikacau.")],
          en: ["Formulation types",
            p("The letters after the product name show its form:") +
            ul(["<b>EC</b> — liquid that turns milky white in water",
              "<b>SC</b> — thick liquid; shake before use",
              "<b>SL</b> — liquid that dissolves fully in water",
              "<b>WP</b> — powder; mix in a little water first before adding to the tank",
              "<b>WG / WDG</b> — granules that dissolve in water, less dusty than WP",
              "<b>GR</b> — granules spread directly, not mixed"]) +
            tip("Fill the tank half-way with water first, then add the product, then top up with water while stirring.")]
        },
        {
          ms: ["Kumpulan racun dan rintangan",
            p("Setiap bahan aktif ada <b>nombor kumpulan</b> (IRAC untuk racun serangga, FRAC untuk racun kulat, HRAC untuk racun rumpai). Bahan aktif dalam kumpulan yang sama bertindak dengan cara yang sama.") +
            ul(["Jika kumpulan yang sama digunakan berulang kali, perosak menjadi <b>lali (tahan racun)</b>.",
              "<b>Tukar kumpulan</b> setiap semburan atau setiap musim.",
              "Contoh di Malaysia: kajian pada 2018 mendapati <b>79% populasi padi angin sudah tahan</b> racun Clearfield, dan sesetengah rumput sambau sudah tahan bispiribak."]) +
            tip("Di halaman Tanaman, nombor dalam kurungan selepas setiap bahan aktif ialah kumpulannya.")],
          en: ["Pesticide groups and resistance",
            p("Each active ingredient has a <b>group number</b> (IRAC for insecticides, FRAC for fungicides, HRAC for herbicides). Actives in the same group work the same way.") +
            ul(["Using the same group again and again makes pests <b>resistant</b>.",
              "<b>Switch groups</b> each spray or each season.",
              "Examples in Malaysia: a 2018 study found <b>79% of weedy rice populations already resistant</b> to the Clearfield herbicide, and some barnyard grass already resists bispyribac."]) +
            tip("On the Crops page, the number in brackets after each active ingredient is its group.")]
        },
        {
          ms: ["Pilih ikut masalah",
            ul(["<b>Bena perang:</b> pimetrozin (9B), buprofezin (16), imidakloprid (4A)",
              "<b>Pengorek batang:</b> klorantraniliprol (28), fipronil (2B), kartap (14)",
              "<b>Ulat pelipat daun:</b> klorantraniliprol (28)",
              "<b>Karah:</b> trisiklazol (16.1), isoprotiolan (6), azoksistrobin (11)",
              "<b>Hawar seludang:</b> heksakonazol (3), azoksistrobin + difenokonazol (11 + 3), pensikuron (20)",
              "<b>Siput gondang:</b> niklosamida, metaldehid",
              "<b>Rumpai:</b> pretilaklor (15), sihalofop-butil (1), bensulfuron-metil (2), propanil (5)",
              "<b>Pianggang:</b> imidakloprid (4A), fipronil (2B)",
              "<b>Bena belakang putih:</b> pimetrozin (9B), buprofezin (16), imidakloprid (4A)",
              "<b>Bakanae:</b> rawat benih — thiram (M3), karbendazim (1)",
              "<b>Hawar daun bakteria:</b> kuprum di semaian sahaja; tiada racun berdaftar selepas beranak maksimum",
              "<b>Tiada racun berdaftar:</b> jalur daun bakteria, reput seludang, bertih (false smut), burung"]) +
            tip("Butiran penuh, paras bertindak dan amaran untuk setiap satu ada di halaman <b>Tanaman</b>.")],
          en: ["Choose by problem",
            ul(["<b>Brown planthopper:</b> pymetrozine (9B), buprofezin (16), imidacloprid (4A)",
              "<b>Stem borer:</b> chlorantraniliprole (28), fipronil (2B), cartap (14)",
              "<b>Leaf folder:</b> chlorantraniliprole (28)",
              "<b>Blast:</b> tricyclazole (16.1), isoprothiolane (6), azoxystrobin (11)",
              "<b>Sheath blight:</b> hexaconazole (3), azoxystrobin + difenoconazole (11 + 3), pencycuron (20)",
              "<b>Golden apple snail:</b> niclosamide, metaldehyde",
              "<b>Weeds:</b> pretilachlor (15), cyhalofop-butyl (1), bensulfuron-methyl (2), propanil (5)",
              "<b>Rice ear bug:</b> imidacloprid (4A), fipronil (2B)",
              "<b>White-backed planthopper:</b> pymetrozine (9B), buprofezin (16), imidacloprid (4A)",
              "<b>Bakanae:</b> seed treatment — thiram (M3), carbendazim (1)",
              "<b>Bacterial leaf blight:</b> copper in the nursery only; no registered pesticide from maximum tillering",
              "<b>No registered pesticide:</b> bacterial leaf streak, sheath rot, false smut, birds"]) +
            tip("Full details, when to act and warnings for each are on the <b>Crops</b> page.")]
        },
        {
          ms: ["Sukat dengan betul (kalibrasi)",
            p("Label biasanya memberi kadar <b>setiap hektar</b>. Untuk tahu berapa setiap tangki:") +
            ol(["Isi tangki pam dengan <b>air sahaja</b>.",
              "Sembur satu kawasan yang diukur, contohnya <b>10 m × 10 m (100 m²)</b>, dengan langkah dan tekanan biasa.",
              "Ukur berapa liter air yang digunakan.",
              "Kira: 1 hektar = 10,000 m², jadi air sehektar = liter tadi × 100.",
              "Bahagikan air sehektar dengan saiz tangki untuk dapat <b>bilangan tangki sehektar</b>.",
              "Bahagikan kadar racun sehektar dengan bilangan tangki — itulah <b>sukatan setiap tangki</b>."]) +
            tip("Lebih banyak racun tidak lebih berkesan. Ia membazir wang, merosakkan padi dan mempercepat rintangan.")],
          en: ["Measure correctly (calibration)",
            p("Labels usually give a rate <b>per hectare</b>. To work out how much per tank:") +
            ol(["Fill the sprayer tank with <b>water only</b>.",
              "Spray a measured area, e.g. <b>10 m × 10 m (100 m²)</b>, at your normal pace and pressure.",
              "Measure how many litres of water you used.",
              "Work out: 1 hectare = 10,000 m², so water per hectare = those litres × 100.",
              "Divide water per hectare by your tank size to get <b>tanks per hectare</b>.",
              "Divide the per-hectare rate by the number of tanks — that is the <b>amount per tank</b>."]) +
            tip("More pesticide is not more effective. It wastes money, harms the paddy and speeds up resistance.")]
        },
        {
          ms: ["Racun haram dan palsu",
            ul(["<b>Diharamkan</b> tetapi masih dijumpai: paraquat, karbofuran (Furadan), endosulfan, fentin asetat (racun siput).",
              "Tanda racun haram atau palsu: <b>tiada nombor LRMP.R1/</b>, label bahasa asing sahaja, harga terlalu murah, dijual di tepi jalan atau dalam talian tanpa kedai berlesen.",
              "Kedai yang menjual racun mesti ada <b>lesen premis</b> daripada Jabatan Pertanian.",
              "Jumpa racun haram? Maklumkan kepada Pejabat Pertanian Daerah."]) +
            tip("Senarai penuh racun dan baja yang dilarang ada di halaman <b>Tanaman → Racun & baja dilarang</b>.")],
          en: ["Illegal and fake pesticides",
            ul(["<b>Banned</b> but still found: paraquat, carbofuran (Furadan), endosulfan, fentin acetate (snail poison).",
              "Signs of an illegal or fake product: <b>no LRMP.R1/ number</b>, foreign-language label only, price too cheap, sold at the roadside or online without a licensed shop.",
              "Shops selling pesticides must have a <b>premises licence</b> from the Department of Agriculture.",
              "Found an illegal product? Tell your District Agriculture Office."]) +
            tip("The full list of banned pesticides and fertiliser is on <b>Crops → Banned pesticides & fertiliser</b>.")]
        },
        {
          ms: ["Selamat untuk anda dan alam",
            ul(["Pakai sarung tangan, pelitup, baju lengan panjang dan but.",
              "Jangan sembur berdekatan parit, kolam ikan atau rumah.",
              "Ikut <b>tempoh sebelum tuai</b> pada label.",
              "Bilas botol kosong tiga kali, tebuk, dan jangan guna semula untuk air atau makanan.",
              "Keracunan: hubungi <b>999</b> atau <b>Pusat Racun Negara 04-653 6999</b>. Bawa label racun."]) +
            tip("Lihat juga e-buku <i>Keselamatan Racun Perosak</i>.")],
          en: ["Safe for you and the environment",
            ul(["Wear gloves, a mask, long sleeves and boots.",
              "Don't spray near drains, fish ponds or houses.",
              "Follow the <b>pre-harvest interval</b> on the label.",
              "Rinse empty bottles three times, puncture them, and never reuse them for water or food.",
              "Poisoning: call <b>999</b> or the <b>National Poison Centre 04-653 6999</b>. Bring the label."]) +
            tip("See also the e-book <i>Pesticide Safety</i>.")]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "dron", color: "#2f6b8f", icon: "drone",
      ms: { title: "Bagaimana Dron Membantu Pesawah", sub: "Kebaikan, had, dan soalan sebelum mengupah" },
      en: { title: "How Drones Help Farmers", sub: "Benefits, limits, and what to ask before hiring" },
      chapters: [
        {
          ms: ["Apa itu dron pertanian?",
            p("Dron pertanian ialah pesawat kecil tanpa pemandu yang dikawal dari darat. Ada dua jenis utama:") +
            ul(["<b>Dron penyembur:</b> membawa tangki kecil berisi racun atau baja cecair (ada juga yang boleh menabur baja butiran). Ia terbang rendah di atas padi mengikut laluan yang ditetapkan.",
              "<b>Dron pemetaan:</b> mengambil gambar sawah dari atas. Gambar ini boleh menunjukkan kawasan padi yang kurang sihat sebelum ia nampak dari batas."]) +
            tip("Dron hanyalah alat. Ia tidak menggantikan kerja memeriksa sawah dan memilih racun yang betul.")],
          en: ["What is an agricultural drone?",
            p("An agricultural drone is a small unmanned aircraft controlled from the ground. There are two main types:") +
            ul(["<b>Spraying drones:</b> carry a small tank of pesticide or liquid fertiliser (some can also spread granular fertiliser). They fly low over the paddy along a set route.",
              "<b>Mapping drones:</b> take photos of the field from above. These can show patches of unhealthy paddy before you can see them from the bund."]) +
            tip("A drone is only a tool. It doesn't replace checking your field and choosing the right product.")]
        },
        {
          ms: ["Kebaikan dron",
            ul(["<b>Cepat:</b> kerja menyembur yang mengambil masa berjam-jam dengan pam galas boleh siap dalam masa yang jauh lebih singkat.",
              "<b>Lebih selamat untuk pesawah:</b> anda tidak berjalan di dalam semburan racun.",
              "<b>Padi tidak dipijak:</b> tiada laluan rosak di tengah sawah.",
              "<b>Boleh sembur bila sawah berlumpur atau berair</b>, yang sukar untuk berjalan kaki.",
              "<b>Semburan lebih sekata</b> dan kurang guna air.",
              "<b>Tepat pada masanya:</b> bila serangan datang, seluruh kawasan boleh disembur dengan cepat sebelum merebak."])],
          en: ["Benefits of drones",
            ul(["<b>Fast:</b> spraying that takes hours with a knapsack sprayer can be done in much less time.",
              "<b>Safer for the farmer:</b> you don't walk through the pesticide spray.",
              "<b>No trampled paddy:</b> no damaged paths through the field.",
              "<b>Can spray when the field is muddy or flooded</b>, which is hard on foot.",
              "<b>More even coverage</b> and less water used.",
              "<b>On time:</b> when an attack comes, the whole area can be sprayed quickly before it spreads."])]
        },
        {
          ms: ["Had dan risiko",
            ul(["<b>Kos:</b> upah dikira setiap ekar atau hektar. Bandingkan dengan kos upah pekerja dan masa anda.",
              "<b>Cuaca:</b> dron tidak boleh terbang dalam hujan atau angin kuat. Semburan boleh terbawa ke sawah jiran.",
              "<b>Kelulusan:</b> di Malaysia, dron memerlukan kebenaran daripada pihak penerbangan awam (CAAM) dan juruterbang yang terlatih.",
              "<b>Bukan semua racun sesuai</b> untuk semburan isipadu rendah. Ikut label atau nasihat pegawai.",
              "<b>Salah racun tetap salah</b> — dron yang cepat tidak membantu jika masalah tidak dikenal pasti dengan betul."])],
          en: ["Limits and risks",
            ul(["<b>Cost:</b> the fee is charged per acre or hectare. Compare it with labour costs and your own time.",
              "<b>Weather:</b> drones can't fly in rain or strong wind. Spray can drift to neighbouring fields.",
              "<b>Approval:</b> in Malaysia, drones need permission from the civil aviation authority (CAAM) and a trained pilot.",
              "<b>Not every product suits low-volume spraying.</b> Follow the label or an officer's advice.",
              "<b>The wrong product is still wrong</b> — a fast drone doesn't help if the problem wasn't identified correctly."])]
        },
        {
          ms: ["Soalan sebelum mengupah perkhidmatan dron",
            ol(["Adakah juruterbang terlatih dan dron mempunyai kelulusan yang diperlukan?",
              "Berapa harga setiap ekar, dan apa yang termasuk?",
              "Siapa yang membekalkan racun atau baja — anda atau mereka?",
              "Adakah mereka menyemak cuaca dan angin sebelum terbang?",
              "Adakah mereka akan memberi rekod: tarikh, kawasan dan apa yang disembur?",
              "Apa berlaku jika hujan turun sejurus selepas menyembur?"]) +
            tip("Beritahu jiran sebelum dron menyembur berdekatan sawah mereka.")],
          en: ["Questions before hiring a drone service",
            ol(["Is the pilot trained, and does the drone have the approvals it needs?",
              "What is the price per acre, and what is included?",
              "Who supplies the pesticide or fertiliser — you or them?",
              "Do they check the weather and wind before flying?",
              "Will they give you a record: date, area and what was sprayed?",
              "What happens if it rains just after spraying?"]) +
            tip("Let your neighbours know before a drone sprays near their fields.")]
        },
        {
          ms: ["Dron dan SawahKu",
            ul(["Guna halaman <b>Tanaman</b> untuk mengenal pasti masalah dahulu.",
              "Guna halaman <b>Cuaca</b> untuk memilih hari yang tenang dan tanpa hujan.",
              "Tanya di <b>Komuniti</b> tentang pengalaman pesawah lain dengan perkhidmatan dron di kawasan anda."])],
          en: ["Drones and SawahKu",
            ul(["Use the <b>Crops</b> page to identify the problem first.",
              "Use the <b>Weather</b> page to choose a calm day without rain.",
              "Ask in the <b>Community</b> about other farmers' experience with drone services in your area."])]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "ipm", color: "#6b4f9e", icon: "shield",
      ms: { title: "Jimat Racun dengan Kawalan Bersepadu", sub: "Kurang sembur, kos lebih rendah" },
      en: { title: "Save on Pesticides with IPM", sub: "Spray less, spend less" },
      chapters: [
        {
          ms: ["Apa itu kawalan bersepadu?",
            p("Kawalan Perosak Bersepadu (IPM) bermaksud menggunakan <b>beberapa cara bersama</b> untuk mengawal perosak, dan menggunakan racun hanya bila perlu.") +
            ul(["Mencegah sebelum perosak datang",
              "Memeriksa sawah dengan kerap",
              "Menjaga musuh semula jadi perosak",
              "Menyembur hanya bila serangan benar-benar teruk"]) +
            tip("Ramai pesawah yang mengamalkan cara ini dapat mengurangkan kos racun tanpa hasil berkurangan.")],
          en: ["What is integrated pest management?",
            p("Integrated Pest Management (IPM) means using <b>several methods together</b> to control pests, and using pesticide only when needed.") +
            ul(["Preventing pests before they come",
              "Checking the field regularly",
              "Protecting the pests' natural enemies",
              "Spraying only when an attack is really serious"]) +
            tip("Many farmers who follow this approach cut their pesticide costs without losing yield.")]
        },
        {
          ms: ["Cara memeriksa sawah",
            ol(["Jalan di dalam sawah dalam bentuk <b>zig-zag</b>, bukan di tepi batas sahaja.",
              "Berhenti di sekurang-kurangnya <b>20 rumpun</b> padi di tempat berbeza.",
              "Tolak pokok sedikit dan lihat <b>pangkal batang</b> — bena perang suka duduk di situ.",
              "Lihat daun: bintik, jalur kuning, daun berlipat atau dimakan.",
              "<b>Tulis</b> apa yang anda jumpa dan tarikhnya. Bandingkan minggu depan: bertambah atau berkurang?"]) +
            tip("Ambil gambar dengan telefon. Gambar membantu bila bertanya di Komuniti atau kepada pegawai.")],
          en: ["How to check your field",
            ol(["Walk through the field in a <b>zig-zag</b>, not only along the bund.",
              "Stop at at least <b>20 hills</b> of paddy in different places.",
              "Push the plants aside and look at the <b>base of the stems</b> — brown planthoppers like to sit there.",
              "Look at the leaves: spots, yellow stripes, folded or eaten leaves.",
              "<b>Write down</b> what you find and the date. Compare next week: more or fewer?"]) +
            tip("Take photos with your phone. Photos help when asking in the Community or an officer.")]
        },
        {
          ms: ["Kawan pesawah",
            p("Banyak makhluk di sawah sebenarnya <b>memakan perosak</b> untuk anda secara percuma:") +
            ul(["<b>Labah-labah</b> — memakan bena perang dan rama-rama",
              "<b>Kumbang kura-kura</b> dan <b>pepatung</b> — memakan serangga kecil",
              "<b>Burung pungguk jelapang</b> — memakan tikus. Kotak sarang pungguk di tepi sawah membantu."]) +
            p("Racun serangga yang disembur terlalu awal atau terlalu kerap membunuh kawan-kawan ini. Selepas itu, perosak kembali lebih banyak kerana tiada lagi yang memakannya.")],
          en: ["The farmer's friends",
            p("Many creatures in the field actually <b>eat pests</b> for you, for free:") +
            ul(["<b>Spiders</b> — eat planthoppers and moths",
              "<b>Ladybird beetles</b> and <b>dragonflies</b> — eat small insects",
              "<b>Barn owls</b> — eat rats. Owl nest boxes near the field help."]) +
            p("Insecticide sprayed too early or too often kills these friends. Afterwards, pests come back in bigger numbers because nothing is eating them.")]
        },
        {
          ms: ["Mencegah lebih baik",
            ul(["Guna benih sah dan varieti yang tahan penyakit",
              "Tabur serentak dengan jiran",
              "Baja seimbang — jangan berlebihan urea",
              "Bersihkan rumpai di batas dan saliran — ia tempat perosak bersembunyi",
              "Kawal tikus bersama-sama sekampung, bukan seorang diri",
              "Kutip siput gondang dan telurnya awal musim"])],
          en: ["Prevention is better",
            ul(["Use certified seed and disease-resistant varieties",
              "Sow at the same time as your neighbours",
              "Balanced fertiliser — don't overdo urea",
              "Clear weeds on bunds and drains — pests hide there",
              "Control rats together as a village, not alone",
              "Collect golden apple snails and their eggs early in the season"])]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "air", color: "#1d6fa5", icon: "drop",
      ms: { title: "Pengurusan Air Sawah", sub: "Paras air yang betul pada setiap umur padi" },
      en: { title: "Water Management", sub: "The right water level at every stage" },
      chapters: [
        {
          ms: ["Kenapa air penting",
            ul(["Air yang cukup menghalang rumpai daripada tumbuh.",
              "Baja lebih berkesan bila paras air betul.",
              "Padi yang kekurangan air ketika bunting dan berbunga akan menghasilkan banyak bijirin hampa."])],
          en: ["Why water matters",
            ul(["Enough water stops weeds from growing.",
              "Fertiliser works better when the water level is right.",
              "Paddy that lacks water while booting and flowering produces many empty grains."])]
        },
        {
          ms: ["Paras air mengikut umur",
            ul(["<b>Hari 0–7:</b> tanah tepu (lembap), tiada air bertakung",
              "<b>Hari 7–10:</b> 3–5 cm",
              "<b>Hari 15–40:</b> 5 cm",
              "<b>Hari 40–90:</b> 5–10 cm",
              "<b>Hari 90 hingga tuai:</b> keringkan sawah (14 hari sebelum tuai)"]) +
            tip("3 cm lebih kurang setinggi ruas pertama jari. 10 cm lebih kurang selebar tapak tangan.")],
          en: ["Water level by age",
            ul(["<b>Day 0–7:</b> saturated (wet) soil, no standing water",
              "<b>Day 7–10:</b> 3–5 cm",
              "<b>Day 15–40:</b> 5 cm",
              "<b>Day 40–90:</b> 5–10 cm",
              "<b>Day 90 to harvest:</b> drain the field (14 days before harvest)"]) +
            tip("3 cm is about the length of the top joint of your finger. 10 cm is about the width of your palm.")]
        },
        {
          ms: ["Bila air kurang atau terlalu banyak",
            ul(["<b>Musim kering:</b> utamakan air ketika padi bunting dan berbunga — inilah masa paling penting.",
              "<b>Hujan lebat:</b> buka saliran supaya anak padi tidak tenggelam terlalu lama. Anak padi yang tenggelam beberapa hari boleh mati.",
              "<b>Selepas hujan:</b> semak semula paras air dan batas yang pecah."]) +
            tip("Halaman Cuaca SawahKu memberi nasihat air setiap hari berdasarkan hujan yang dijangka.")],
          en: ["When water is short or too much",
            ul(["<b>Dry season:</b> prioritise water while the paddy is booting and flowering — this is the most important time.",
              "<b>Heavy rain:</b> open the drains so young paddy isn't underwater for too long. Seedlings submerged for several days can die.",
              "<b>After rain:</b> check the water level again and look for broken bunds."]) +
            tip("SawahKu's Weather page gives water advice each day based on the expected rain.")]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "selamat", color: "#b3372f", icon: "hand",
      ms: { title: "Keselamatan Racun Perosak", sub: "Lindungi diri dan keluarga" },
      en: { title: "Pesticide Safety", sub: "Protect yourself and your family" },
      chapters: [
        {
          ms: ["Pakaian pelindung",
            ul(["Sarung tangan getah atau nitril",
              "Pelitup muka (topeng) dan cermin mata",
              "Baju lengan panjang dan seluar panjang",
              "But getah — jangan berkaki ayam"]) +
            tip("Basuh pakaian menyembur berasingan daripada pakaian keluarga.")],
          en: ["Protective clothing",
            ul(["Rubber or nitrile gloves",
              "A face mask and goggles",
              "Long sleeves and long trousers",
              "Rubber boots — never barefoot"]) +
            tip("Wash spraying clothes separately from the family's laundry.")]
        },
        {
          ms: ["Membancuh dan menyembur",
            ul(["<b>Baca label</b> sebelum membuka botol.",
              "Sukat dengan tepat. Lebih banyak racun tidak bermakna lebih berkesan — ia membazir dan boleh merosakkan padi.",
              "Bancuh di tempat terbuka, jauh daripada perigi, sungai dan kanak-kanak.",
              "Jangan campur beberapa racun menjadi \"koktel\".",
              "Jangan makan, minum atau merokok semasa menyembur.",
              "Sembur mengikut arah angin — jangan berjalan ke dalam semburan sendiri."])],
          en: ["Mixing and spraying",
            ul(["<b>Read the label</b> before opening the bottle.",
              "Measure exactly. More pesticide doesn't mean better — it wastes money and can harm the paddy.",
              "Mix outdoors, away from wells, rivers and children.",
              "Don't mix several pesticides into a \"cocktail\".",
              "Don't eat, drink or smoke while spraying.",
              "Spray with the wind behind you — don't walk into your own spray."])]
        },
        {
          ms: ["Menyimpan dan membuang",
            ul(["Simpan racun dalam bekas asal, di tempat berkunci, jauh daripada makanan dan kanak-kanak.",
              "<b>Jangan sekali-kali</b> gunakan botol racun kosong untuk air minuman atau makanan.",
              "Bilas botol kosong tiga kali, tuang air bilasan ke dalam tangki semburan, kemudian tebuk botol supaya tidak diguna semula.",
              "Jangan basuh tangki atau buang sisa racun ke dalam sungai atau saliran."])],
          en: ["Storage and disposal",
            ul(["Keep pesticides in their original containers, locked away from food and children.",
              "<b>Never</b> use an empty pesticide bottle for drinking water or food.",
              "Rinse empty bottles three times, pour the rinse water into the spray tank, then puncture the bottle so it can't be reused.",
              "Don't wash tanks or dump leftover pesticide into rivers or drains."])]
        },
        {
          ms: ["Jika keracunan",
            p("Tanda-tanda: pening, sakit kepala, loya, muntah, berpeluh banyak, penglihatan kabur, sesak nafas.") +
            ol(["Berhenti menyembur dan pergi ke tempat berudara segar.",
              "Tanggalkan pakaian yang terkena racun.",
              "Basuh kulit dengan sabun dan air yang banyak. Jika terkena mata, bilas dengan air bersih selama beberapa minit.",
              "<b>Hubungi 999</b> atau pergi ke klinik segera.",
              "<b>Bawa label atau botol racun</b> supaya doktor tahu apa yang terkena."]) +
            tip("Jangan tunggu sehingga rasa lebih teruk. Dapatkan bantuan segera.")],
          en: ["If poisoning happens",
            p("Signs: dizziness, headache, nausea, vomiting, heavy sweating, blurred vision, difficulty breathing.") +
            ol(["Stop spraying and move to fresh air.",
              "Take off clothes that have pesticide on them.",
              "Wash the skin with plenty of soap and water. If it's in the eyes, rinse with clean water for several minutes.",
              "<b>Call 999</b> or go to a clinic immediately.",
              "<b>Bring the label or bottle</b> so the doctor knows what it was."]) +
            tip("Don't wait until you feel worse. Get help straight away.")]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "tuai", color: "#8a6a12", icon: "grain",
      ms: { title: "Kurangkan Potongan Kilang", sub: "Jaga kualiti padi, dapat harga lebih baik" },
      en: { title: "Reduce Mill Deductions", sub: "Keep quality high, get a better price" },
      chapters: [
        {
          ms: ["Kenapa kilang memotong",
            p("Kilang menolak sebahagian berat padi (potongan) berdasarkan <b>kualiti</b> padi yang dihantar. Antara sebabnya:") +
            ul(["<b>Kelembapan tinggi</b> — padi basah lebih berat tetapi akan susut bila dikeringkan",
              "<b>Bijirin hampa</b> atau tidak berisi",
              "<b>Kotoran</b> — jerami, tanah, batu, biji rumpai",
              "Bijirin rosak, patah atau berwarna"]) +
            tip("Semak berita terkini tentang potongan kilang di halaman Utama SawahKu.")],
          en: ["Why the mill deducts",
            p("The mill deducts part of the paddy's weight based on the <b>quality</b> delivered. Reasons include:") +
            ul(["<b>High moisture</b> — wet paddy weighs more but shrinks when dried",
              "<b>Empty grains</b> or unfilled grains",
              "<b>Impurities</b> — straw, soil, stones, weed seeds",
              "Damaged, broken or discoloured grains"]) +
            tip("Check the latest news on mill deductions on SawahKu's Home page.")]
        },
        {
          ms: ["Sebelum menuai",
            ul(["Keringkan sawah 14 hari sebelum tuai.",
              "Tuai bila 85–90% bijirin sudah kuning — tidak terlalu awal.",
              "Buang padi angin dan rumpai tinggi sebelum tuai supaya tidak bercampur.",
              "Elakkan menuai sejurus selepas hujan jika boleh."])],
          en: ["Before harvest",
            ul(["Drain the field 14 days before harvest.",
              "Harvest when 85–90% of grains are yellow — not too early.",
              "Remove weedy rice and tall weeds before harvest so they don't get mixed in.",
              "Avoid harvesting right after rain if you can."])]
        },
        {
          ms: ["Semasa dan selepas menuai",
            ul(["Minta pengendali mesin memastikan mesin <b>bersih</b> dan dilaras dengan betul supaya kurang kotoran dan bijirin patah.",
              "Hantar padi ke kilang <b>secepat mungkin</b>. Padi basah yang dibiarkan lama cepat rosak.",
              "Tutup padi daripada hujan semasa diangkut."])],
          en: ["During and after harvest",
            ul(["Ask the machine operator to make sure the harvester is <b>clean</b> and set correctly, for fewer impurities and broken grains.",
              "Send the paddy to the mill <b>as soon as possible</b>. Wet paddy left too long spoils quickly.",
              "Cover the paddy from rain while transporting it."])]
        },
        {
          ms: ["Di kilang",
            ul(["Lihat sendiri proses menimbang jika boleh.",
              "Minta <b>slip timbangan dan gred</b>, dan simpan.",
              "Catat berat, peratus potongan dan harga dalam buku rekod anda.",
              "Bandingkan dengan musim lepas dan dengan jiran. Jika potongan luar biasa tinggi, tanya sebabnya."])],
          en: ["At the mill",
            ul(["Watch the weighing yourself if you can.",
              "Ask for the <b>weighing and grading slip</b>, and keep it.",
              "Write down the weight, deduction percentage and price in your record book.",
              "Compare with last season and with your neighbours. If the deduction is unusually high, ask why."])]
        }
      ]
    },

    /* ---------------------------------------------------------- */
    {
      id: "rekod", color: "#44505e", icon: "note",
      ms: { title: "Buku Rekod Ladang", sub: "Tahu untung rugi setiap musim" },
      en: { title: "Farm Record Book", sub: "Know your profit or loss each season" },
      chapters: [
        {
          ms: ["Kenapa perlu rekod",
            ul(["Tahu dengan tepat berapa <b>untung atau rugi</b> setiap musim.",
              "Nampak di mana wang paling banyak dibelanjakan.",
              "Ingat apa yang berjaya dan apa yang tidak — racun, varieti, tarikh tabur.",
              "Mudah bila memohon bantuan atau subsidi."])],
          en: ["Why keep records",
            ul(["Know exactly how much <b>profit or loss</b> you make each season.",
              "See where most of the money goes.",
              "Remember what worked and what didn't — products, varieties, sowing dates.",
              "Easier when applying for help or subsidies."])]
        },
        {
          ms: ["Apa yang perlu dicatat",
            ul(["Tarikh tabur dan varieti benih",
              "Setiap kali membaja: tarikh, jenis, jumlah, harga",
              "Setiap kali menyembur: tarikh, masalah, nama racun, jumlah, harga",
              "Upah: membajak, menyembur, menuai, pengangkutan",
              "Hasil: berat, potongan kilang, harga sekilogram"]) +
            tip("Buku nota kecil pun cukup. Simpan semua resit di dalam satu sampul.")],
          en: ["What to write down",
            ul(["Sowing date and seed variety",
              "Each fertiliser application: date, type, amount, price",
              "Each spray: date, problem, product name, amount, price",
              "Labour and services: ploughing, spraying, harvesting, transport",
              "Harvest: weight, mill deduction, price per kilogram"]) +
            tip("A small notebook is enough. Keep all receipts in one envelope.")]
        },
        {
          ms: ["Kira untung rugi",
            p("<b>Pendapatan</b> = berat bersih selepas potongan (kg) × harga sekilogram") +
            p("<b>Untung</b> = pendapatan − jumlah semua kos") +
            p("Contoh mudah (nombor rekaan): berat bersih 5,000 kg × RM1.30 = RM6,500. Jumlah kos RM4,200. Untung = RM2,300.") +
            tip("Bahagikan dengan keluasan sawah untuk dapat untung setiap ekar, supaya boleh dibandingkan antara musim.")],
          en: ["Work out profit or loss",
            p("<b>Income</b> = net weight after deductions (kg) × price per kilogram") +
            p("<b>Profit</b> = income − all costs") +
            p("Simple example (made-up numbers): net weight 5,000 kg × RM1.30 = RM6,500. Total costs RM4,200. Profit = RM2,300.") +
            tip("Divide by your field size to get profit per acre, so you can compare between seasons.")]
        }
      ]
    }
  ];

  /* Rough reading time in minutes (about 150 words a minute) */
  window.EBOOKS.forEach(function (b) {
    ["ms", "en"].forEach(function (l) {
      var words = b.chapters.map(function (c) { return c[l][1].replace(/<[^>]+>/g, " "); }).join(" ").split(/\s+/).length;
      b[l].mins = Math.max(2, Math.round(words / 150));
    });
  });
})();
