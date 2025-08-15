import { state } from '../firebase-init.js';
import { collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc, orderBy, query, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
const path = () => ['users', state.user.uid, 'notes'];
export function watchNotes(cb){
  if (!state.online || !state.user) return ()=>{};
  const qy = query(collection(state.db, ...path()), orderBy('createdAt','desc'));
  return onSnapshot(qy, (snap)=> cb(snap.docs.map(d=>({ id:d.id, ...d.data() }))));
}
export async function createNote(data){ try { data.createdAt = serverTimestamp(); return addDoc(collection(state.db, ...path()), data); } catch(e) { console.error("Fejl ved oprettelse af note:", e); alert("Kunne ikke oprette note."); } }
export async function toggleNote(id, checked){ try { return updateDoc(doc(state.db, ...path(), id), { checked }); } catch(e) { console.error("Fejl ved at skifte note:", e); alert("Kunne ikke opdatere noten."); } }
export async function removeNote(id){ try { return deleteDoc(doc(state.db, ...path(), id)); } catch(e) { console.error("Fejl ved sletning af note:", e); alert("Kunne ikke slette noten."); } }