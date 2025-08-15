import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getAnalytics, isSupported as analyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";

async function loadConfigStrict() {
  const res = await fetch('/firebase-config.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('[firebase-init] firebase-config.json mangler – tjek Netlify env og build.');
  return await res.json();
}

export let app = null;
export let db = null;
export let auth = null;
export let analytics = null;
export let isOffline = false;

try {
  const cfg = await loadConfigStrict();
  app = initializeApp(cfg);
  db = getFirestore(app);
  auth = getAuth(app);

  // Analytics kun hvis browseren understøtter det og measurementId er sat
  if (cfg.measurementId && (await analyticsSupported().catch(() => false))) {
    analytics = getAnalytics(app);
  }
  console.info('[firebase-init] Firebase config loaded (env-only).');
} catch (err) {
  console.error('[firebase-init] Missing firebase config; running offline.', err?.message || err);
  app = null; db = null; auth = null; analytics = null; isOffline = true;
}
