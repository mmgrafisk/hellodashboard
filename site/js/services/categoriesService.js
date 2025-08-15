import { state } from '../firebase-init.js';
import { collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc, orderBy, query, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
const path = () => ['users', state.user.uid, 'categories'];
export function watchCategories(cb){
  if (!state.online || !state.user) return ()=>{};
  const qy = query(collection(state.db, ...path()), orderBy('name'));
  return onSnapshot(qy, (snap)=> cb(snap.docs.map(d=>({ id:d.id, ...d.data() }))));
}
export async function createCategory(name){ try { return addDoc(collection(state.db, ...path()), { name, createdAt: serverTimestamp() }); } catch(e) { console.error("Fejl ved oprettelse af kategori:", e); alert("Kunne ikke oprette kategori."); } }
export async function renameCategory(id, name){ try { return updateDoc(doc(state.db, ...path(), id), { name }); } catch(e) { console.error("Fejl ved omdøbning af kategori:", e); alert("Kunne ikke omdøbe kategorien."); } }
export async function removeCategory(id){ try { return deleteDoc(doc(state.db, ...path(), id)); } catch(e) { console.error("Fejl ved sletning af kategori:", e); alert("Kunne ikke slette kategorien."); } }