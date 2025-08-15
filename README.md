# HelloDashboard – Clean Netlify Pack

- `site/index.html` ← din platform (kopieret fra mit_kontrolcenter_p.html)
- `site/admin/index.html` ← GrapesJS editor, der loader forsiden
- `scripts/fetch_gjs.sh` ← henter GrapesJS lokalt under Netlify build
- `netlify.toml` ← publish = site, command = bash ./scripts/fetch_gjs.sh

## Netlify settings
- Base directory: (tom)
- Build command: bash ./scripts/fetch_gjs.sh
- Publish directory: site
- Functions directory: (tom)

## Admin
Åbn /admin/ for at redigere forsiden. Download derefter HTML+CSS fra editoren og commit som ny site/index.html.
