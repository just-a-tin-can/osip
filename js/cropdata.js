/* ============================================================
   SawahKu — paddy pests, diseases and weeds
   Used by the Crop info page (crop.html) and the AI assistant.
   General guidance based on Department of Agriculture Malaysia
   (DOA) advice. Always follow the product label for doses.

   sym = symptom tags used by "Find by what you see":
     yellow   – leaves turning yellow / orange
     spots    – spots or patches on leaves or stems
     dying    – plants or patches drying out / dying
     empty    – empty or white panicles, grains not filling
     seedling – young seedlings missing or cut
     leaf     – leaves folded, eaten or torn
     stunted  – plants short and weak
     extra    – other plants growing among the paddy
   ============================================================ */

var CROP_SYMPTOMS = ["yellow", "spots", "dying", "empty", "seedling", "leaf", "stunted", "extra"];

var CROP = [
  {
    id: "snail", type: "pest", emoji: "🐌", sym: ["seedling"],
    keys: ["siput", "gondang", "snail", "golden apple"],
    ms: {
      name: "Siput gondang emas", alt: "Golden apple snail",
      when: "Hari 0–20, semasa anak benih masih kecil",
      signs: "Anak benih putus di pangkal dan hilang. Telur berwarna merah jambu pada batang, batas dan tepi tali air.",
      action: "Kekalkan air cetek pada 2–3 minggu pertama. Kutip siput dan hancurkan kelompok telur setiap hari.",
      prevent: "Buat parit kecil di tepi petak supaya siput berkumpul di situ. Bersihkan tali air sebelum menanam."
    },
    en: {
      name: "Golden apple snail", alt: "Siput gondang emas",
      when: "Days 0–20, while seedlings are small",
      signs: "Seedlings cut off at the base and missing. Pink egg clusters on stems, bunds and canal edges.",
      action: "Keep water shallow for the first 2–3 weeks. Pick up snails and crush egg clusters every day.",
      prevent: "Dig small drains at the edge of the plot so snails gather there. Clean canals before planting."
    }
  },
  {
    id: "bph", type: "pest", emoji: "🦗", sym: ["yellow", "dying"],
    keys: ["bena perang", "bena", "planthopper", "bph", "hopperburn"],
    ms: {
      name: "Bena perang", alt: "Brown planthopper",
      when: "Peringkat beranak hingga pengisian bijirin",
      signs: "Serangga kecil berwarna perang di pangkal batang. Kawasan bulat pokok menjadi kuning, kemudian kering seperti terbakar.",
      action: "Periksa pangkal pokok setiap minggu. Sembur pada pangkal hanya jika serangga banyak, ikut sukatan label.",
      prevent: "Elakkan urea berlebihan. Jangan sembur racun serangga terlalu awal — ia membunuh labah-labah yang memakan bena."
    },
    en: {
      name: "Brown planthopper", alt: "Bena perang",
      when: "Tillering to grain filling",
      signs: "Small brown insects at the base of the stems. Round patches of plants turn yellow, then dry out as if burnt.",
      action: "Check the base of plants weekly. Spray the base only when there are many insects, at the label dose.",
      prevent: "Avoid too much urea. Don't spray insecticide too early — it kills the spiders that eat planthoppers."
    }
  },
  {
    id: "borer", type: "pest", emoji: "🐛", sym: ["dying", "empty"],
    keys: ["pengorek batang", "pengorek", "stem borer", "borer", "pucuk mati", "tangkai putih", "deadheart", "whitehead"],
    ms: {
      name: "Pengorek batang", alt: "Stem borer",
      when: "Peringkat beranak dan keluar tangkai",
      signs: "Pucuk tengah anak padi mati (\"pucuk mati\"). Kemudian, tangkai putih dan kosong (\"tangkai putih\").",
      action: "Buang kelompok telur pada daun. Sembur hanya jika kerosakan merebak.",
      prevent: "Musnahkan tunggul selepas menuai. Tanam serentak dengan jiran."
    },
    en: {
      name: "Stem borer", alt: "Pengorek batang",
      when: "Tillering and heading",
      signs: "The centre shoot of young plants dies (\"deadheart\"). Later, white empty panicles (\"whitehead\").",
      action: "Remove egg masses on leaves. Spray only if the damage is spreading.",
      prevent: "Destroy stubble after harvest. Plant at the same time as your neighbours."
    }
  },
  {
    id: "leaffolder", type: "pest", emoji: "🐛", sym: ["leaf"],
    keys: ["pelipat daun", "ulat gulung", "leaf folder", "leaffolder", "daun berlipat"],
    ms: {
      name: "Ulat pelipat daun", alt: "Leaf folder",
      when: "Peringkat beranak hingga bunting",
      signs: "Daun dilipat memanjang. Garis putih lut sinar pada daun di tempat ulat makan.",
      action: "Biasanya tidak perlu sembur. Sembur hanya jika banyak daun atas rosak semasa peringkat bunting.",
      prevent: "Guna baja nitrogen secara seimbang. Jaga musuh semula jadi dengan tidak menyembur terlalu awal."
    },
    en: {
      name: "Leaf folder", alt: "Ulat pelipat daun",
      when: "Tillering to booting",
      signs: "Leaves folded lengthwise. See-through white streaks where the caterpillar has eaten.",
      action: "Usually no spraying needed. Spray only if many top leaves are damaged at booting.",
      prevent: "Use nitrogen in balance. Protect natural enemies by not spraying too early."
    }
  },
  {
    id: "rat", type: "pest", emoji: "🐀", sym: ["dying", "seedling"],
    keys: ["tikus", "rat", "rats"],
    ms: {
      name: "Tikus", alt: "Rats",
      when: "Semua peringkat, paling teruk semasa bunting hingga masak",
      signs: "Batang dipotong serong. Kerosakan bermula dari batas ke tengah petak. Lubang di batas.",
      action: "Pasang perangkap atau umpan serentak dengan jiran pada masa yang sama. Bersihkan semak di batas.",
      prevent: "Pasang kotak sarang burung pungguk jelapang (burung hantu) — ia memakan tikus. Kecilkan dan bersihkan batas."
    },
    en: {
      name: "Rats", alt: "Tikus",
      when: "All stages, worst from booting to ripening",
      signs: "Stems cut at an angle. Damage starts at the bund and moves inward. Holes in the bunds.",
      action: "Trap or bait together with your neighbours at the same time. Clear bushes on the bunds.",
      prevent: "Put up barn owl nest boxes — owls eat rats. Keep bunds small and clean."
    }
  },
  {
    id: "blast", type: "disease", emoji: "🍂", sym: ["spots", "empty"],
    keys: ["karah", "blast", "reput leher", "neck rot"],
    ms: {
      name: "Karah", alt: "Rice blast",
      when: "Semua peringkat, paling teruk dalam cuaca lembap dan malam sejuk",
      signs: "Bintik berbentuk berlian dengan tengah kelabu dan tepi perang pada daun. Leher tangkai boleh reput dan patah.",
      action: "Guna racun kulat yang sesuai sebaik bintik mula kelihatan, ikut label.",
      prevent: "Jangan bubuh nitrogen berlebihan. Guna varieti yang tahan karah."
    },
    en: {
      name: "Rice blast", alt: "Karah",
      when: "All stages, worst in humid weather with cool nights",
      signs: "Diamond-shaped spots with grey centres and brown edges on leaves. The panicle neck may rot and break.",
      action: "Use a suitable fungicide as soon as spots appear, following the label.",
      prevent: "Don't over-apply nitrogen. Use blast-resistant varieties."
    }
  },
  {
    id: "sheath", type: "disease", emoji: "🍂", sym: ["spots", "dying"],
    keys: ["hawar seludang", "seludang", "sheath blight"],
    ms: {
      name: "Hawar seludang", alt: "Sheath blight",
      when: "Peringkat beranak hingga keluar tangkai",
      signs: "Tompok bujur kelabu-hijau pada batang dekat paras air, merebak ke atas.",
      action: "Sembur racun kulat pada pangkal apabila tompok merebak.",
      prevent: "Elakkan tanaman terlalu rapat dan nitrogen berlebihan."
    },
    en: {
      name: "Sheath blight", alt: "Hawar seludang",
      when: "Tillering to heading",
      signs: "Oval grey-green patches on the stem near the water line, spreading upward.",
      action: "Spray fungicide at the base when patches spread.",
      prevent: "Avoid planting too densely and too much nitrogen."
    }
  },
  {
    id: "blb", type: "disease", emoji: "🍂", sym: ["yellow"],
    keys: ["hawar daun bakteria", "hawar daun", "bakteria", "bacterial leaf blight", "blb"],
    ms: {
      name: "Hawar daun bakteria", alt: "Bacterial leaf blight",
      when: "Selalunya selepas ribut atau banjir",
      signs: "Tepi daun menjadi kuning, kemudian putih-kelabu dari hujung ke bawah, dengan sempadan beralun.",
      action: "Racun tidak dapat mengubatinya. Keringkan sawah yang banjir dan jangan tambah nitrogen.",
      prevent: "Guna varieti tahan pada musim hadapan. Bersihkan tunggul dan rumpai."
    },
    en: {
      name: "Bacterial leaf blight", alt: "Hawar daun bakteria",
      when: "Often after storms or flooding",
      signs: "Leaf edges turn yellow, then white-grey from the tip down, with wavy borders.",
      action: "Pesticides cannot cure it. Drain flooded fields and don't add nitrogen.",
      prevent: "Use resistant varieties next season. Clear stubble and weeds."
    }
  },
  {
    id: "tungro", type: "disease", emoji: "🦠", sym: ["yellow", "stunted"],
    keys: ["tungro", "bena hijau", "kuning oren", "virus"],
    ms: {
      name: "Tungro", alt: "Rice tungro virus",
      when: "Peringkat awal hingga beranak",
      signs: "Daun kuning ke oren dari hujung. Pokok bantut dan kurang anak. Dibawa oleh bena hijau.",
      action: "Cabut dan musnahkan rumpun yang dijangkiti. Kawal bena hijau awal. Maklumkan Pejabat Pertanian Daerah — tungro merebak cepat.",
      prevent: "Guna varieti tahan. Tanam serentak dengan jiran. Bersihkan padi yang tumbuh sendiri selepas menuai."
    },
    en: {
      name: "Tungro", alt: "Rice tungro virus",
      when: "Early growth to tillering",
      signs: "Leaves turn yellow to orange from the tip. Plants are stunted with few tillers. Spread by the green leafhopper.",
      action: "Pull out and destroy infected clumps. Control leafhoppers early. Tell the District Agriculture Office — tungro spreads fast.",
      prevent: "Use resistant varieties. Plant at the same time as neighbours. Remove self-sown paddy after harvest."
    }
  },
  {
    id: "brownspot", type: "disease", emoji: "🍂", sym: ["spots"],
    keys: ["bintik perang", "brown spot", "bintik"],
    ms: {
      name: "Bintik perang", alt: "Brown spot",
      when: "Semua peringkat, lebih teruk di tanah kurang subur",
      signs: "Banyak bintik bujur kecil berwarna perang dengan tengah kelabu pada daun dan bijirin.",
      action: "Betulkan baja — selalunya tanah kekurangan kalium. Pastikan sawah tidak kekeringan.",
      prevent: "Bubuh baja secara seimbang. Guna benih yang bersih dan sihat."
    },
    en: {
      name: "Brown spot", alt: "Bintik perang",
      when: "All stages, worse on poor soil",
      signs: "Many small oval brown spots with grey centres on leaves and grains.",
      action: "Fix the fertiliser — the soil often lacks potassium. Don't let the field dry out.",
      prevent: "Use balanced fertiliser. Use clean, healthy seed."
    }
  },
  {
    id: "weedyrice", type: "weed", emoji: "🌾", sym: ["extra"],
    keys: ["padi angin", "weedy rice", "padi liar"],
    ms: {
      name: "Padi angin", alt: "Weedy rice",
      when: "Nampak jelas semasa berbunga",
      signs: "Pokok seperti padi tetapi lebih tinggi. Bijirin gugur awal sebelum menuai, sesetengahnya merah.",
      action: "Cabut dengan tangan sebelum bijirin gugur. Jangan biarkan ia berbiji di sawah.",
      prevent: "Guna benih sah yang bersih. Bersihkan jentera sebelum masuk sawah. Sediakan tanah dan air dengan baik."
    },
    en: {
      name: "Weedy rice", alt: "Padi angin",
      when: "Easy to see at flowering",
      signs: "Plants like paddy but taller. Grains drop early before harvest; some are red.",
      action: "Pull out by hand before the grains drop. Don't let it seed in the field.",
      prevent: "Use certified clean seed. Clean machinery before it enters the field. Prepare land and water well."
    }
  },
  {
    id: "weeds", type: "weed", emoji: "🌿", sym: ["extra"],
    keys: ["rumpai", "rumput", "rusiga", "weed", "weeds", "grass"],
    ms: {
      name: "Rumpai (rumput, rusiga, daun lebar)", alt: "Weeds",
      when: "Paling merugikan dalam 30 hari pertama",
      signs: "Rumput, rusiga atau tumbuhan berdaun lebar tumbuh di antara padi dan bersaing untuk baja dan cahaya.",
      action: "Guna racun rumpai pra-cambah atau lepas-cambah ikut label. Cabut dengan tangan jika sedikit.",
      prevent: "Ratakan tanah. Kekalkan paras air yang betul — air menekan rumpai. Guna benih bersih."
    },
    en: {
      name: "Weeds (grasses, sedges, broadleaf)", alt: "Rumpai",
      when: "Most harmful in the first 30 days",
      signs: "Grasses, sedges or broadleaf plants growing among the paddy, competing for fertiliser and light.",
      action: "Use a pre- or post-emergence herbicide following the label. Hand-pull if there are only a few.",
      prevent: "Level the land. Keep the right water level — water holds weeds back. Use clean seed."
    }
  }
];
