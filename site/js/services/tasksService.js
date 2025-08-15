
import { state } from '../firebase-init.js';
import { collection, addDoc, doc, setDoc, onSnapshot, updateDoc, deleteDoc, orderBy, query, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
const path = () => ['users', state.user.uid, 'tasks'];
export function watchTasks(cb){
  if (!state.online || !state.user) return ()=>{};
  const qy = query(collection(state.db, ...path()), orderBy('createdAt','desc'));
  return onSnapshot(qy, (snap)=> cb(snap.docs.map(d=>({ id:d.id, ...d.data() }))));
}
export async function createTask(data){ if (!state.online || !state.user) throw new Error('offline'); data.createdAt = serverTimestamp(); return addDoc(collection(state.db, ...path()), data); }
export async function updateTask(id, data){ return updateDoc(doc(state.db, ...path(), id), data); }
export async function removeTask(id){ return deleteDoc(doc(state.db, ...path(), id)); }
