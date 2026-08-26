# FRAMECO STUDIO website

Static website recreated from the supplied FrameCo Website PDF.

## Files
- `index.html` — entry point
- `styles.css` — visual system and responsive layout
- `app.js` — routing, shop, cart, checkout and CliQ payment flow
- `assets/` — visual assets extracted from the supplied design PDF

## Run locally
Open `index.html` in a browser, or use a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy
This is a static site, so it can be deployed to Netlify, Vercel, GitHub Pages, Cloudflare Pages, or any normal web host.

## Important
The checkout/payment flow is front-end only. It stores the cart in localStorage and shows the CliQ instructions from the supplied design. It does not send orders to a database, email, WhatsApp, or payment gateway yet.

Before going live, replace the placeholder/temporary CliQ alias and connect the order form to your preferred backend or form service.
