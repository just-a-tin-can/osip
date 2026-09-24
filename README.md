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
| `guide.html` | Fertiliser, pesticide and water schedule worked out from the sowing date and field size, plus a 7-day weather forecast with water and drone-flight advice |
| `booking.html` | Booking form (demo only). Bookings are saved in the browser and listed under "My bookings" |

## Files
- `css/style.css`: all styles
- `js/i18n.js`: all English and Malay text. Edit wording here.
- `js/main.js`: header, footer, language switch and shared helpers
- `js/schedule.js`: fertiliser schedule data and the table
- `js/weather.js`: Open-Meteo forecast and advice rules
- `js/booking.js`: booking form, validation and confirmation

## Sources
- Fertiliser rates and water levels: Department of Agriculture Malaysia "Rice Check" guideline for direct-seeded paddy
- Drone specs: DJI Agriculture, ag.dji.com/t20p/specs
- Weather: Open-Meteo API (free, no key)

## Placeholders to replace
- Phone number and email in the footer (`footer.phone`, `footer.email` in `js/i18n.js`)
