
import { state } from '../firebase-init.js';
import { collection, addDoc, doc, onSnapshot, updateDoc, deleteDoc, orderBy, query, serverTimestamp } 
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const path = () => ['users', state.user.uid, 'categories'];

export function watchCategories(cb){
  if (!state.online || !state.user) return () => {};
  const q = query(collection(state.db, ...path()), orderBy('name'));
  return onSnapshot(q, (snap)=> cb(snap.docs.map(d=>({id:d.id, ...d.data()}))));
}

export async function createCategory(name){
  return addDoc(collection(state.db, ...path()), { name, createdAt: serverTimestamp() });
}

export async function renameCategory(id, name){
  return updateDoc(doc(state.db, ...path(), id), { name });
}

export async function removeCategory(id){
  return deleteDoc(doc(state.db, ...path(), id));
}
