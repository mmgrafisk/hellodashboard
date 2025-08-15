
# HelloDashboard – Hotfix (med Firebase-nøgler)

- Robust håndtering af opgaver (ingen `.replace` på `undefined`)
- Ingen Tailwind CDN (lokal CSS)
- Lokalt favicon for at undgå eksterne fejlkald
- Firebase-nøgler indsat i `site/js/firebase-config.js` + meta-backup i `index.html`
- Netlify klar med `scripts/fetch_gjs.sh` og `netlify.toml`

Deploy på Netlify:
- Build command: `bash ./scripts/fetch_gjs.sh`
- Publish directory: `site`
- Node: 18
