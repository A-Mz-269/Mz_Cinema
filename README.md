# \ud83c\udfac Mz Cinema

> A full-featured Progressive Web App for streaming movies and TV series \u2014 installable, bilingual, and blazing fast.

![PWA Ready](https://img.shields.io/badge/PWA-Ready-E50914?style=flat-square)
![TMDB API](https://img.shields.io/badge/TMDB-API-01b4e4?style=flat-square)
![Bilingual](https://img.shields.io/badge/Language-EN%20%2F%20AR-f5c518?style=flat-square)
![No Backend](https://img.shields.io/badge/Backend-None-22c55e?style=flat-square)
![Sources](https://img.shields.io/badge/Stream%20Sources-11-a855f7?style=flat-square)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Deployment](#deployment)
- [PWA Installation](#pwa-installation)
- [Bug Fixes Applied](#bug-fixes-applied)
- [Stream Sources](#stream-sources)
- [API & Configuration](#api--configuration)
- [License](#license)

---

## Overview

**Mz Cinema** is a single-file Progressive Web App that delivers a Netflix-style streaming discovery experience. It pulls live data from [The Movie Database (TMDB)](https://themoviedb.org) API and routes playback through multiple embedded stream sources, automatically falling back to the next source if one fails.

The app is fully installable on Android and iOS as a home screen app, supports both **English and Arabic** with full RTL layout switching, dark/light theme, watchlist persistence, and watch history \u2014 all with **zero backend required**.

---

## Features

| Feature | Description |
|---|---|
| \ud83c\udfac **Multi-Source Streaming** | 11 embedded sources with automatic sequential fallback |
| \ud83d\udcf2 **PWA Installable** | Add to home screen on Android & iOS, standalone mode |
| \ud83c\udf10 **Bilingual EN / AR** | Full RTL layout switching, localized TMDB API results |
| \ud83d\udd0d **Advanced Search** | Real-time search with type, genre, language, year filters |
| \ud83c\udf19 **Dark / Light Theme** | Full CSS variable theme system, persisted per session |
| \ud83d\udcd1 **Watchlist & History** | Bookmark titles, continue watching row, 30-item history |
| \ud83d\udcfa **TV Series Support** | Season/episode picker, prev/next navigation |
| \u26a1 **Offline Shell** | Service Worker caches app shell for offline loading |
| \ud83c\udfad **Cast & Filmography** | Actor profiles with biography and full credits |
| \ud83d\udd22 **Source Progress Bar** | Visual indicator showing which source is being tried |

---

## Tech Stack

- **Vanilla JavaScript** \u2014 no frameworks, no build tools
- **HTML5 + CSS3** \u2014 single-file app with CSS custom properties
- **TMDB API v3** \u2014 movie/TV metadata, images, search
- **Service Worker API** \u2014 offline caching, PWA enablement
- **Web App Manifest** \u2014 install prompt, splash screen, theming
- **localStorage** \u2014 watchlist, history, theme and language preferences
- **Google Fonts** \u2014 Bebas Neue, Inter, Cairo (Arabic)

---

## File Structure

Deploy all four files in the **same directory**. No build step required.

```
mz-cinema/
\u251c\u2500\u2500 index.html        \u2190 Full app (HTML + CSS + JS, ~1900 lines)
\u251c\u2500\u2500 manifest.json     \u2190 PWA manifest (icon, theme, display mode)
\u251c\u2500\u2500 sw.js             \u2190 Service Worker (caching strategy)
\u2514\u2500\u2500 icon.png          \u2190 App icon 512\u00d7512 PNG (maskable)
```

> \u26a0\ufe0f All four files must sit at the same level. The manifest, service worker, and icon use relative paths (`./`). Moving any file will break PWA install.

---

## Deployment

Mz Cinema requires **HTTPS** to activate the Service Worker and show the PWA install prompt.

### Option A \u2014 GitHub Pages (Recommended)

1. Create a new repository at `github.com/new` (set to Public)
2. Upload all 4 files to the repository root
3. Go to **Settings \u2192 Pages \u2192 Source**, select branch `main`, folder `/ (root)`, click Save
4. Your app is live at `https://yourusername.github.io/mz-cinema/`

### Option B \u2014 Netlify Drop

1. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your folder containing all 4 files onto the drop zone
3. Instant deployment with HTTPS \u2014 no account needed for a temp URL

### Option C \u2014 Vercel

```bash
npm i -g vercel
cd mz-cinema/
vercel --prod
```

### Local Testing

Service Workers require HTTPS or `localhost`. Use either:

```bash
# Option 1 \u2014 npx serve
npx serve .

# Option 2 \u2014 Python
python -m http.server 8080
```

Then open `http://localhost:8080` in Chrome.

---

## PWA Installation

### Android (Chrome)

1. Open the deployed URL in **Chrome**
2. Tap the **"Add to Home Screen"** banner, or go to browser menu \u2192 **Install App**
3. The app launches in standalone mode with your custom icon

### iOS (Safari)

1. Open the deployed URL in **Safari** (Chrome on iOS cannot install PWAs)
2. Tap the **Share icon** (\u25a1\u2191) at the bottom of the screen
3. Scroll down and tap **"Add to Home Screen"**

### Verify Service Worker

Open Chrome DevTools \u2192 **Application** \u2192 **Service Workers**
You should see `sw.js` listed as **active and running**.

> \u2139\ufe0f The "SW registration failed (404)" error only appears inside Claude's preview sandbox (`claudeusercontent.com`). It will work correctly on any real deployed host.

---

## Bug Fixes Applied

Five issues were identified and resolved from the original build:

| # | Issue | Root Cause | Fix |
|---|---|---|---|
| 1 | **Sound not working** | `<iframe>` missing `allow="autoplay"` | Added `allow="autoplay; fullscreen; picture-in-picture; encrypted-media"` |
| 2 | **App not installable** | Service Worker never registered in JS | Added `navigator.serviceWorker.register('./sw.js')` before `</body>` |
| 3 | **Manifest not loading** | Inline `blob:` URL blocked by browsers | Replaced with `<link rel="manifest" href="manifest.json">` |
| 4 | **PWA icon invalid** | Remote JPEG used \u2014 browsers require local PNG \u2265 192px | Switched to `icon.png` with `"purpose": "any maskable"` |
| 5 | **Sandbox error on embeds** | `sandbox` attribute on iframe blocked embed player navigation | Removed `sandbox` attribute entirely \u2014 only `allow` is needed |

---

## Stream Sources

The player tries each source sequentially, waiting **9 seconds** per source before advancing. If all 11 fail, a manual source picker appears.

```
Priority  Source
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  1st     VidSrc \u2605
  2nd     VidLink \u2605  (Arabic subtitles)
  3rd     VidSrc.to
  4th     EmbedSu \u2605
  5th     AutoEmbed \u2605
  6th     MoviesAPI
  7th     2Embed
  8th     SmashyStream
  9th     VidBinge
  10th    MultiEmbed
  11th    NontonGo
```

### Adding a Custom Source

Edit the `SRVS` array in `index.html`:

```javascript
const SRVS = [
  {
    n:  'MySource',                              // Display name
    m:  'https://mysite.com/movie/{id}',         // Movie URL template
    tv: 'https://mysite.com/tv/{id}/{s}/{e}'     // TV URL template
  },
  // ...existing sources
];
```

**Placeholders:** `{id}` = TMDB ID \u00b7 `{s}` = season number \u00b7 `{e}` = episode number

---

## API & Configuration

### TMDB API Key

Get a free key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) and replace the constant at the top of the `<script>` block:

```javascript
const AK = 'your_api_key_here';   // Line ~1213 in index.html
```

### Key Constants

```javascript
const AK   = '...';                               // TMDB API key
const IMG  = 'https://image.tmdb.org/t/p/w500';  // Poster images (500px wide)
const ORIG = 'https://image.tmdb.org/t/p/original'; // Backdrop images (full res)
```

### LocalStorage Keys

| Key | Content
