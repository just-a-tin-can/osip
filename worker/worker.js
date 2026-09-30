/* ============================================================
   SawahKu AI Worker (Cloudflare Workers)
   ------------------------------------------------------------
   Sits between the SawahKu website and an AI service, so the API
   key stays secret. Works with ONE of these — whichever key you add:

     GEMINI_API_KEY     Google Gemini   (has a FREE tier)
     ANTHROPIC_API_KEY  Anthropic Claude (pay per use)
     OPENAI_API_KEY     OpenAI ChatGPT   (pay per use)

   The website calls:
     POST /chat  { lang: "ms"|"en", messages: [{role, content}] }
                 → { reply: "..." }
     POST /scan  { lang: "ms"|"en", image: "data:image/jpeg;base64,..." }
                 → { id, confidence, name, signs, advice }

   Optional settings (Cloudflare → Worker → Settings → Variables):
     AI_PROVIDER     "gemini" | "claude" | "openai" (only needed if you add more than one key)
     AI_MODEL        a different model name for your provider
     ALLOWED_ORIGIN  default https://just-a-tin-can.github.io
                     comma-separate several, e.g. add http://localhost:8000

   See SETUP-AI.md for step-by-step setup.
   ============================================================ */

// Default models (checked September 2026). Change with the AI_MODEL setting.
const DEFAULT_MODELS = {
  gemini: "gemini-3.5-flash",          // free tier: https://ai.google.dev/gemini-api/docs/pricing
  claude: "claude-haiku-4-5-20251001", // https://platform.claude.com/docs/en/models/overview
  openai: "gpt-6-luna",                // https://developers.openai.com/api/docs/models
};
const DEFAULT_ORIGIN = "https://just-a-tin-can.github.io";
const MAX_IMAGE_CHARS = 2_500_000;              // ~1.8 MB image after base64
const MAX_MESSAGE_CHARS = 1500;

/* ---------- Local knowledge given to the AI on every request ---------- */
const KNOWLEDGE = `
You are "SawahKu", a friendly assistant for paddy (rice) farmers in Malaysia, mainly the
IADA Barat Laut Selangor area (Sungai Besar, Sekinchan, Tanjong Karang). Many users are older
farmers with little schooling. Rules:
- Answer in the user's language (Bahasa Melayu by default; English if they write English).
  Use simple everyday words, short sentences, and at most about 8 short bullet points.
- Base advice on Malaysian sources below (Jabatan Pertanian / DOA "Rice Check Padi 2022",
  Pakej Teknologi Padi, MADA, MARDI). Prefer this local guidance over generic advice.
- Recommend ACTIVE INGREDIENTS, never brand names. Tell farmers to follow the label rate,
  to rotate mode-of-action groups, and to check the label has an LRMP.R1/ registration number.
- NEVER recommend banned or restricted pesticides (list below). If asked about them, say they are banned.
- For poisoning: tell them to call 999 or the National Poison Centre 04-653 6999 and bring the label.
- If you are not sure, say so and suggest the District Agriculture Office (Pejabat Pertanian Daerah),
  IADA/PPK, or asking other farmers in the SawahKu Community. Don't invent numbers.
- Only help with farming, the farm, weather, prices, subsidies and farmer life. Politely decline other topics.

RICE CHECK PADI 2022 (DOA; 10 key checks, introduced 2002, revised 2022):
1 Soil suitability (pH 5.5–6.5) 2 Field plot condition (bunds 30–45 cm wide, level within ±2.5 cm)
3 Land preparation 4 Planting (certified seed "benih sah"; seed rate wet direct seeding 120–140 kg/ha,
direct seeding in water 150–180 kg/ha, machine transplanting 80 kg/ha, manual 40 kg/ha) 5 Fertiliser management
6 Water management 7 Integrated pest management 8 Harvest management 9 Post-harvest handling 10 Environmental management.
Targets: 8 t/ha direct seeding, 10 t/ha transplanting. Monitor, measure and record every season.
Fertiliser, direct seeding, 95–105-day variety, per hectare (1 ha ≈ 2.5 acres ≈ 3.5 relung):
 Day 15–20 compound 17.5:15.5:10 or 17:20:10 — 140 kg; Day 25–30 urea — 80 kg;
 Day 35–45 compound 100 kg + additional 17:3:25+2MgO 100 kg; Day 70–80 additional 17:3:25+2MgO 50 kg.
 Apply when the field has water; not before heavy rain. Other varieties/transplanting: ask the DOA office.
Water (continuous flooding): day 0–7 saturated, no standing water; 7–10: 3–5 cm; 15–40: 5 cm;
 40–90: 5–10 cm; drain the field 14 days before harvest.
Weeds: pre-emergence herbicide day 0–7; chemical weed control before day 40 (early varieties).
Action thresholds (Rice Check 2022): rats 5% damage; brown planthopper 5 adults or 10 nymphs per quadrat;
 leaf folder 30% damaged leaves; stem borer 1 egg mass or 1 adult moth per m²; golden apple snail 1 per m²;
 green leafhopper (tungro vector) 5 adults per 25 net sweeps, or 1 per 25 sweeps where tungro is present;
 blast: preventive spray on susceptible varieties or at first spots; sheath blight: spray when symptoms appear.
Harvest when 85–90% of grains are yellow.

PESTS, DISEASES, WEEDS (active ingredients; IRAC/FRAC/HRAC group):
- Golden apple snail (siput gondang emas): niclosamide, metaldehyde; treat low spots/drains only;
  keep water under 2 cm in first weeks; pick snails and pink eggs. Fentin acetate is illegal.
- Brown planthopper (bena perang): pymetrozine (9B), buprofezin (16), imidacloprid (4A); spray the plant base;
  avoid pyrethroids (cypermethrin, deltamethrin, lambda-cyhalothrin) — they cause resurgence; avoid excess urea.
- Stem borer (pengorek batang): chlorantraniliprole (28), fipronil (2B), cartap (14); destroy stubble.
  Carbofuran/Furadan is banned since 2023.
- Leaf folder (ulat pelipat daun): chlorantraniliprole (28); young paddy usually recovers; spray only at 30% damage.
- Rats (tikus): anticoagulant baits — first-generation (warfarin, coumatetralyl, chlorophacinone) preferred to protect
  barn owls; second-generation (bromadiolone, brodifacoum) also used; community baiting; barn owl nest boxes (1 per 40 ha). Calcium cyanide banned. Zinc phosphide being phased out (ends 2028).
- Rice blast (karah): tricyclazole (16.1), isoprothiolane (6), azoxystrobin (11); neck blast spray at booting/heading;
  avoid excess nitrogen; resistant varieties.
- Sheath blight (hawar seludang): hexaconazole (3), azoxystrobin + difenoconazole (11+3), pencycuron (20); spray the base.
- Bacterial leaf blight (hawar daun bakteria): no registered pesticide from maximum tillering onwards; in the nursery/active
  tillering Rice Check lists tribasic copper sulphate or copper sulphate pentahydrate. Drain, water ≤10 cm, no extra
  nitrogen, resistant varieties, destroy infected plants.
- Tungro: virus, cannot be cured; control green leafhopper with imidacloprid (4A) or buprofezin (16);
  rogue infected plants; tell the District Agriculture Office.
- Brown spot (bintik perang): usually poor soil — fix fertiliser; azoxystrobin + difenoconazole; hot-water seed treatment 53–54 °C for 10–12 minutes.
- Rice ear bug (pianggang / kesing, Leptocorisa): grain filling (panicle emergence to milky stage); punctured, spotted,
  empty grains, bad smell. Rice Check threshold: average 2 adults per quadrat (10 quadrats of 15x15 cm per lot).
  imidacloprid (4A), fipronil (2B), etofenprox (3A, pyrethroid — only if needed, can cause planthopper resurgence);
  observe the pre-harvest interval; clear barnyard grass and weeds; synchronous planting.
- White-backed planthopper (bena belakang putih, Sogatella furcifera): 40–70 days after sowing; white stripe on back;
  orange-yellow then burnt leaves. Threshold 5 adults or 10 nymphs per quadrat. pymetrozine (9B), buprofezin (16, nymphs),
  imidacloprid (4A); rotate groups (resistance risk); avoid deltamethrin/cypermethrin (resurgence);
  no insecticide before day 40 unless threshold reached.
- Birds (burung pipit / munias, Lonchura): grain filling to harvest;
  no registered pesticide; scarers, flags, reflective tape, guarding, synchronous planting, netting small plots; never poison bait (may be illegal,
  kills barn owls and other useful birds).
- Sheath rot (reput seludang, Sarocladium oryzae): flag-leaf sheath rots, panicle stuck or half-emerged, brown grains;
  high on the plant (unlike sheath blight). No registered fungicide on paddy in Malaysia (Rice Check 2022); seed treatment,
  control stem borers, avoid excess N, potash at tillering, destroy stubble.
- False smut (bertih, Ustilaginoidea virens): some grains become velvety orange then greenish-black balls after heading.
  No registered fungicide in Malaysia; research: triazole (e.g. propiconazole) before heading — ask DOA first.
  Moderate N, certified seed, remove infected panicles; balls contain toxins harmful to people and animals.
- Bakanae (Fusarium fujikuroi): abnormally tall, thin, pale seedlings/plants, roots from upper nodes, die or empty grain.
  Seed-borne. No registered spray; seed treatment (MARDI research: thiram M3, benomyl/carbendazim 1, propiconazole 3);
  discard floating seed; MADA hot water 55 °C 5 min after 8–12 h soak; pull out tall pale plants; don't save seed.
- Bacterial leaf streak (jalur daun bakteria, Xanthomonas oryzae pv. oryzicola): narrow water-soaked, translucent streaks
  BETWEEN veins, yellow ooze droplets; BLB instead starts at the leaf tip/edge and turns white. No registered pesticide
  (MARDI research: copper only for severe cases); drain, no extra N, resistant varieties, remove weeds/volunteer rice.
- Weedy rice (padi angin): Clearfield system imazapic + imazapyr (HRAC 2) only with MR220CL1/MR220CL2, 0–7 days after sowing;
  not more than two seasons in a row (resistance); hand-pull at day 70–80; clean seed and machines.
- Weeds (rumpai): pretilachlor (15) pre-emergence; cyhalofop-butyl (1) for grasses before 4-leaf stage;
  bensulfuron-methyl (2) and propanil (5) for sedges/broadleaf; propanil + quinclorac for bispyribac-resistant barnyard grass.

BANNED in Malaysia (DOA list, Aug 2025): paraquat (2020), carbofuran (2023), endosulfan (2005), fentin acetate
(never registered), butachlor, calcium cyanide (2002), fluoroacetamide, trichlorfon (2025), profenofos, triazophos,
quinalphos, prothiofos, phenthoate (2015), DDT, aldrin, dieldrin, chlordane, heptachlor, lindane, HCH, parathion,
methyl parathion, aldicarb, toxaphene, alachlor, azinphos-methyl, captafol, folpet, 2,4,5-T, DNOC, methomyl, dicofol,
pentachlorophenol, mercury compounds, chlorpyrifos (all registrations ended 1 Jul 2026), monocrotophos (ended 31 Dec 2025).
RESTRICTED (not for paddy): methamidophos (coconut/oil palm trunk injection only, until 31 Dec 2027),
acephate (coconut/oil palm only).
Fertiliser: no federal fertiliser law yet (Fertiliser Control Bill still being drafted); fertiliser is a controlled
item (wholesalers need a KPDN licence). Warn about fake fertiliser: buy from known sellers, check grade/weight/maker,
be wary of very cheap prices, keep receipts.

SAFETY: gloves, mask, long sleeves, boots; don't eat/drink/smoke while spraying; never reuse pesticide bottles;
triple-rinse and puncture empty bottles; spray early morning or late afternoon in calm weather, not before rain.
OFFICIAL SITES: KPKM kpkm.gov.my, DOA doa.gov.my, MARDI mardi.gov.my, MetMalaysia met.gov.my (myCuaca app),
Public InfoBanjir publicinfobanjir.water.gov.my, registered pesticides portal.doa.gov.my/racunberdaftar,
Agrobank Skim Takaful Tanaman Padi (crop cover for floods, drought, pests, disease).
`;

const SCAN_PROMPT = `
You look at a photo from a Malaysian paddy farmer and identify the most likely problem.
Choose exactly one id from this list:
snail (golden apple snail or its pink eggs), bph (brown planthopper / hopperburn), borer (stem borer: deadheart or whitehead),
leaffolder (leaf folder: folded leaves with white streaks), rat (rat damage: stems cut at an angle),
ricebug (rice ear bug / pianggang: slender green-brown bug on panicles, spotted empty grains),
wbph (white-backed planthopper: small hopper with white stripe on the back, hopperburn),
birds (munias / grain-eating birds, pecked panicles),
blast (blast: diamond/eye-shaped grey-centred spots, neck rot), sheath (sheath blight: grey-green oval patches near water line),
blb (bacterial leaf blight: yellow-white wavy leaf edges from the tip), tungro (yellow-orange stunted plants),
brownspot (brown spot: many small oval brown spots),
sheathrot (sheath rot: rotting flag-leaf sheath, panicle stuck inside), falsesmut (false smut: orange/green velvety balls on grains),
bakanae (bakanae: abnormally tall thin pale seedlings or plants),
bls (bacterial leaf streak: narrow translucent streaks between leaf veins),
weedyrice (weedy rice: taller rice-like plants, shattering/red grains),
weeds (grasses, sedges, broadleaf weeds), healthy (healthy paddy),
other (a paddy problem you can recognise that is NOT in this list, e.g. a nutrient deficiency or another pest or disease —
put its real name in "name"),
unknown (not paddy, too blurry, or not sure).
Reply with ONLY a JSON object, no other text:
{"id": "<id>", "confidence": "high"|"medium"|"low", "name": "<problem name in the user's language>",
 "signs": "<what you see in the photo, one short sentence in the user's language>",
 "advice": "<one or two short practical next steps in the user's language, using the local guidance; active ingredients only, no brands>"}
Use "low" confidence unless the signs are clear. Use "other" only when you are fairly sure what it is; never guess wildly —
use "unknown" if unsure. For "other", never recommend banned pesticides and tell the farmer to confirm with the
District Agriculture Office.
`;

const VALID_IDS = ["snail", "bph", "borer", "leaffolder", "rat", "ricebug", "wbph", "birds", "blast", "sheath", "blb", "tungro",
  "brownspot", "sheathrot", "falsesmut", "bakanae", "bls", "weedyrice", "weeds", "healthy", "other", "unknown"];

/* ---------- Helpers ---------- */
function corsHeaders(request, env) {
  const allowed = (env.ALLOWED_ORIGIN || DEFAULT_ORIGIN).split(",").map((s) => s.trim()).filter(Boolean);
  const origin = request.headers.get("Origin") || "";
  const ok = allowed.includes(origin) || allowed.includes("*");
  return {
    "Access-Control-Allow-Origin": ok ? (allowed.includes("*") ? "*" : origin) : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } });
}

function originAllowed(request, env) {
  const allowed = (env.ALLOWED_ORIGIN || DEFAULT_ORIGIN).split(",").map((s) => s.trim());
  const origin = request.headers.get("Origin") || "";
  return allowed.includes("*") || allowed.includes(origin);
}

function langNote(lang) {
  return lang === "en" ? "The user has chosen English." : "The user has chosen Bahasa Melayu. Reply in simple Malay unless they write in English.";
}

function pickProvider(env) {
  const want = String(env.AI_PROVIDER || "").toLowerCase();
  if (want === "gemini" && env.GEMINI_API_KEY) return "gemini";
  if ((want === "claude" || want === "anthropic") && env.ANTHROPIC_API_KEY) return "claude";
  if ((want === "openai" || want === "chatgpt") && env.OPENAI_API_KEY) return "openai";
  if (env.GEMINI_API_KEY) return "gemini";
  if (env.ANTHROPIC_API_KEY) return "claude";
  if (env.OPENAI_API_KEY) return "openai";
  return null;
}

function splitDataUrl(dataUrl) {
  const m = String(dataUrl).match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  return m ? { mime: m[1], data: m[2] } : null;
}

async function readJson(res, who) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data.error && (data.error.message || data.error.type)) || (who + " error " + res.status);
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

// Pull the text out of an OpenAI Responses API result
function outputText(data) {
  if (typeof data.output_text === "string" && data.output_text) return data.output_text;
  const parts = [];
  (data.output || []).forEach((item) => {
    (item.content || []).forEach((c) => { if (c.type === "output_text" && c.text) parts.push(c.text); });
  });
  return parts.join("\n").trim();
}

/* One function for all providers.
   system: string, messages: [{role: "user"|"assistant", content: string}],
   image: optional data URL attached to the last user message. */
/* Gemini 3.x "thinks" before answering, and the thinking uses up the same
   token allowance as the answer. Keep thinking low and leave headroom,
   otherwise answers get cut off (the scan then shows "not sure"). */
const GEMINI_FALLBACK = "gemini-3.5-flash-lite";

function isQuotaError(e) {
  return (e && e.status === 429) || /quota|rate limit|resource.?exhausted/i.test(String(e && e.message));
}

// Google's servers are temporarily overloaded ("high demand", 503). Usually clears in seconds.
function isOverloaded(e) {
  return (e && (e.status === 503 || e.status === 500)) || /high demand|overloaded|unavailable|try again later/i.test(String(e && e.message));
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function geminiConfig(model, maxTokens, opts) {
  const cfg = { maxOutputTokens: maxTokens + 2048 };
  if (/^gemini-[3-9]/.test(model) && !/lite/.test(model)) cfg.thinkingConfig = { thinkingLevel: "low" };
  else if (/^gemini-2\.5-flash/.test(model)) cfg.thinkingConfig = { thinkingBudget: 0 };
  if (opts && opts.json) cfg.responseMimeType = "application/json";
  return cfg;
}

async function callAI(env, system, messages, maxTokens, image, opts) {
  const provider = pickProvider(env);
  const model = env.AI_MODEL || env.OPENAI_MODEL || DEFAULT_MODELS[provider];
  const img = image ? splitDataUrl(image) : null;

  if (provider === "gemini") {
    const contents = messages.map((m, i) => {
      const parts = [{ text: m.content }];
      if (img && i === messages.length - 1) parts.push({ inline_data: { mime_type: img.mime, data: img.data } });
      return { role: m.role === "assistant" ? "model" : "user", parts };
    });
    const ask = async (name) => {
      const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(name) + ":generateContent", {
        method: "POST",
        headers: { "x-goog-api-key": env.GEMINI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: geminiConfig(name, maxTokens, opts) }),
      });
      const data = await readJson(res, "Gemini");
      const cand = (data.candidates || [])[0] || {};
      return ((cand.content && cand.content.parts) || []).map((p) => p.text || "").join("").trim();
    };
    // The free tier gives the main model only a few requests a day. When they
    // run out, carry on with the "lite" model, which has a much bigger allowance.
    // If the main model is busy ("high demand"), try the lite model, then wait
    // a moment and try each once more before giving up.
    const backup = env.AI_FALLBACK_MODEL || GEMINI_FALLBACK;
    const order = backup && backup !== model ? [model, backup] : [model];
    let lastErr;
    const usedUp = new Set();   // models whose daily quota has run out — no point retrying
    for (let round = 0; round < 2; round++) {
      for (const name of order) {
        if (usedUp.has(name)) continue;
        try {
          return await ask(name);
        } catch (e) {
          lastErr = e;
          if (isQuotaError(e)) usedUp.add(name);
          else if (!isOverloaded(e)) throw e;
        }
      }
      if (usedUp.size === order.length) break;
      if (round === 0) await wait(1500);
    }
    throw lastErr;
  }

  if (provider === "claude") {
    const msgs = messages.map((m, i) => {
      if (img && i === messages.length - 1) {
        return { role: "user", content: [
          { type: "image", source: { type: "base64", media_type: img.mime, data: img.data } },
          { type: "text", text: m.content },
        ] };
      }
      return { role: m.role, content: m.content };
    });
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: msgs }),
    });
    const data = await readJson(res, "Claude");
    return (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
  }

  if (provider === "openai") {
    const input = [{ role: "system", content: system }].concat(messages.map((m, i) => {
      if (img && i === messages.length - 1) {
        return { role: "user", content: [{ type: "input_text", text: m.content }, { type: "input_image", image_url: image }] };
      }
      return { role: m.role, content: m.content };
    }));
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": "Bearer " + env.OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ model, input, max_output_tokens: maxTokens + 2048 }),
    });
    return outputText(await readJson(res, "OpenAI"));
  }

  throw new Error("No AI key set");
}

function parseScan(text) {
  const m = String(text || "").match(/\{[\s\S]*\}/);
  let r = {};
  try { r = m ? JSON.parse(m[0]) : {}; } catch (e) { r = {}; }
  if (!m && String(text || "").trim()) r = { advice: String(text).replace(/[`*#]/g, "").trim() };   // AI answered in plain words
  let id = VALID_IDS.includes(r.id) ? r.id : "unknown";
  if (id === "other" && !String(r.name || "").trim()) id = "unknown";   // "other" needs a name
  const confidence = ["high", "medium", "low"].includes(r.confidence) ? r.confidence : "low";
  const clip = (s) => String(s || "").slice(0, 400);
  return { id, confidence, name: clip(r.name), signs: clip(r.signs), advice: clip(r.advice) };
}

/* ---------- Routes ---------- */
async function handleChat(body, env) {
  const msgs = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const convo = msgs
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
  while (convo.length && convo[0].role !== "user") convo.shift();   // Claude/Gemini need a user turn first
  if (!convo.length || convo[convo.length - 1].role !== "user") return { error: "No question" };
  const reply = await callAI(env, KNOWLEDGE + "\n" + langNote(body.lang), convo, 700);
  return { reply };
}

async function handleScan(body, env) {
  const image = String(body.image || "");
  if (!/^data:image\/(jpeg|png|webp);base64,/.test(image)) return { error: "Bad image" };
  if (image.length > MAX_IMAGE_CHARS) return { error: "Image too large" };
  const text = await callAI(env, KNOWLEDGE + "\n" + SCAN_PROMPT + "\n" + langNote(body.lang),
    [{ role: "user", content: "Identify the problem in this paddy photo." }], 600, image, { json: true });
  return parseScan(text);
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") return json({ ok: true, service: "SawahKu AI", provider: pickProvider(env) || "none" }, 200, cors);
    if (request.method !== "POST") return json({ error: "Not found" }, 404, cors);
    if (!originAllowed(request, env)) return json({ error: "Origin not allowed" }, 403, cors);
    if (!pickProvider(env)) return json({ error: "Server has no AI key (add GEMINI_API_KEY, ANTHROPIC_API_KEY or OPENAI_API_KEY)" }, 500, cors);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: "Bad JSON" }, 400, cors); }

    try {
      let out;
      if (url.pathname === "/chat") out = await handleChat(body, env);
      else if (url.pathname === "/scan") out = await handleScan(body, env);
      else return json({ error: "Not found" }, 404, cors);
      return json(out, out.error ? 400 : 200, cors);
    } catch (e) {
      if (isQuotaError(e)) return json({ error: "busy", detail: e.message }, 429, cors);
      if (isOverloaded(e)) return json({ error: "overloaded", detail: e.message }, 503, cors);
      return json({ error: "AI unavailable: " + e.message }, 502, cors);
    }
  },
};

// Exposed for local tests only
export { parseScan, outputText, pickProvider, KNOWLEDGE };
