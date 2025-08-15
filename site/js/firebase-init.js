
// Firebase + Auth bootstrap (safe if config missing)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

export const state = { app:null, db:null, auth:null, user:null, online:false };

function readConfig() {
  if (window._FIREBASE_CONFIG && window._FIREBASE_CONFIG.apiKey) return window._FIREBASE_CONFIG;
  const meta = document.querySelector('meta[name="firebase-config"]');
  if (meta) { try { return JSON.parse(meta.content); } catch(e){} }
  return null;
}

export function initFirebase() {
  const cfg = readConfig();
  if (!cfg) {
    console.warn('[firebase-init] Missing firebase config; running offline.');
    state.online = false;
    renderBanner();
    return;
  }
  state.app = initializeApp(cfg);
  state.db = getFirestore(state.app);
  state.auth = getAuth(state.app);
  state.online = true;

  const provider = new GoogleAuthProvider();
  window.firebaseLogin  = () => signInWithPopup(state.auth, provider);
  window.firebaseLogout = () => signOut(state.auth);

  onAuthStateChanged(state.auth, (u) => {
    state.user = u || null;
    document.dispatchEvent(new CustomEvent('auth:changed', { detail: u }));
  });
}

function renderBanner() {
  const el = document.createElement('div');
  el.className = 'banner';
  el.innerHTML = 'Firebase mangler konfiguration. Tilføj <code>site/js/firebase-config.js</code> med dine nøgler, eller injicer via &lt;meta name="firebase-config" ...&gt;.';
  document.querySelector('#app')?.prepend(el);
}
