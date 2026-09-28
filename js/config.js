/* ============================================================
   SawahKu — settings

   aiEndpoint: the web address of your Cloudflare Worker that talks
   to the AI (Gemini, Claude or ChatGPT). See SETUP-AI.md.

     Example: "https://sawahku-ai.your-name.workers.dev"

   Leave it empty ("") and the app still works: Ask AI uses the
   built-in offline answers, and the photo scan explains that it
   needs the AI connection.

   NEVER put an AI API key in this file — this website is
   public, so anyone could copy the key and use your credit.
   The key goes only into the Cloudflare Worker's secret settings.
   ============================================================ */

window.SK_CONFIG = {
  aiEndpoint: "https://sawahku-ai.justinleongjq.workers.dev/"
};
