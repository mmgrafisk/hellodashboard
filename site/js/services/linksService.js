import { state } from '../firebase-init.js';
import { collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc, orderBy, query, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
const path = () => ['users', state.user.uid, 'links'];
export function watchLinks(cb){
  if (!state.online || !state.user) return ()=>{};
  const qy = query(collection(state.db, ...path()), orderBy('createdAt','desc'));
  return onSnapshot(qy, (snap)=> cb(snap.docs.map(d=>({ id:d.id, ...d.data() }))));
}
export async function createLink(data){ try { data.createdAt = serverTimestamp(); return addDoc(collection(state.db, ...path()), data); } catch(e) { console.error("Fejl ved oprettelse af link:", e); alert("Kunne ikke oprette link."); } }
export async function updateLink(id, data){ try { return updateDoc(doc(state.db, ...path(), id), data); } catch(e) { console.error("Fejl ved opdatering af link:", e); alert("Kunne ikke opdatere linket."); } }
export async function removeLink(id){ try { return deleteDoc(doc(state.db, ...path(), id)); } catch(e) { console.error("Fejl ved sletning af link:", e); alert("Kunne ikke slette linket."); } }