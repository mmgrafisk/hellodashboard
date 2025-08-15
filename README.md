
# HelloDashboard – Upload-klar (env-only Firebase)

**Ingen secrets i HTML eller JS.** Netlify skriver `firebase-config.json` fra environment – klienten loader kun den fil.

## 1) Netlify indstillinger
- **Environment variable (én linje JSON):** `VITE_FIREBASE_CONFIG`
- **Value:** `{"apiKey":"AIzaSyA_LQ2KpSII31mR9mbeUMBzpx9JYy35T2g","authDomain":"mit-kontrolcenter.firebaseapp.com","projectId":"mit-kontrolcenter","storageBucket":"mit-kontrolcenter.firebasestorage.app","messagingSenderId":"981412245600","appId":"1:981412245600:web:5fbde74608b29fd59bd305","measurementId":"G-S0Q385R4PV"}`
- **Build command:** `bash ./scripts/fetch_gjs.sh && npm run build`
- **Publish:** `.`

> Bemærk: `apiKey` i Firebase er en *client key* og må gerne være public. Vi bruger env for stram proceskontrol og for at undgå hardcode i repoet.

## 2) Filer i denne pakke
- `netlify.toml` – sætter build/publish.
- `scripts/fetch_gjs.sh` – skriver `./firebase-config.json` ved build (env-only).
- `firebase-init.js` – loader config via `fetch('/firebase-config.json')` + Firestore/Auth/Analytics.
- `firebase-auth.js` – login/logud (Google) som module-API.
- `tasksService.js` – opgaver m. offline fallback og realtime lytning.
- `notesService.js` – noter i `users/{uid}/notes` (kræver login).
- `index.html` – pænt UI og **module-wiring** (ingen inline `onclick`, ingen config i HTML).

## 3) Deploy
1. Upload filerne til dit repo (root).
2. Sæt `VITE_FIREBASE_CONFIG` i Netlify som vist ovenfor (én linje).
3. Trigger nyt deploy.

## 4) Fejlsøgning
- **`[firebase-init] Missing firebase config; running offline.`**  
  → Netlify skrev ikke `firebase-config.json`. Tjek env-navn, én-linje JSON, og at build kører `fetch_gjs.sh`.
- **`firebaseLogin is not defined`**  
  → Brug module-import (se `index.html`). Fjern evt. oldschool `onclick` i HTML.
- **`Cannot read properties of null (reading 'uid')`**  
  → Log ind først (knappen “Log ind”).

## 5) Lokalt (hurtig test uden Netlify) – **commit ikke filen**
```bash
echo '{"apiKey":"AIzaSyA_LQ2KpSII31mR9mbeUMBzpx9JYy35T2g","authDomain":"mit-kontrolcenter.firebaseapp.com","projectId":"mit-kontrolcenter","storageBucket":"mit-kontrolcenter.firebasestorage.app","messagingSenderId":"981412245600","appId":"1:981412245600:web:5fbde74608b29fd59bd305","measurementId":"G-S0Q385R4PV"}' > firebase-config.json
python3 -m http.server 5173
# Åbn http://localhost:5173
```
