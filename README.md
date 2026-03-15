# Jann Carl Dungo — Developer Portfolio (`jcdungoo20`)

A modern, animated backend developer portfolio built with **vanilla HTML, CSS, and JavaScript** using production-level architecture patterns. No build tools or frameworks required.

**BSIT Student · Holy Angel University · Web Development Major · Sapang Maisac, Mexico, Pampanga**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)

---

## 👤 About

**Name:** Jann Carl Dungo  
**Handle:** jcdungoo20  
**Email:** jcdungoo20@gmail.com  
**Phone:** 0915-246-8287  
**Location:** Sapang Maisac, Mexico, Pampanga  
**University:** Holy Angel University — BSIT, Major in Web Development (2022–Present)  
**Role:** Backend Developer (Aspiring)

---

## ✨ Features

- **Dark / Light mode** with `localStorage` persistence
- **SPA routing** — pages load dynamically without full page reloads
- **Scroll reveal animations** via `IntersectionObserver`
- **Animated particle network** (canvas)
- **Typewriter effect** in hero section
- **3D tilt cards** on blog page with IntersectionObserver scroll reveal
- **Certificate lightbox** — click any cert image to view full size
- **Blog article overlay** — full articles open in an in-page modal
- **Downloadable PDF resume** via `assets/resume.pdf`
- **Netlify-ready** — includes `_redirects` for SPA routing

---

## 📁 Project Structure

```
portfolio-refactored/
├── index.html                  # App shell — static navbar/footer placeholders
├── _redirects                  # Netlify SPA redirect rule
├── assets/
│   ├── icons/logo.png          # JD monogram logo
│   ├── images/profile.png      # Profile photo (B&W portrait)
│   ├── resume.pdf              # Downloadable resume PDF
│   └── certificates/           # 6 certificate images
│       ├── responsive-web-design.png
│       ├── intro-figma.png
│       ├── coursera-figma-components.png
│       ├── js-essentials-cisco.jpg
│       ├── intro-php.jpg
│       └── design-thinking.png
├── components/
│   ├── navbar.html             # Navigation bar component
│   └── footer.html             # Footer component
├── pages/
│   ├── home.html               # Hero, featured projects, quick about
│   ├── about.html              # Bio, skills, certifications, experience
│   ├── projects.html           # All 5 projects with filter
│   ├── blog.html               # 4 articles with full overlay reader
│   ├── resume.html             # GAM-inspired resume layout
│   └── contact.html            # Contact form + social links
├── css/
│   ├── main.css                # Global imports
│   ├── base/                   # Variables, reset, typography, animations
│   ├── layout/                 # Navbar, footer, grid, responsive
│   ├── components/             # Buttons, cards, forms, tags, effects
│   └── pages/                  # Per-page stylesheets
└── js/
    ├── main.js                 # App bootstrap entry point
    └── modules/
        ├── router.js           # SPA client-side router
        ├── loader.js           # Component HTML fetcher
        ├── theme.js            # Dark/light mode
        ├── navbar.js           # Scroll + hamburger
        ├── particles.js        # Canvas particle animation
        ├── typewriter.js       # Hero typewriter effect
        ├── scrollReveal.js     # IntersectionObserver reveal
        ├── skillBars.js        # Animated skill bars
        ├── filter.js           # Project filter
        └── form.js             # Contact form handler
```

---

## 🚀 Running Locally

> ⚠️ **Must use an HTTP server.** `fetch()` is blocked on `file://` URLs.

```bash
# Option 1 — Node.js (recommended)
npx serve .

# Option 2 — Python
python3 -m http.server 8080

# Option 3 — VS Code
# Install the "Live Server" extension and click "Go Live"
```

Then open: **http://localhost:3000** (or whichever port is shown)

---

## 🌐 Deploying to Netlify

### Method A — Drag & Drop (fastest)
1. Go to [netlify.com](https://netlify.com) → New site
2. Drag the `portfolio-refactored/` folder into the deploy zone
3. Done — live URL generated instantly

### Method B — GitHub (auto-deploy on push)
1. Push `portfolio-refactored/` to a GitHub repository
2. Connect to Netlify → "Import from Git"
3. No build command needed — leave blank
4. Publish directory: leave as root

The included `_redirects` file handles SPA routing automatically on Netlify.

---

## 📝 Known Issues (PDF Resume)

> The uploaded `resume.pdf` contains two minor errors that couldn't be fixed without regenerating the PDF:
> - **Email typo:** Listed as `jcdungoo20@gmai.com` — correct is `jcdungoo20@gmail.com`
> - **HAU Store dates:** Listed as "December **2025** – June 2025" — correct is "December **2024** – June 2025"
>
> All HTML pages (`about.html`, `resume.html`) display the correct information.

---

## 🛠 Technologies

| Layer      | Technology                              |
|------------|------------------------------------------|
| Structure  | HTML5 (semantic, ARIA accessible)        |
| Styling    | CSS3 (custom properties, Grid, Flexbox)  |
| Logic      | Vanilla JavaScript (ES6 modules)         |
| Fonts      | Syne (display), DM Sans (body), JetBrains Mono |
| Hosting    | Netlify (recommended)                    |
| Build      | None — zero dependencies                |

---

*© 2025 Jann Carl Dungo (jcdungoo20). Built with HTML, CSS & JavaScript.*
