# The Arena Hub — .com (Edge Products)
**TheArenaHub** · Deployed on Vercel · Updated August 2026

The Arena Hub's consumer/practitioner-facing edge products: Arena Lite, Arena Hestia,
Arena Athena and Arena Harmonia. A sovereign learning and evidence ecosystem for the
people who support a child's learning — practitioners, families, professionals and
the wider network around them — sharing common infrastructure (HIVEMIND, Armoury,
SECO) while each product serves a distinct context.

## Products

| Product | Status | Page |
|---|---|---|
| Arena Lite | Live | `lite.html` |
| Arena Hestia | Live | `hestia.html`, `hestia-signup.html` |
| Arena Athena | Under construction | `athena.html` |
| Arena Harmonia | Under construction | `harmonia.html` |

## Tech Stack

Frontend: HTML / vanilla JS (Navy + Gold UI)
Auth: Google OAuth via GAS ENGINE_LIBRARY
Backend: Google Apps Script (ENGINE_LIBRARY v1.8.0)
Ledger: Google Sheets (STUDENT_VAULT — per-school sovereign deployment, Lite only)
Ingestor: Cloud Run (arena-hub-ingestor, europe-west2)
AI: Gemini 2.0 Flash (taxonomy matching via /suggest endpoint)
Hosting:    Vercel (Production)
```

## Pages

| File | Purpose |
|---|---|
| `index.html` | Ecosystem landing page — all four products |
| `lite.html` | Arena Lite product page |
| `hestia.html` | Arena Hestia product page |
| `hestia-signup.html` | Arena Hestia self-service trial signup |
| `athena.html` | Arena Athena — under construction |
| `harmonia.html` | Arena Harmonia — under construction |
| `app.html` | Main application shell (Lite) |
| `login.html` | Google OAuth login screen |
| `signup.html` | School onboarding / licence registration |
| `success.html` | Post-signup confirmation |
| `dpa.html` | Data Processing Agreement (UK GDPR Art. 28) |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms & Conditions |

## Dynamic Config

Contact details, legal identifiers, and email addresses are managed via the **ARENA_SITE_CONFIG** Google Sheet in the `05_Websites` Shared Drive folder. The `arena-config.js` script fetches config on page load and injects values via `data-config` attributes.

**To update a contact detail:** Open ARENA_SITE_CONFIG sheet → ⚡ Arena Config → Open Admin Panel → edit → Commit.

## Assets

| File | Purpose |
|---|---|
| `assets/` | UI screenshots, product video, PWA icons |
| `arena-icon-*.png` | PWA icons (180, 192, 512, 1024px) |
| `app-manifest.json` | PWA manifest |
| `sw.js` | Service worker (offline caching) |
| `vercel.json` | Vercel deployment config |

## Company

**The Arena Hub Ltd** · Company No. 1708605 · Registered in England & Wales
Founder: Jonathan Baguley · [thearenahub.co.uk](https://thearenahub.co.uk)

## Company

**The Arena Hub Ltd** · Company No. 1708605 · Registered in England & Wales  
Founder: Jonathan Baguley · [thearenahub.co.uk](https://thearenahub.co.uk)
