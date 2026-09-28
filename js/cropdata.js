/* ============================================================
   SawahKu — paddy pests, diseases and weeds
   Used by the Crop info page (crop.html), the AI assistant and
   the photo scan. General guidance based on Department of
   Agriculture Malaysia (DOA) Rice Check 2022 and Pakej Teknologi
   Padi, MADA leaflets and product labels registered in Malaysia.
   Always follow the product label for doses.

   sym = symptom tags used by "Find by what you see":
     yellow   – leaves turning yellow / orange
     spots    – spots or patches on leaves or stems
     dying    – plants or patches drying out / dying
     empty    – empty or white panicles, grains not filling
     seedling – young seedlings missing or cut
     leaf     – leaves folded, eaten or torn
     stunted  – plants short and weak
     extra    – other plants growing among the paddy

   photo = real photo from Wikimedia Commons (hotlinked, credited).
   chem  = recommended ACTIVE INGREDIENTS (not brands), with the
           resistance-management group in brackets. Rotate groups.
   ============================================================ */

var CROP_SYMPTOMS = ["yellow", "spots", "dying", "empty", "seedling", "leaf", "stunted", "extra"];

function commons(file) {
  return {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(file) + "?width=640",
    page: "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(file)
  };
}

var CROP = [
  {
    id: "snail", type: "pest", emoji: "🐌", sym: ["seedling"],
    keys: ["siput", "gondang", "snail", "golden apple"],
    photo: Object.assign(commons("Golden_apple_snail_eggs.jpg"), { credit: "Basile Morin", license: "CC BY-SA 4.0" }),
    ms: {
      name: "Siput gondang emas", alt: "Golden apple snail",
      caption: "Telur siput gondang emas berwarna merah jambu pada batang padi",
      when: "Hari 0–20, semasa anak benih masih kecil (paling berisiko sehingga ±21 hari selepas tabur)",
      signs: "Anak benih putus di pangkal dan hilang. Telur berwarna merah jambu pada batang, batas dan tepi tali air.",
      threshold: "Rice Check 2022: <b>1 siput setiap meter persegi</b>. Racun siput paling berbaloi pada padi bawah 30 hari.",
      chem: ["<b>Niklosamida</b> — racun siput berdaftar", "<b>Metaldehid</b> — racun siput berdaftar",
             "Sembur atau tabur di <b>kawasan rendah dan parit sahaja</b>, bukan seluruh petak"],
      action: "Kekalkan air cetek (bawah 2 cm) pada 2–3 minggu pertama. Kutip siput dan hancurkan kelompok telur setiap hari.",
      prevent: "Buat parit kecil di tepi petak supaya siput berkumpul di situ. Pasang penapis di pintu air. Pacak kayu sebagai tempat siput bertelur, kemudian musnahkan telurnya.",
      warn: "<b>Jangan guna fentin asetat</b> — tidak berdaftar dan diharamkan. Jabatan Pertanian merampas lebih 10,000 paket pada 2023."
    },
    en: {
      name: "Golden apple snail", alt: "Siput gondang emas",
      caption: "Pink golden apple snail eggs on a rice stem",
      when: "Days 0–20, while seedlings are small (most at risk until about 21 days after sowing)",
      signs: "Seedlings cut off at the base and missing. Pink egg clusters on stems, bunds and canal edges.",
      threshold: "Rice Check 2022: <b>1 snail per square metre</b>. Molluscicides are most worthwhile on paddy under 30 days old.",
      chem: ["<b>Niclosamide</b> — registered molluscicide", "<b>Metaldehyde</b> — registered molluscicide",
             "Treat <b>low spots and drains only</b>, not the whole plot"],
      action: "Keep water shallow (under 2 cm) for the first 2–3 weeks. Pick up snails and crush egg clusters every day.",
      prevent: "Dig small drains at the edge of the plot so snails gather there. Screen water inlets. Put in stakes for snails to lay eggs on, then destroy the eggs.",
      warn: "<b>Never use fentin acetate</b> — it is unregistered and banned. The Department of Agriculture seized over 10,000 packets in 2023."
    }
  },
  {
    id: "bph", type: "pest", emoji: "🦗", sym: ["yellow", "dying"],
    keys: ["bena perang", "bena", "planthopper", "bph", "hopperburn"],
    photo: Object.assign(commons("Nilaparvata_lugens_439634058.jpg"), { credit: "portioid (iNaturalist)", license: "CC BY 4.0" }),
    ms: {
      name: "Bena perang", alt: "Brown planthopper",
      caption: "Bena perang dewasa pada daun padi",
      when: "Peringkat beranak hingga pengisian bijirin",
      signs: "Serangga kecil berwarna perang di pangkal batang. Kawasan bulat pokok menjadi kuning, kemudian kering seperti terbakar.",
      threshold: "Rice Check 2022: <b>5 dewasa atau 10 nimfa</b> setiap kuadrat. Jangan sembur jika musuh semula jadi (labah-labah) lebih banyak daripada bena.",
      chem: ["<b>Pimetrozin</b> (IRAC 9B)", "<b>Buprofezin</b> (IRAC 16) — berkesan pada nimfa",
             "<b>Imidakloprid</b> (IRAC 4A)", "Sembur pada <b>pangkal pokok</b>. Tukar kumpulan setiap semburan supaya bena tidak lali."],
      action: "Periksa pangkal pokok setiap minggu. Keringkan sawah sebelum menyembur supaya racun sampai ke pangkal.",
      prevent: "Elakkan urea berlebihan. Tanam serentak dengan jiran. Guna varieti tahan.",
      warn: "<b>Jangan guna piretroid</b> (sipermetrin, deltametrin, lambda-sihalotrin) untuk bena perang — ia membunuh musuh semula jadi dan bena datang semula lebih banyak."
    },
    en: {
      name: "Brown planthopper", alt: "Bena perang",
      caption: "Adult brown planthopper on a rice leaf",
      when: "Tillering to grain filling",
      signs: "Small brown insects at the base of the stems. Round patches of plants turn yellow, then dry out as if burnt.",
      threshold: "Rice Check 2022: <b>5 adults or 10 nymphs</b> per quadrat. Don't spray if natural enemies (spiders) outnumber the planthoppers.",
      chem: ["<b>Pymetrozine</b> (IRAC 9B)", "<b>Buprofezin</b> (IRAC 16) — works on nymphs",
             "<b>Imidacloprid</b> (IRAC 4A)", "Spray at the <b>base of the plants</b>. Switch group each spray so planthoppers don't become resistant."],
      action: "Check the base of plants weekly. Drain the field before spraying so the spray reaches the base.",
      prevent: "Avoid too much urea. Plant at the same time as neighbours. Use resistant varieties.",
      warn: "<b>Don't use pyrethroids</b> (cypermethrin, deltamethrin, lambda-cyhalothrin) for planthoppers — they kill natural enemies and the planthoppers come back in bigger numbers."
    }
  },
  {
    id: "borer", type: "pest", emoji: "🐛", sym: ["dying", "empty"],
    keys: ["pengorek batang", "pengorek", "stem borer", "borer", "pucuk mati", "tangkai putih", "deadheart", "whitehead"],
    photo: Object.assign(commons("LPCC-744-Arròs_afectat_per_Chilo_supressalis.jpg"), { credit: "Miquel Pujol Palol", license: "CC BY-SA 3.0" }),
    ms: {
      name: "Pengorek batang", alt: "Stem borer",
      caption: "Tangkai putih dan kosong akibat pengorek batang",
      when: "Peringkat beranak dan keluar tangkai",
      signs: "Pucuk tengah anak padi mati (\"pucuk mati\"). Kemudian, tangkai putih dan kosong (\"tangkai putih\").",
      threshold: "Rice Check 2022: <b>1 kelompok telur atau 1 rama-rama dewasa setiap meter persegi</b>.",
      chem: ["<b>Klorantraniliprol</b> (IRAC 28)", "<b>Fipronil</b> (IRAC 2B)", "<b>Kartap</b> (IRAC 14) — bentuk butiran"],
      action: "Buang kelompok telur pada daun. Sembur hanya jika kerosakan merebak.",
      prevent: "Musnahkan tunggul selepas menuai. Tanam serentak dengan jiran. Bahagikan baja nitrogen.",
      warn: "<b>Karbofuran (Furadan) diharamkan sejak 2023.</b> Jangan guna walaupun masih ada dalam panduan lama."
    },
    en: {
      name: "Stem borer", alt: "Pengorek batang",
      caption: "White, empty panicles caused by stem borer",
      when: "Tillering and heading",
      signs: "The centre shoot of young plants dies (\"deadheart\"). Later, white empty panicles (\"whitehead\").",
      threshold: "Rice Check 2022: <b>1 egg mass or 1 adult moth per square metre</b>.",
      chem: ["<b>Chlorantraniliprole</b> (IRAC 28)", "<b>Fipronil</b> (IRAC 2B)", "<b>Cartap</b> (IRAC 14) — granules"],
      action: "Remove egg masses on leaves. Spray only if the damage is spreading.",
      prevent: "Destroy stubble after harvest. Plant at the same time as your neighbours. Split nitrogen applications.",
      warn: "<b>Carbofuran (Furadan) has been banned since 2023.</b> Don't use it even if old guides still mention it."
    }
  },
  {
    id: "leaffolder", type: "pest", emoji: "🐛", sym: ["leaf"],
    keys: ["pelipat daun", "ulat gulung", "leaf folder", "leaffolder", "daun berlipat"],
    photo: Object.assign(commons("Rice_leaf_folder.jpg"), { credit: "Badal Chandra Sarker", license: "CC BY-SA 4.0" }),
    ms: {
      name: "Ulat pelipat daun", alt: "Leaf folder",
      caption: "Ulat di dalam daun padi yang berlipat",
      when: "Peringkat beranak hingga bunting",
      signs: "Daun dilipat memanjang. Garis putih lut sinar pada daun di tempat ulat makan.",
      threshold: "<b>30% daun rosak</b>. Padi muda (bawah 40 hari) biasanya pulih sendiri.",
      chem: ["<b>Klorantraniliprol</b> (IRAC 28)"],
      action: "Biasanya tidak perlu sembur. Sembur hanya jika banyak daun atas rosak semasa peringkat bunting.",
      prevent: "Guna baja nitrogen secara seimbang. Jaga musuh semula jadi dengan tidak menyembur terlalu awal.",
      warn: ""
    },
    en: {
      name: "Leaf folder", alt: "Ulat pelipat daun",
      caption: "Caterpillar inside a folded rice leaf",
      when: "Tillering to booting",
      signs: "Leaves folded lengthwise. See-through white streaks where the caterpillar has eaten.",
      threshold: "<b>30% of leaves damaged</b>. Young paddy (under 40 days) usually recovers by itself.",
      chem: ["<b>Chlorantraniliprole</b> (IRAC 28)"],
      action: "Usually no spraying needed. Spray only if many top leaves are damaged at booting.",
      prevent: "Use nitrogen in balance. Protect natural enemies by not spraying too early.",
      warn: ""
    }
  },
  {
    id: "rat", type: "pest", emoji: "🐀", sym: ["dying", "seedling"],
    keys: ["tikus", "rat", "rats"],
    photo: Object.assign(commons("Field_rats_infesting_rice_plants_(11058917815).jpg"), { credit: "IRRI Photos", license: "CC BY 2.0" }),
    ms: {
      name: "Tikus", alt: "Rats",
      caption: "Tikus sawah di antara pokok padi",
      when: "Semua peringkat, paling teruk semasa bunting hingga masak",
      signs: "Batang dipotong serong. Kerosakan bermula dari batas ke tengah petak. Lubang di batas.",
      threshold: "Rice Check 2022: <b>5% kerosakan</b>.",
      chem: ["<b>Umpan antikoagulan</b> — generasi pertama (warfarin, kumatetralil, klorofasinon) atau generasi kedua (bromadiolon, brodifakum)",
             "Utamakan <b>generasi pertama</b> — kurang bahaya kepada burung pungguk yang memakan tikus",
             "Letak umpan di sepanjang batas, periksa setiap 3 hari dan tambah"],
      action: "Umpan serentak dengan jiran pada masa yang sama. Bersihkan semak di batas.",
      prevent: "Pasang kotak sarang burung pungguk jelapang (Rice Check: 1 kotak bagi 40 hektar, setinggi 2.4 m, jarak kira-kira 100 m). Kecilkan dan bersihkan batas.",
      warn: "Umpan racun boleh membunuh burung pungguk yang memakan tikus beracun. <b>Kalsium sianida diharamkan</b> dan fluoroasetamida tidak berdaftar."
    },
    en: {
      name: "Rats", alt: "Tikus",
      caption: "Rice field rat among rice plants",
      when: "All stages, worst from booting to ripening",
      signs: "Stems cut at an angle. Damage starts at the bund and moves inward. Holes in the bunds.",
      threshold: "Rice Check 2022: <b>5% damage</b>.",
      chem: ["<b>Anticoagulant baits</b> — first-generation (warfarin, coumatetralyl, chlorophacinone) or second-generation (bromadiolone, brodifacoum)",
             "Prefer <b>first-generation</b> — less danger to barn owls that eat the rats",
             "Place bait along the bunds, check every 3 days and top up"],
      action: "Bait together with your neighbours at the same time. Clear bushes on the bunds.",
      prevent: "Put up barn owl nest boxes (Rice Check: 1 box per 40 hectares, 2.4 m high, about 100 m apart). Keep bunds small and clean.",
      warn: "Bait can kill barn owls that eat poisoned rats. <b>Calcium cyanide is banned</b> and fluoroacetamide is not registered."
    }
  },
  {
    id: "blast", type: "disease", emoji: "🍂", sym: ["spots", "empty"],
    keys: ["karah", "blast", "reput leher", "neck rot"],
    photo: Object.assign(commons("Rice_blast_Magnaporthe_grisea.jpg"), { credit: "Yulin Jia, USDA-ARS", license: "Public domain" }),
    ms: {
      name: "Karah", alt: "Rice blast",
      caption: "Bintik karah berbentuk mata pada daun padi",
      when: "Semua peringkat, paling teruk dalam cuaca lembap dan malam sejuk",
      signs: "Bintik berbentuk berlian dengan tengah kelabu dan tepi perang pada daun. Leher tangkai boleh reput dan patah.",
      threshold: "Rice Check 2022: sembur <b>pencegahan</b> pada varieti yang mudah dijangkiti, atau sebaik bintik pertama kelihatan.",
      chem: ["<b>Trisiklazol</b> (FRAC 16.1)", "<b>Isoprotiolan</b> (FRAC 6)", "<b>Azoksistrobin</b> (FRAC 11)",
             "Untuk karah leher: sembur semasa <b>bunting dan keluar tangkai</b>"],
      action: "Sembur racun kulat sebaik bintik mula kelihatan, ikut label.",
      prevent: "Jangan bubuh nitrogen berlebihan. Guna varieti yang tahan karah. Baja silika membantu.",
      warn: ""
    },
    en: {
      name: "Rice blast", alt: "Karah",
      caption: "Eye-shaped blast lesion on a rice leaf",
      when: "All stages, worst in humid weather with cool nights",
      signs: "Diamond-shaped spots with grey centres and brown edges on leaves. The panicle neck may rot and break.",
      threshold: "Rice Check 2022: spray <b>preventively</b> on susceptible varieties, or as soon as the first spots appear.",
      chem: ["<b>Tricyclazole</b> (FRAC 16.1)", "<b>Isoprothiolane</b> (FRAC 6)", "<b>Azoxystrobin</b> (FRAC 11)",
             "For neck blast: spray at <b>booting and heading</b>"],
      action: "Spray fungicide as soon as spots appear, following the label.",
      prevent: "Don't over-apply nitrogen. Use blast-resistant varieties. Silica fertiliser helps.",
      warn: ""
    }
  },
  {
    id: "sheath", type: "disease", emoji: "🍂", sym: ["spots", "dying"],
    keys: ["hawar seludang", "seludang", "sheath blight"],
    photo: Object.assign(commons("RiceSheathArk.jpg"), { credit: "Peggy Greb, USDA-ARS", license: "Public domain" }),
    ms: {
      name: "Hawar seludang", alt: "Sheath blight",
      caption: "Tompok hawar seludang pada batang padi",
      when: "Peringkat beranak hingga keluar tangkai",
      signs: "Tompok bujur kelabu-hijau pada batang dekat paras air, merebak ke atas.",
      threshold: "Rice Check 2022: sembur <b>sebaik tanda mula kelihatan</b>.",
      chem: ["<b>Heksakonazol</b> (FRAC 3)", "<b>Azoksistrobin + difenokonazol</b> (FRAC 11 + 3)", "<b>Pensikuron</b> (FRAC 20)",
             "Sembur pada <b>pangkal pokok</b>, biasanya sekitar hari 45–65"],
      action: "Sembur racun kulat pada pangkal apabila tompok merebak.",
      prevent: "Elakkan tanaman terlalu rapat dan nitrogen berlebihan. Baja kalium dan silika membantu.",
      warn: ""
    },
    en: {
      name: "Sheath blight", alt: "Hawar seludang",
      caption: "Sheath blight lesion on a rice stem",
      when: "Tillering to heading",
      signs: "Oval grey-green patches on the stem near the water line, spreading upward.",
      threshold: "Rice Check 2022: spray <b>as soon as symptoms appear</b>.",
      chem: ["<b>Hexaconazole</b> (FRAC 3)", "<b>Azoxystrobin + difenoconazole</b> (FRAC 11 + 3)", "<b>Pencycuron</b> (FRAC 20)",
             "Spray at the <b>base of the plants</b>, usually around days 45–65"],
      action: "Spray fungicide at the base when patches spread.",
      prevent: "Avoid planting too densely and too much nitrogen. Potassium and silica fertiliser help.",
      warn: ""
    }
  },
  {
    id: "blb", type: "disease", emoji: "🍂", sym: ["yellow"],
    keys: ["hawar daun bakteria", "hawar daun", "bakteria", "bacterial leaf blight", "blb"],
    photo: Object.assign(commons("Bacterial_blight_of_rice.jpeg"), { credit: "Donald Groth, LSU AgCenter, Bugwood.org", license: "CC BY 3.0 US" }),
    ms: {
      name: "Hawar daun bakteria", alt: "Bacterial leaf blight",
      caption: "Tepi daun kuning keputihan akibat hawar daun bakteria",
      when: "Selalunya selepas ribut atau banjir",
      signs: "Tepi daun menjadi kuning, kemudian putih-kelabu dari hujung ke bawah, dengan sempadan beralun.",
      threshold: "Tiada — bertindak dengan cara pengurusan.",
      chem: ["<b>Tiada racun yang berkesan.</b> MADA dan Jabatan Pertanian tidak mengesyorkan sebarang semburan — jangan bazir wang."],
      action: "Keringkan sawah yang banjir, kekalkan air 10 cm atau kurang, dan jangan tambah nitrogen. Jangan alirkan air dari petak berpenyakit ke petak sihat.",
      prevent: "Guna varieti tahan pada musim hadapan. Musnahkan pokok dan tunggul yang dijangkiti.",
      warn: ""
    },
    en: {
      name: "Bacterial leaf blight", alt: "Hawar daun bakteria",
      caption: "Yellow-white leaf edges from bacterial leaf blight",
      when: "Often after storms or flooding",
      signs: "Leaf edges turn yellow, then white-grey from the tip down, with wavy borders.",
      threshold: "None — manage it with field practices.",
      chem: ["<b>No pesticide works.</b> MADA and the Department of Agriculture recommend no spray — don't waste money."],
      action: "Drain flooded fields, keep water at 10 cm or less, and don't add nitrogen. Don't let water flow from sick plots into healthy ones.",
      prevent: "Use resistant varieties next season. Destroy infected plants and stubble.",
      warn: ""
    }
  },
  {
    id: "tungro", type: "disease", emoji: "🦠", sym: ["yellow", "stunted"],
    keys: ["tungro", "bena hijau", "kuning oren", "virus"],
    photo: Object.assign(commons("Rice_plants_affected_by_tungro_disease1.jpg"), { credit: "Nozaki Michio, JIRCAS", license: "CC BY 2.0" }),
    ms: {
      name: "Tungro", alt: "Rice tungro virus",
      caption: "Pokok padi kuning-oren dijangkiti tungro",
      when: "Peringkat awal hingga beranak",
      signs: "Daun kuning ke oren dari hujung. Pokok bantut dan kurang anak. Dibawa oleh bena hijau.",
      threshold: "Rice Check 2022 (kira dengan jaring sauk): <b>5 bena hijau dewasa bagi 25 kali sauk</b>, atau <b>1</b> jika tungro sudah ada di kawasan.",
      chem: ["Virus tidak boleh diubati. Kawal <b>bena hijau</b> yang membawanya:",
             "<b>Imidakloprid</b> (IRAC 4A)", "<b>Buprofezin</b> (IRAC 16)"],
      action: "Cabut dan musnahkan rumpun yang dijangkiti. Maklumkan Pejabat Pertanian Daerah — tungro merebak cepat.",
      prevent: "Guna varieti tahan. Tanam serentak dengan jiran. Bajak tunggul sebaik selepas menuai.",
      warn: ""
    },
    en: {
      name: "Tungro", alt: "Rice tungro virus",
      caption: "Yellow-orange rice plants infected with tungro",
      when: "Early growth to tillering",
      signs: "Leaves turn yellow to orange from the tip. Plants are stunted with few tillers. Spread by the green leafhopper.",
      threshold: "Rice Check 2022 (count with a sweep net): <b>5 adult green leafhoppers per 25 sweeps</b>, or <b>1</b> where tungro is already present.",
      chem: ["The virus can't be cured. Control the <b>green leafhopper</b> that spreads it:",
             "<b>Imidacloprid</b> (IRAC 4A)", "<b>Buprofezin</b> (IRAC 16)"],
      action: "Pull out and destroy infected clumps. Tell the District Agriculture Office — tungro spreads fast.",
      prevent: "Use resistant varieties. Plant at the same time as neighbours. Plough stubble in right after harvest.",
      warn: ""
    }
  },
  {
    id: "brownspot", type: "disease", emoji: "🍂", sym: ["spots"],
    keys: ["bintik perang", "brown spot", "bintik"],
    photo: Object.assign(commons("Cochliobolus_miyabeanus.jpg"), { credit: "Donald Groth, LSU AgCenter", license: "CC BY 3.0 US" }),
    ms: {
      name: "Bintik perang", alt: "Brown spot",
      caption: "Bintik bujur perang pada daun padi",
      when: "Semua peringkat, lebih teruk di tanah kurang subur",
      signs: "Banyak bintik bujur kecil berwarna perang dengan tengah kelabu pada daun dan bijirin.",
      threshold: "Tiada paras tetap — biasanya tanda tanah kurang subur.",
      chem: ["<b>Azoksistrobin + difenokonazol</b> (FRAC 11 + 3)", "Rawat benih: rendam dalam <b>air panas 53–54°C selama 10–12 minit</b> sebelum semai"],
      action: "Betulkan baja dahulu — bintik perang biasanya tanda tanah kurang zat. Pastikan sawah tidak kekeringan.",
      prevent: "Bubuh baja secara seimbang. Guna benih yang bersih dan sihat.",
      warn: ""
    },
    en: {
      name: "Brown spot", alt: "Bintik perang",
      caption: "Oval brown spots on a rice leaf",
      when: "All stages, worse on poor soil",
      signs: "Many small oval brown spots with grey centres on leaves and grains.",
      threshold: "No fixed level — usually a sign of poor soil.",
      chem: ["<b>Azoxystrobin + difenoconazole</b> (FRAC 11 + 3)", "Seed treatment: soak in <b>hot water at 53–54°C for 10–12 minutes</b> before sowing"],
      action: "Fix the fertiliser first — brown spot is usually a sign of poor soil. Don't let the field dry out.",
      prevent: "Use balanced fertiliser. Use clean, healthy seed.",
      warn: ""
    }
  },
  {
    id: "weedyrice", type: "weed", emoji: "🌾", sym: ["extra"],
    keys: ["padi angin", "weedy rice", "padi liar"],
    photo: Object.assign(commons("LPCC-781-Arròs_bord.jpg"), { credit: "Miquel Pujol Palol", license: "CC BY-SA 3.0" }),
    ms: {
      name: "Padi angin", alt: "Weedy rice",
      caption: "Bijirin padi angin — sesetengahnya berwarna merah",
      when: "Nampak jelas semasa berbunga",
      signs: "Pokok seperti padi tetapi lebih tinggi. Bijirin gugur awal sebelum menuai, sesetengahnya merah.",
      threshold: "Setiap pokok padi angin yang berbiji menambah masalah musim depan.",
      chem: ["<b>Sistem Clearfield</b>: imazapik + imazapir (HRAC 2), <b>hanya dengan varieti MR220CL1 atau MR220CL2</b>, dalam 0–7 hari selepas tabur",
             "Jangan guna Clearfield lebih dua musim berturut-turut — banyak padi angin sudah tahan racun ini"],
      action: "Cabut dengan tangan pada hari 70–80 sebelum bijirin gugur. Jangan biarkan ia berbiji di sawah.",
      prevent: "Guna benih sah yang bersih. Bersihkan jentera sebelum masuk sawah. Tenggelamkan sawah 5–10 cm selepas tabur.",
      warn: "<b>Paraquat diharamkan sejak 2020</b> — jangan guna untuk membersihkan sawah."
    },
    en: {
      name: "Weedy rice", alt: "Padi angin",
      caption: "Weedy rice grains — some are red",
      when: "Easy to see at flowering",
      signs: "Plants like paddy but taller. Grains drop early before harvest; some are red.",
      threshold: "Every weedy rice plant that sets seed makes next season worse.",
      chem: ["<b>Clearfield system</b>: imazapic + imazapyr (HRAC 2), <b>only with MR220CL1 or MR220CL2 varieties</b>, within 0–7 days after sowing",
             "Don't use Clearfield more than two seasons in a row — much weedy rice is already resistant"],
      action: "Hand-pull at days 70–80 before the grains drop. Don't let it seed in the field.",
      prevent: "Use certified clean seed. Clean machinery before it enters the field. Flood 5–10 cm after sowing.",
      warn: "<b>Paraquat has been banned since 2020</b> — don't use it to clear fields."
    }
  },
  {
    id: "weeds", type: "weed", emoji: "🌿", sym: ["extra"],
    keys: ["rumpai", "rumput", "rusiga", "weed", "weeds", "grass", "rumput sambau", "barnyard"],
    photo: Object.assign(commons("LPCC-730-Echinochloa_crus-galli.jpg"), { credit: "Miquel Pujol Palol", license: "CC BY-SA 3.0" }),
    ms: {
      name: "Rumpai (rumput, rusiga, daun lebar)", alt: "Weeds",
      caption: "Rumput sambau (Echinochloa), rumpai padi yang biasa",
      when: "Paling merugikan dalam 40 hari pertama",
      signs: "Rumput, rusiga atau tumbuhan berdaun lebar tumbuh di antara padi dan bersaing untuk baja dan cahaya.",
      threshold: "Rice Check 2022: kawal rumpai secara kimia <b>sebelum hari 40</b> (varieti awal).",
      chem: ["Pra-cambah (hari 0–7): <b>pretilaklor</b> (HRAC 15)",
             "Rumput: <b>sihalofop-butil</b> (HRAC 1) sebelum rumput berdaun 4",
             "Rusiga & daun lebar: <b>bensulfuron-metil</b> (HRAC 2), <b>propanil</b> (HRAC 5)",
             "Rumput sambau yang tahan bispiribak: campuran <b>propanil + kuinklorak</b>"],
      action: "Guna racun rumpai ikut peringkat seperti di atas. Cabut dengan tangan jika sedikit.",
      prevent: "Ratakan tanah. Kekalkan paras air yang betul — air menekan rumpai. Guna benih bersih.",
      warn: "<b>Butaklor dan paraquat diharamkan.</b> Sesetengah rumpai di Malaysia sudah tahan 2,4-D dan bensulfuron — tukar kumpulan racun."
    },
    en: {
      name: "Weeds (grasses, sedges, broadleaf)", alt: "Rumpai",
      caption: "Barnyard grass (Echinochloa), a common paddy weed",
      when: "Most harmful in the first 40 days",
      signs: "Grasses, sedges or broadleaf plants growing among the paddy, competing for fertiliser and light.",
      threshold: "Rice Check 2022: control weeds chemically <b>before day 40</b> (early varieties).",
      chem: ["Pre-emergence (days 0–7): <b>pretilachlor</b> (HRAC 15)",
             "Grasses: <b>cyhalofop-butyl</b> (HRAC 1) before the 4-leaf stage",
             "Sedges & broadleaf: <b>bensulfuron-methyl</b> (HRAC 2), <b>propanil</b> (HRAC 5)",
             "Barnyard grass resistant to bispyribac: <b>propanil + quinclorac</b> mix"],
      action: "Use herbicides by stage as above. Hand-pull if there are only a few.",
      prevent: "Level the land. Keep the right water level — water holds weeds back. Use clean seed.",
      warn: "<b>Butachlor and paraquat are banned.</b> Some weeds in Malaysia already resist 2,4-D and bensulfuron — switch herbicide groups."
    }
  }
];

/* ------------------------------------------------------------
   Banned and restricted pesticides (DOA list, 26 Aug 2025)
   and fertiliser warnings. Shown on the Crop page.
   ------------------------------------------------------------ */
var BANNED = {
  source: "https://www.doa.gov.my/doa/resources/aktiviti_sumber/sumber_awam/maklumat_racun_perosak/pendaftaran_rmp/senarai_racun_perosak_haram_terhad_ogos2025.pdf",
  paddy: [
    { ai: "Paraquat", year: "2020", ms: "Racun rumpai. Diharamkan sepenuhnya sejak 1 Jan 2020.", en: "Weedkiller. Totally banned since 1 Jan 2020." },
    { ai: "Karbofuran / Carbofuran (Furadan)", year: "2023", ms: "Racun serangga butiran yang dulu diguna untuk pengorek batang.", en: "Granular insecticide once used for stem borer." },
    { ai: "Fentin asetat / Fentin acetate", year: "—", never: true, ms: "Racun siput yang tidak pernah didaftarkan. Masih dijual secara haram.", en: "Snail poison that was never registered. Still sold illegally." },
    { ai: "Endosulfan", year: "2005", ms: "Racun serangga dan siput. Botol palsu atau seludup masih dijumpai di sawah.", en: "Insect and snail poison. Fake or smuggled bottles are still found in paddy fields." },
    { ai: "Butaklor / Butachlor", year: "—", ms: "Racun rumpai padi.", en: "Paddy herbicide." },
    { ai: "Kalsium sianida / Calcium cyanide", year: "2002", ms: "Racun tikus (gas).", en: "Rat poison (gas)." },
    { ai: "Fluoroasetamida / Fluoroacetamide", year: "—", never: true, ms: "Racun tikus yang tidak pernah didaftarkan.", en: "Rat poison that was never registered." },
    { ai: "Triklorfon / Trichlorfon", year: "2025", ms: "Racun serangga — baru diharamkan Julai 2025.", en: "Insecticide — newly banned July 2025." },
    { ai: "Klorpirifos / Chlorpyrifos", year: "2026", ms: "Racun serangga. Pendaftaran tamat sepenuhnya pada 1 Julai 2026.", en: "Insecticide. All registrations ended on 1 July 2026." },
    { ai: "Profenofos, triazofos, kuinalfos, protiofos, fentoat", year: "2015", ms: "Racun serangga organofosfat.", en: "Organophosphate insecticides." }
  ],
  others: "DDT, aldrin, dieldrin, klordan / chlordane, heptaklor / heptachlor, lindane, HCH, parathion, metil parathion, aldikarb / aldicarb, toksafen / toxaphene, alaklor / alachlor, azinfos-metil, kaptafol / captafol, folpet, 2,4,5-T, DNOC, metomil / methomyl, dikofol / dicofol, pentaklorofenol, sebatian merkuri / mercury compounds, monokrotofos / monocrotophos (pendaftaran tamat 31 Dis 2025)",
  restricted: [
    { ai: "Metamidofos / Methamidophos", ms: "Hanya suntikan batang kelapa dan kelapa sawit, sehingga 31 Dis 2027. <b>Tidak untuk padi.</b>", en: "Only trunk injection on coconut and oil palm, until 31 Dec 2027. <b>Not for paddy.</b>" },
    { ai: "Asefat / Acephate", ms: "Hanya untuk kelapa dan kelapa sawit. <b>Tidak untuk padi.</b>", en: "Only for coconut and oil palm. <b>Not for paddy.</b>" },
    { ai: "Zink fosfida / Zinc phosphide", ms: "Racun tikus yang sedang dihentikan — pendaftaran tamat 31 Dis 2028.", en: "Rat poison being phased out — registration ends 31 Dec 2028." }
  ]
};
