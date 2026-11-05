# Sarah Itafa — Portfolio

A responsive, accessible personal portfolio built with plain HTML, CSS, and JavaScript (no React, Vite, or npm required).

## Files
- `index.html` — all page sections and links
- `style.css` — layout, blue design, binary background, mobile breakpoints
- `script.js` — mobile navigation, copy-email button, footer year, background detail
- `assets/` — SI logo and optimized screenshots of the four portfolio projects

## Preview
Open `index.html` in a web browser, or use the VS Code Live Server extension.

## Publish to your existing GitHub Pages repo (recommended)

Your existing `sarah-portfolio` GitHub repo already has a `main` and a `gh-pages` branch from the older React version. To switch to this simpler plain-HTML portfolio:

1. Open the local folder linked to `https://github.com/sarahanwar-1/sarah-portfolio` in VS Code (the inner folder containing `.git` and `package.json`).
2. Copy **the contents** of this folder (`index.html`, `style.css`, `script.js`, `assets/`) into the root of that local repo, replacing the old `index.html`. Keep the `.git` directory.
3. In the VS Code terminal, run:

   git add .
   git commit -m "Redesign responsive portfolio"
   git push origin main

4. In GitHub > Repository > Settings > Pages, set **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**, then Save.
5. Open `https://sarahanwar-1.github.io/sarah-portfolio/` and hard-refresh (`Ctrl + Shift + R`) after Pages shows a successful deployment.

No `npm run deploy` is needed for the static HTML portfolio. Old React files can remain in the repository temporarily; they are not loaded by the new `index.html`. To tidy up later, remove the old `src/`, `public/`, `package.json`, `package-lock.json`, and `vite.config.js` after confirming this site works; these files are not needed for the new site.

## Customize
- Hero, service text, project descriptions, and FAQ: `index.html`
- Layout and colors: `style.css` under `:root`
- The linked booking and pricing pages, email, WhatsApp, LinkedIn, Instagram, and contact page are already included.
- Website project screenshots are in `assets/`.

The pricing and booking sites must remain published separately for their links to work.
