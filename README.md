# SawahKu — prototype web app for paddy farmers

A simple, bilingual (Bahasa Melayu by default, English with one tap) web app for paddy farmers.
Large text, big buttons and a bottom tab bar on phones so older farmers can use it easily.

Live: https://just-a-tin-can.github.io/osip/

## Pages

| Page | File | What it does |
|---|---|---|
| Utama / Home | `index.html` | Greeting, today's weather, quick "ask" box, latest community posts, farming news |
| Jadual / Schedule | `jadual.html` | Enter the sowing date (and field size): today's paddy age, stage and water level, what to do now and next, fertiliser amounts for your field, all dates from Rice Check 2022; save reminders to the phone calendar (.ics), share on WhatsApp, print. Saved on the phone only |
| Cuaca / Weather | `weather.html` | 7-day forecast, "OK to spray?" and water-level advice for each day, share to WhatsApp |
| Tanya AI / Ask AI | `ask.html` | Chat assistant. Uses Gemini (free), Claude or ChatGPT through the Worker when set up, otherwise built-in offline answers. Type or speak; answers can be read aloud |
| Tanaman / Crop info | `crop.html` | Photo scan (AI), real photos of each pest/disease, when to act (Rice Check thresholds), recommended active ingredients with IRAC/FRAC/HRAC groups, and a **banned pesticides & fertiliser** tab |
| Komuniti / Community | `forum.html` | Reddit-style forum: post questions with photos, comment, upvote |
| Agensi & Soalan Lazim / Agencies & FAQ | `info.html` | All government and local agency sites for paddy farmers in one place, emergency numbers, and FAQ (incl. "Why SawahKu, not ChatGPT?"). Linked from the home page, footer, Ask AI and the chat answers |
| E-Buku / E-books | `learn.html` | Short farming guides: read chapter by chapter, listen aloud, bigger text, print / save as PDF |

`booking.html`, `guide.html` and `updates.html` are from the old version of the site. They now
only redirect to the new pages so old links still work.

## Files

- `css/style.css` — all styles
- `js/i18n.js` — every piece of text, in `ms` and `en`
- `js/main.js` — header, bottom tabs, footer, language switch, shared helpers
- `js/weather.js` — forecast (Open-Meteo, free, no key) with sample data if offline
- `js/news.js` — the news list (edit this file to add news)
- `js/cropdata.js` — the pest / disease / weed entries
- `js/crop.js` — crop info page
- `js/chat.js` — the chat screen and the offline answers
- `js/config.js` — **put your AI Worker address here** (never an API key)
- `js/ai.js` — talks to the AI Worker (chat + photo scan)
- `js/scan.js` — the photo scan on the Crop page
- `worker/worker.js` — the Cloudflare Worker that holds the AI key and the local knowledge (see `SETUP-AI.md`)
- `js/forum.js` — community forum
- `js/info.js` — the agency list and FAQ (edit this file to add a link or question; links were checked September 2026)
- `js/ebooks.js` — the e-book text (edit this file to add or change books)
- `js/learn.js` — e-book library and reader

## Adding news

Open `js/news.js` and copy one of the entries at the top of the `NEWS` list. Fill in the date,
source, link and the Malay and English title/summary. The newest item goes first.

## Adding an e-book

Open `js/ebooks.js`, copy one whole book block (from `{ id: ...` to its closing `}`), give it a new `id`,
colour and icon, then write the Malay and English title and chapters. Each chapter is
`["Chapter title", "chapter text"]` for `ms` and for `en`. Reading time is worked out automatically.

## Prototype notes

- **No server.** Everything runs in the browser. Forum posts, votes and names are saved only on
  the phone that made them (browser storage). The sample posts are marked "Contoh / Sample".
- **AI**: follow `SETUP-AI.md` to connect Google Gemini (free tier), Claude or ChatGPT through a free Cloudflare Worker. Until then,
  Ask AI uses built-in keyword answers and the photo scan explains that it needs the AI connection.
- **A real forum** (posts shared between farmers) would need a server and database, plus moderation.
- E-book reading progress and text size are saved on each phone only.
- Voice input uses the phone browser's speech recognition (works best in Chrome on Android).
- Weather comes from Open-Meteo. Advice (spray / water) is a simple rule of thumb, not official guidance.
- Fertiliser, water and pest thresholds follow the Department of Agriculture's **Rice Check Padi 2022**. The banned list
  follows the DOA list of 26 Aug 2025. Pest photos are from Wikimedia Commons (credited on each photo) and load
  from the internet. Always confirm with the local agriculture office.
- Animations respect the phone's "reduce motion" setting.
