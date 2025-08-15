import { auth } from './firebase-init.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const provider = new GoogleAuthProvider();
let currentUser = null;

onAuthStateChanged(auth, (u) => {
  currentUser = u || null;
  window.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: currentUser } }));
});

export function getUser(){ return currentUser; }
export async function waitForUser(timeoutMs=5000){
  if (currentUser !== null) return currentUser;
  return await new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), timeoutMs);
    const handler = (e) => { clearTimeout(t); window.removeEventListener('auth:changed', handler); resolve(e.detail.user); };
    window.addEventListener('auth:changed', handler);
  });
}

export async function firebaseLogin(){
  try {
    const res = await signInWithPopup(auth, provider);
    console.info('[auth] signed in as', res.user?.email);
    return res.user;
  } catch (e) {
    console.error('[auth] sign-in error', e);
    alert('Kunne ikke logge ind: ' + (e?.message || e));
    return null;
  }
}

export async function firebaseLogout(){
  try { await signOut(auth); } catch (e) { console.error(e); }
}
