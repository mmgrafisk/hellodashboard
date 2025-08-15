
# Patch: Robust fetch of firebase-config.json

Denne patch sikrer, at `firebase-config.json` ALTID skrives:
- til projektroden,
- til Netlify's publish dir hvis eksponeret (PUBLISH_DIR/NETLIFY_PUBLISH_DIR),
- og til `public/`, `dist/`, `build/` hvis de findes.

## Brug
1) Erstat din `scripts/fetch_gjs.sh` med den i denne ZIP (gør den exekverbar).
2) Erstat/merge `package.json` scripts så `prebuild` kører fetch automatisk.
3) (Valgfrit) Læg `netlify.toml` i roden for at tvinge rækkefølgen.
4) Trigger et nyt deploy.

## Tjek
- I build-loggen skal du se linjer ala: `Wrote /.../firebase-config.json`
- På sitet: Besøg `/firebase-config.json` – må ikke være 404.
