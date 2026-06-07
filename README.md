# Mesmerizers — Global Services LLP

Marketing website for Mesmerizers — Global Services LLP (consulting since 2009, Vadodara, India).
Custom, animation-rich static site. No build step. Deploys to GitHub Pages.

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — hero, about, services, process, stats, CTA |
| `business-strategies.html` | Business Strategies & Tools |
| `digital-engagement.html` | Digital Engagement Strategies |
| `marketing-tools.html` | Marketing Tools & Strategic Delivery |
| `study-abroad.html` | 360° Study Abroad Services |
| `contact.html` | Contact — form, info cards, Google Map |

## Stack
- Hand-written HTML, one shared `assets/css/styles.css`, one `assets/js/main.js`
- Fonts: Poppins + Open Sans (Google Fonts)
- AI-generated imagery in `assets/img/`
- Animations: scroll-reveal (IntersectionObserver), animated counters, hero parallax, magnetic buttons, marquee, scroll progress bar — all respect `prefers-reduced-motion`

## Run locally
```bash
python -m http.server 8123
# open http://localhost:8123
```

## Deploy — GitHub Pages
1. Create a GitHub repo and push these files to the default branch.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → branch `main` / root.
3. `.nojekyll` is included so asset folders are served as-is.
4. `CNAME` is set to `mesmerizers.org`. To use that domain, in your DNS:
   - `A` records for apex `mesmerizers.org` → GitHub Pages IPs
     `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153`
   - or `CNAME` for `www` → `<username>.github.io`
   - In repo Settings → Pages → Custom domain → `mesmerizers.org`, enable **Enforce HTTPS**.
5. Note: the site currently runs on Wix. Switching DNS to GitHub Pages will move the live domain — do this only when ready to cut over.

## Contact form
No backend. On submit it validates, shows a success note, and opens the visitor's mail
client pre-filled to `connect@mesmerizers.org`. To capture submissions server-side later,
wire the form to Formspree / Getform / a serverless function.

## Content source
All copy, contact details, services and destinations were rebuilt from the existing
mesmerizers.org site. Update text directly in the HTML; update tokens/colors in
`:root` of `assets/css/styles.css`.
