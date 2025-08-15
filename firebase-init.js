import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

async function loadConfig() {
  // 1) prøv config-fil skrevet af Netlify-build
  try {
    const res = await fetch('/firebase-config.json', { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('[firebase-init] fetch /firebase-config.json fejlede:', e);
  }

  // 2) fallback: Vite env eller global var
  const raw = (import.meta?.env?.VITE_FIREBASE_CONFIG) ?? (window.__FIREBASE_CONFIG__);
  if (!raw) throw new Error('[firebase-init] Missing firebase config; running offline.');
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export let app = null;
export let db = null;
export let isOffline = true;

try {
  const cfg = await loadConfig();
  app = initializeApp(cfg);
  db = getFirestore(app);
  isOffline = false;
  console.info('[firebase-init] Firebase config loaded');
} catch (err) {
  console.error(err.message);
  app = null;
  db = null;
  isOffline = true;
}
