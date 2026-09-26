# SawahKu — prototype web app for paddy farmers

A simple, bilingual (Bahasa Melayu by default, English with one tap) web app for paddy farmers.
Large text, big buttons and a bottom tab bar on phones so older farmers can use it easily.

Live: https://just-a-tin-can.github.io/osip/

## Pages

| Page | File | What it does |
|---|---|---|
| Utama / Home | `index.html` | Greeting, today's weather, quick "ask" box, latest community posts, farming news |
| Cuaca / Weather | `weather.html` | 7-day forecast, "OK to spray?" and water-level advice for each day, share to WhatsApp |
| Tanya AI / Ask AI | `ask.html` | Chat assistant for farming questions. Type or tap the mic to speak; answers can be read aloud |
| Tanaman / Crop info | `crop.html` | Pests, diseases and weeds: search by name or pick what you see ("yellow leaves") |
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
- `js/chat.js` — the assistant's answers and chat screen
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
- **The assistant is rule-based**, not a real AI. It matches keywords against a built-in set of
  answers and the crop info entries. A real AI chatbot would need a server and an AI API key.
- **A real forum** (posts shared between farmers) would need a server and database, plus moderation.
- E-book reading progress and text size are saved on each phone only.
- Voice input uses the phone browser's speech recognition (works best in Chrome on Android).
- Weather comes from Open-Meteo. Advice (spray / water) is a simple rule of thumb, not official guidance.
- Fertiliser schedule follows the Department of Agriculture's Rice Check guide. Always confirm
  with the local agriculture office.
