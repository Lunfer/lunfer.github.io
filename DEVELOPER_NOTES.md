# DEVELOPER_NOTES.md

Everything you need to know about running, editing, and deploying this site — for your own reference.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Locally](#running-locally)
- [Editing Content](#editing-content)
- [Syncing from LinkedIn](#syncing-from-linkedin)
- [Building & Deploying to GitHub Pages](#building--deploying-to-github-pages)
- [Common Issues](#common-issues)

---

## Tech Stack

- **[Next.js 12](https://nextjs.org/)** — React framework, used in static export mode
- **[React 17](https://reactjs.org/)** — UI library
- **[Material UI 5](https://mui.com/)** — Icon component (bounce arrow in hero)
- **[AOS](https://michalsnik.github.io/aos/)** — Scroll-triggered animations
- **[@fontsource/dosis](https://fontsource.org/fonts/dosis)** — Self-hosted Dosis font
- **GitHub Pages** — Free static hosting via the `out/` folder

---

## Project Structure

```
lunfer/
├── components/
│   ├── aboutMeBox.js       # About Me section
│   ├── boxGridder.js       # Layout wrapper for all content sections
│   ├── contactBox.js       # Contact / social links section
│   ├── customFooter.js     # Footer
│   ├── educationBox.js     # Education section  ← auto-updated by sync script
│   ├── expBox.js           # Experience section ← auto-updated by sync script
│   ├── inspoQuote.js       # Random inspirational quote (used in hero)
│   ├── questionsBox.js     # "Interviewing myself" Q&A section
│   ├── skillsetBox.js      # Skills section     ← auto-updated by sync script
│   └── topBar.js           # Sticky nav + full-height hero
├── pages/
│   ├── _app.js             # Global app wrapper (AOS init, MUI theme)
│   └── index.js            # Single page entry point
├── scripts/
│   └── sync-from-linkedin.js  # LinkedIn data export parser
├── src/
│   └── theme.js            # MUI theme (colours, fonts, border radius)
├── styles/
│   ├── globals.css         # Global styles — layout, glass-card, sticky-nav, animations
│   └── Home.module.css     # Legacy module (not actively used, kept for safety)
├── public/                 # Static assets served at root
│   └── images/
│       └── pexels.jpg      # Background photo used in hero + content sections
├── out/                    # Built static site — this folder is what goes to GitHub Pages
├── next.config.js          # Next.js config (static export + Akamai image loader)
├── README.md               # Public-facing repo description
└── DEVELOPER_NOTES.md      # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 16 or higher
- **npm** 8 or higher

### Install dependencies

```bash
npm install
```

> This installs everything including `adm-zip`, which is needed by the LinkedIn sync script.

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Changes to any file in `components/` or `styles/` hot-reload automatically.

---

## Editing Content

Each section of the page is its own component file. Content is stored as plain JavaScript data at the top of each file — no CMS, no database.

### Quick reference

| Section | File | What to edit |
|---|---|---|
| About Me | `components/aboutMeBox.js` | The `<p>` text blocks directly |
| Education | `components/educationBox.js` | `timeline-entry` divs, or run the sync script |
| Experience | `components/expBox.js` | `timeline-entry` divs, or run the sync script |
| Skills | `components/skillsetBox.js` | The `SKILL_GROUPS` array at the top |
| Contact links | `components/contactBox.js` | The `LINKS` array at the top |
| Q&A | `components/questionsBox.js` | The `QA` array at the top |
| Quotes (hero) | `components/inspoQuote.js` | The `quotes` array |
| Nav links | `components/topBar.js` | The `NAV_LINKS` array at the top |
| Colours / fonts | `src/theme.js` | The MUI theme object |
| Layout & shared styles | `styles/globals.css` | CSS classes like `glass-card`, `sticky-nav`, `timeline-entry` |

---

## Syncing from LinkedIn

The script `scripts/sync-from-linkedin.js` reads a LinkedIn data export ZIP and automatically rewrites three component files with your latest career data.

### What gets updated automatically

- `components/expBox.js` — built from `Positions.csv` (roles, companies, dates, descriptions)
- `components/educationBox.js` — built from `Education.csv` (degrees, schools, dates, notes)
- `components/skillsetBox.js` — built from `Skills.csv` (auto-bucketed into categories)

### Step 1 — Export your data from LinkedIn

- Go to [linkedin.com/mypreferences/d/download-my-data](https://www.linkedin.com/mypreferences/d/download-my-data)
- Select **"The works"** (or at minimum: Profile, Skills)
- Click **"Request archive"**
- Wait for the email from LinkedIn (usually a few minutes for the fast export)
- Download the ZIP — it will be named something like `Basic_LinkedInDataExport_05-18-2026.zip`

### Step 2 — Run the sync script

```bash
npm run sync-linkedin /path/to/Basic_LinkedInDataExport_XX-XX-XXXX.zip
```

Example:

```bash
npm run sync-linkedin ~/Downloads/Basic_LinkedInDataExport_05-18-2026.zip
```

You should see:

```
📦 Reading ZIP: .../Basic_LinkedInDataExport_05-18-2026.zip
  ✅ Written: components/expBox.js
  ✅ Written: components/educationBox.js
  ✅ Written: components/skillsetBox.js

🎉 Done! Now run:
   npm run build && npm run export
```

### Step 3 — Review the output (recommended)

Open the three updated files and sanity-check the content:
- Dates formatted correctly?
- Descriptions reading well?
- Skills in the right categories?

The skill bucketing is automatic but imperfect — you may want to move a chip or two manually.

### Step 4 — Build and deploy (see section below)

### How skill category matching works

Skills are sorted into groups by keyword matching against these patterns:

| Group | Matched keywords (case-insensitive) |
|---|---|
| Data Science & ML | python, machine learning, data, ml, ai, nlp, scikit, pandas, numpy, tensorflow, keras, r, jupyter, statistics |
| Backend & APIs | node, fastapi, api, rest, graphql, c#, .net, express, sql, database, mongo, postgres, back-end |
| Frontend | react, next, html, css, javascript, typescript, js, front-end, vue, angular, ui |
| Languages | english, greek, spanish, french, italian, croatian, german, language |
| Other | anything that doesn't match the above |

To adjust the rules, edit the `matchers` object in `scripts/sync-from-linkedin.js`.

---

## Building & Deploying to GitHub Pages

### Step 1 — Build

```bash
npm run build
```

Compiles and optimises everything into Next.js's build cache.

### Step 2 — Export to static HTML

```bash
npm run export
```

Generates the `out/` folder — a fully self-contained static site that needs no server.

### Step 3 — Push `out/` to GitHub Pages

The `out/` folder is served at `https://lunfer.github.io/`. Push its contents to the branch your Pages is configured to serve from:

```bash
# Switch to gh-pages branch, copy files, commit and push
git checkout gh-pages
cp -r out/* .
git add .
git commit -m "deploy: update site"
git push
git checkout main
```

> The `out/.nojekyll` file is already present — it tells GitHub Pages not to run Jekyll, which is required for Next.js static exports to work.

### Full update workflow (everything at once)

```bash
# Optional: sync from LinkedIn first
npm run sync-linkedin ~/Downloads/Basic_LinkedInDataExport_XX-XX-XXXX.zip

# Build and export
npm run build && npm run export

# Deploy
git checkout gh-pages && cp -r out/* . && git add . && git commit -m "deploy" && git push && git checkout main
```

---

## Common Issues

**`Cannot find module 'adm-zip'`**
Run `npm install` — the dev dependency isn't installed yet.

**Images not loading on GitHub Pages**
Check that `next.config.js` still has `loader: "akamai"` and `path: "/"`. Next.js's default image optimisation doesn't work on static hosts and must be replaced with a passthrough loader.

**Skills CSV not parsing**
LinkedIn occasionally renames column headers. Open the ZIP, check the first row of `Skills.csv`. If the column is named something other than `"Name"`, update the fallback in the `syncSkills()` function inside `scripts/sync-from-linkedin.js`:
```js
const allSkills = rows.map((r) => (r["Name"] || r["YOUR_COLUMN_NAME"] || ...).trim())
```

**AOS animations not triggering**
AOS is initialised in `pages/_app.js` inside a `useEffect`. If animations break after a dependency update, confirm that `AOS.init()` is still being called there.

**`next export` command removed in Next.js 13+**
This project uses Next.js 12, which still supports `next export`. Don't upgrade to Next 13+ without updating the export config — in 13+ you use `output: 'export'` in `next.config.js` instead.
