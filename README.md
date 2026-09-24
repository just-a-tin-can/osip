# ADP Sytech – prototype website

A static HTML/CSS/JavaScript site for ADP Sytech, a drone fertiliser and pesticide service for paddy farmers. It opens in Bahasa Melayu, and the EN/BM switch in the header changes the language. The site remembers the visitor's choice.

Farmers bring their own fertiliser and pesticide. ADP Sytech provides the drone and pilot.

## How to open
Double-click `index.html`. You don't need a server.
The weather forecast needs internet. Without internet, it shows sample data.

## Pages
| File | What it does |
|---|---|
| `index.html` | Promotes the business: about, why use drones, how it works, the DJI Agras T20P, FAQ |
| `guide.html` | Fertiliser, pesticide and water schedule worked out from the sowing date and field size, with a countdown and phone calendar reminders |
| `updates.html` | Latest Info: 7-day weather with water and drone advice, agriculture news, and the pest & pesticide guide. News and weather can be shared on WhatsApp |
| `booking.html` | Grab-style booking in 4 simple steps (Where → What → When → Confirm). "My bookings" shows each job's status, and lets farmers rate finished jobs with stars, quick tags and a comment. Demo only: saved in the browser |
| `booking.html#feedback` | Feedback tab (inside the booking page, not in the menu): rate a job any time, even if it was booked by phone. Share this link with farmers after a job, e.g. `booking.html?ref=ADP-XXXXXX#feedback` to fill in the booking number |

## Files
- `css/style.css`: all styles
- `js/i18n.js`: all English and Malay text. Edit wording here.
- `js/main.js`: header, footer, language switch and shared helpers
- `js/schedule.js`: fertiliser schedule data and the table
- `js/weather.js`: Open-Meteo forecast and advice rules
- `js/news.js`: the news list. **To add news, edit the list at the top of this file** (real news with a source link only)
- `js/booking.js`: booking steps, My bookings, status and ratings

## Sources
- Fertiliser rates and water levels: Department of Agriculture Malaysia "Rice Check" guideline for direct-seeded paddy
- Drone specs: DJI Agriculture, ag.dji.com/t20p/specs
- Weather: Open-Meteo API (free, no key)

## WhatsApp
Bookings and questions can be sent on WhatsApp to +60 11-6286 8669. To use a different number, change `WHATSAPP_NUMBER` and `WHATSAPP_DISPLAY` near the top of `js/main.js`.

## Placeholders to replace
- Email in the footer (`footer.email` in `js/i18n.js`)
