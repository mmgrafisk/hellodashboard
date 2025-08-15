
import { state } from '../firebase-init.js';
import { collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc, orderBy, query, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
const path = () => ['users', state.user.uid, 'links'];
export function watchLinks(cb){
  if (!state.online || !state.user) return ()=>{};
  const qy = query(collection(state.db, ...path()), orderBy('createdAt','desc'));
  return onSnapshot(qy, (snap)=> cb(snap.docs.map(d=>({ id:d.id, ...d.data() }))));
}
export async function createLink(data){ data.createdAt = serverTimestamp(); return addDoc(collection(state.db, ...path()), data); }
export async function updateLink(id, data){ return updateDoc(doc(state.db, ...path(), id), data); }
export async function removeLink(id){ return deleteDoc(doc(state.db, ...path(), id)); }
