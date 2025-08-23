# Firebase Firestore seeding (CommonJS)

## Struktur
```
firebase-seed-cjs/
  seed.js
  seeds/
    seed.data.json
  package.json
  .gitignore
  serviceAccount.json  # Læg din rigtige nøgle her (commit IKKE)
```

## Brug
1. Læg din service account fil som `serviceAccount.json` i roden **eller** sæt miljøvariabel:
   - Windows PowerShell:
     ```powershell
     $env:GOOGLE_APPLICATION_CREDENTIALS = "$PWD\serviceAccount.json"
     ```
   - macOS/Linux bash:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="$PWD/serviceAccount.json"
     ```

2. Installer:
   ```bash
   npm install
   ```

3. Seed:
   ```bash
   npm run seed
   ```

4. Deploy Firestore regler (hvis relevant):
   ```bash
   npx firebase login
   npx firebase init firestore   # peg på dine rules
   npm run deploy:rules
   ```
