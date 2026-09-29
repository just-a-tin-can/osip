# Connecting SawahKu to real AI

This makes **Tanya AI** and **Imbas tanaman** (photo scan) use real AI. It takes about 10 minutes.

You can use **one** of these. Just add the key for the one you choose:

| Option | Cost | What you need |
|---|---|---|
| **Google Gemini** (recommended to start) | **Free** (free tier, daily limits) | A Google account. No card. |
| Anthropic **Claude** | Pay per use, about 2–3 sen per question or scan | Card, prepaid credit at console.anthropic.com |
| OpenAI **ChatGPT** | Pay per use | Card, credit at platform.openai.com |

A ChatGPT Plus or Claude Pro **chat subscription does not work for this**. Websites use a separate
"API" account. Gemini's API has a free tier, so you don't need to pay anything to start.

## Why there is a "Worker" in the middle

The website is public (GitHub Pages), so a key placed in it could be copied by anyone. The key
therefore lives in a tiny free server, a **Cloudflare Worker**:

```
Phone → SawahKu website → Cloudflare Worker (holds the key + local Rice Check knowledge) → Gemini / Claude / ChatGPT
```

The Worker also sends the local knowledge (Rice Check 2022, recommended active ingredients,
the banned-pesticide list, official agencies) with every question, so answers stay Malaysian and safe.

## Step 1 — Get ONE key

**Free: Google Gemini**
1. Go to <https://aistudio.google.com> and sign in with a Google account.
2. Click **Get API key** → **Create API key** → copy it.

**Or Claude:** <https://console.anthropic.com> → sign up → **Billing**, add credit (USD 5 is plenty for a demo) →
**API keys** → **Create key** → copy it (starts with `sk-ant-`).

**Or ChatGPT:** <https://platform.openai.com> → **Billing**, add credit → **API keys** → create → copy (starts with `sk-`).

Keep the key private. Never paste it into the website files.

## Step 2 — Create the Cloudflare Worker (free)

1. Go to <https://dash.cloudflare.com> and sign up.
2. **Workers & Pages** → **Create** → **Create Worker** → name it `sawahku-ai` → **Deploy**.
3. Click **Edit code**. Delete everything, paste the whole of `worker/worker.js` from this folder,
   then click **Deploy**.
4. Go to the Worker's **Settings** → **Variables and Secrets** → **Add**, type **Secret**, and add the key you got:
   - Gemini → name `GEMINI_API_KEY`
   - Claude → name `ANTHROPIC_API_KEY`
   - ChatGPT → name `OPENAI_API_KEY`
5. Also add `ALLOWED_ORIGIN` (type **Text**) = `https://just-a-tin-can.github.io`
   (to also test on your laptop: `https://just-a-tin-can.github.io,http://localhost:8000`).
6. Click **Deploy** again. Copy the Worker address, e.g. `https://sawahku-ai.yourname.workers.dev`.
   Opening it in a browser should show `{"ok":true,"service":"SawahKu AI","provider":"gemini"}`
   (or `claude` / `openai`).

## Step 3 — Tell the website where the Worker is

Open `js/config.js` and put the Worker address between the quotes, then upload the folder to GitHub:

```js
window.SK_CONFIG = {
  aiEndpoint: "https://sawahku-ai.yourname.workers.dev"
};
```

## Step 4 — Check it works

- **Tanya AI**: the yellow "Prototaip" label turns green, *"Dikuasakan AI dengan panduan tempatan…"*. Ask a question.
- **Tanaman → Imbas tanaman**: take a photo of a leaf. The result links to the matching pest or disease.

## Models used (you normally don't need to change these)

| Provider | Default model | Change with setting |
|---|---|---|
| Gemini | `gemini-3.5-flash` | `AI_MODEL` |
| Claude | `claude-haiku-4-5-20251001` (fastest, cheapest Claude: USD 1 / 5 per million tokens in/out) | `AI_MODEL` |
| ChatGPT | `gpt-6-luna` | `AI_MODEL` |

If you add more than one key, choose which to use with `AI_PROVIDER` = `gemini`, `claude` or `openai`.

## Things to know about the free Gemini tier

- It has **daily limits** (see yours at <https://aistudio.google.com/rate-limit>). In September 2026 the free
  tier allowed only about **20 requests a day** for `gemini-3.5-flash`, but about **500 a day** for
  `gemini-3.5-flash-lite`. The Worker uses the better model first and switches to the lite model
  automatically when the daily limit runs out (change it with `AI_FALLBACK_MODEL`). To always use the
  lite model, set `AI_MODEL` = `gemini-3.5-flash-lite`.
- If both limits run out, the app says the AI is busy and falls back to its built-in offline answers.
  A whole district of farmers would need the paid tier.
- Google says free-tier content **may be used to improve its products**. Tell farmers not to send personal
  information in questions. For a real launch, a paid tier (Gemini, Claude or ChatGPT) avoids this.

## If something goes wrong

| What you see | What to check |
|---|---|
| "AI tidak dapat dihubungi — ini jawapan asas" | Worker address in `js/config.js`; the key secret name in the Worker; credit (Claude/ChatGPT) or daily limit (Gemini) |
| Worker error mentions the model | Set `AI_MODEL` to a model listed on your provider's models page |
| "Origin not allowed" | Add your site address to `ALLOWED_ORIGIN` exactly (no trailing `/`) |
| Key was shared by mistake | Delete it at the provider, create a new one, update the Worker secret |

## Good to know

- AI answers can still be wrong. The app always reminds farmers to confirm serious problems
  with the District Agriculture Office before buying pesticide.
- Photos go to the AI provider for analysis only; the Worker does not store them.
- To update the local knowledge (e.g. a new banned pesticide), edit the `KNOWLEDGE` text near the
  top of `worker/worker.js` and deploy again.
