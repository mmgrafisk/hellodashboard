// Run with: node seed.js
// Requires: npm install firebase-admin

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Load service account key JSON
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  const tasksCol = db.collection('tasks');
  const sampleTasks = [
    { title: 'Tjek Netlify deploy log', status: 'ny' },
    { title: 'Opdatér Firebase config', status: 'ny' },
    { title: 'Test offline tilstand', status: 'in-progress' }
  ];

  for (const t of sampleTasks) {
    await tasksCol.add({ ...t, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  }

  console.log('Sample tasks added.');
}

seed().catch(console.error);
