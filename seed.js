// seed.js (CommonJS) — reads ./seeds/seed.data.json
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Service account resolution: env var path or local ./serviceAccount.json
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve(__dirname, 'serviceAccount.json');
let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
} catch (err) {
  console.error('❌ Kunne ikke indlæse service account. Sæt GOOGLE_APPLICATION_CREDENTIALS til filens sti, eller læg serviceAccount.json i projektroden.');
  console.error('Fejl:', err.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function readSeed(filePath = path.resolve(__dirname, 'seeds', 'seed.data.json')) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

// Firestore batches er maks 500 writes — chunk hvis nødvendigt
async function upsertCollection(collectionName, docs) {
  const CHUNK = 450;
  for (let i = 0; i < docs.length; i += CHUNK) {
    const chunk = docs.slice(i, i + CHUNK);
    const batch = db.batch();
    chunk.forEach((doc) => {
      const { id, ...data } = doc;
      const ref = id
        ? db.collection(collectionName).doc(id)
        : db.collection(collectionName).doc(); // auto-id hvis intet id
      batch.set(ref, data, { merge: true });
    });
    await batch.commit();
    console.log(`✔ Seeded ${chunk.length} docs → ${collectionName} [${i + 1}..${i + chunk.length}]`);
  }
}

(async () => {
  try {
    const seed = readSeed();

    // Seed alle top-level arrays som hver sin collection
    for (const [collectionName, value] of Object.entries(seed)) {
      if (Array.isArray(value)) {
        await upsertCollection(collectionName, value);
      } else {
        console.warn(`⟂ Skipper '${collectionName}' (ikke en array)`);
      }
    }

    console.log('✅ Seeding færdig.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding fejlede:', err);
    process.exit(1);
  }
})();
