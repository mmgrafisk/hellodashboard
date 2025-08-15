
# HelloDashboard – Full (Firestore-ready)

Denne pakke indeholder:
- `site/index.html` – dashboard med Opgaver, Husk, Rapporter, Integrationer og Links
- `site/js/` – app logik (hash-routing) + Firebase init
- `site/js/services/` – Firestore services (tasks, notes, links, categories)
- `site/css/styles.css` – simple styles (ingen Tailwind CDN-advarsel)
- `site/admin/` – GrapesJS editor (downloades under Netlify build)
- `netlify.toml` + `scripts/fetch_gjs.sh` – Netlify build

## Firebase opsætning (krævet for database)
1) Opret filen `site/js/firebase-config.js` med dit indhold:
```js
window._FIREBASE_CONFIG = {
  apiKey: "…",
  authDomain: "…",
  projectId: "…",
  storageBucket: "…",
  messagingSenderId: "…",
  appId: "…"
};
```
2) Alternativt: Sæt samme nøgler som Netlify miljø-variabler og injicer dem via `site/index.html` (se kommentar i head).

## Kørsel
- Deploy til Netlify. Editor findes på `/admin/`.
- Før nøglerne er på plads, viser app'en en gul banner og kører i "offline mode".
