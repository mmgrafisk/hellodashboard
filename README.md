# HelloDashboard – Netlify + Firebase fix (ZIP klar)

Denne pakke retter fejlen **"Missing firebase config; running offline"** og giver et pænt, minimalistisk UI.

## Hurtig opskrift
1. **Netlify → Environment variable**
   - Name: `VITE_FIREBASE_CONFIG`
   - Value: En *énlinje* gyldig JSON, fx:
     `{"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}`

2. **Deploy-indstillinger**
   - Build command: `bash ./scripts/fetch_gjs.sh && npm run build`
   - Publish directory: `.` (root)

3. **Filer i denne ZIP**
   - `netlify.toml` – sætter publish til root og build-kommandoen.
   - `package.json` – dummy build-script så Netlify har noget at køre.
   - `scripts/fetch_gjs.sh` – skriver `firebase-config.json` ved build.
   - `index.html` – opdateret layout med Tailwind CDN.
   - `firebase-init.js` – loader config fra `firebase-config.json` eller fallback.
   - `tasksService.js` – simpel task-UI med offline fallback.

## Sådan uploader du
- Upload alle filer til din repo (root).
- På Netlify: Trigger et nyt deploy.
- Når build kører, genererer scriptet `./firebase-config.json` automatisk ud fra din env var.

## Kendte faldgruber
- **HTML-kommentarer i `<script type="module">` er ikke tilladt.** Brug `//` eller `/* ... */` i stedet.
- **JSON må ikke have linjeskift.** Den skal være på én linje i Netlify.
- Hvis du ikke ser tasks fra Firestore, er du sandsynligvis offline → UI viser og gemmer lokalt midlertidigt.

## Senere forbedringer
- Skift Tailwind til lokal build (PostCSS) for produktion.
- Tilføj autentifikation (Firebase Auth) og rollebaserede lister.


## Ekstra filer til udvikling
- `firebase.rules` – åbne Firestore-sikkerhedsregler (KUN til udvikling, luk ned i prod).
- `seed.js` – Node-script der tilføjer et par testopgaver i Firestore. 
  - Kræver en `serviceAccountKey.json` fra Firebase-projektet i rodmappen.
  - Kør med `node seed.js`.

---

## Firestore regler + seed

### Hurtig start (DEV → PROD)
1. **Dev-regler (åbne, KUN lokalt):** `firestore.rules.dev`
2. **Prod-regler (kræver login):** `firestore.rules`
3. Udrul regler i Firebase Console (Firestore → Rules) eller via CLI.

### Seed data (lokalt)
1. Opret en service account (Editor) i Firebase, download JSON.
2. Gem som `serviceAccount.json` i projektroden **eller** sæt env `SERVICE_ACCOUNT_JSON` med hele JSON’en.
3. `npm i`
4. `npm run seed`


**Bemærk:** Seed-scriptet kører lokalt (admin SDK). Det påvirker **ikke** Netlify-build.
