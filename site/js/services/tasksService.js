import { state } from '../firebase-init.js';
import { collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc, orderBy, query, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
const path = () => ['users', state.user.uid, 'tasks'];
export function watchTasks(cb){
  if (!state.online || !state.user) return ()=>{};
  const qy = query(collection(state.db, ...path()), orderBy('createdAt','desc'));
  return onSnapshot(qy, (snap)=> cb(snap.docs.map(d=>({ id:d.id, ...d.data() }))));
}
export async function createTask(data){ try { if (!state.online || !state.user) throw new Error('offline'); data.createdAt = serverTimestamp(); return addDoc(collection(state.db, ...path()), data); } catch(e){ console.error("Fejl ved oprettelse af opgave:", e); alert("Kunne ikke oprette opgaven."); } }
export async function updateTask(id, data){ try { return updateDoc(doc(state.db, ...path(), id), data); } catch(e) { console.error("Fejl ved opdatering af opgave:", e); alert("Kunne ikke opdatere opgaven."); } }
export async function removeTask(id){ try { return deleteDoc(doc(state.db, ...path(), id)); } catch(e){ console.error("Fejl ved sletning af opgave:", e); alert("Kunne ikke slette opgaven."); } }