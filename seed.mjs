import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import admin from 'firebase-admin';

/**
 * Usage:
 *  1) Create a service account in Firebase console (Editor role).
 *  2) Set env var SERVICE_ACCOUNT_JSON to the JSON string, or save to serviceAccount.json in project root.
 *  3) Set env var FIREBASE_PROJECT_ID (optional if present in the service account).
 *  4) Run: npm i && npm run seed
 */

function loadServiceAccount() {
  // Prefer env var
  const raw = process.env.SERVICE_ACCOUNT_JSON;
  if (raw) return JSON.parse(raw);

  // Fallback to file
  const p = path.join(process.cwd(), 'serviceAccount.json');
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));

  throw new Error('Missing service account. Set SERVICE_ACCOUNT_JSON or place serviceAccount.json in project root.');
}

const cred = loadServiceAccount();

admin.initializeApp({
  credential: admin.credential.cert(cred),
  projectId: process.env.FIREBASE_PROJECT_ID || cred.project_id,
});

const db = admin.firestore();

// Load seeds
const seedsPath = path.join(process.cwd(), 'seeds', 'seed.data.json');
const seeds = JSON.parse(fs.readFileSync(seedsPath, 'utf8'));

async function upsertCollection(colName, docs) {
  const batch = db.batch();
  const colRef = db.collection(colName);
  docs.forEach((doc) => {
    const ref = colRef.doc(); // auto-id
    batch.set(ref, { ...doc, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  });
  await batch.commit();
  console.log(`Seeded ${docs.length} docs into "${colName}"`);
}

(async () => {
  try {
    for (const [col, docs] of Object.entries(seeds)) {
      await upsertCollection(col, docs);
    }
    console.log('✅ Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
})();
