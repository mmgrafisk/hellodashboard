
import { state } from '../firebase-init.js';
import {
  collection, addDoc, doc, setDoc, getDocs, onSnapshot, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const path = () => ['users', state.user.uid, 'tasks'];

export function watchTasks(cb) {
  if (!state.online || !state.user) return () => {};
  const q = query(collection(state.db, ...path()), orderBy('createdAt','desc'));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    cb(items);
  });
}

export async function createTask(data) {
  if (!state.online || !state.user) throw new Error('offline');
  data.createdAt = serverTimestamp();
  return addDoc(collection(state.db, ...path()), data);
}

export async function updateTask(id, data) {
  if (!state.online || !state.user) throw new Error('offline');
  return updateDoc(doc(state.db, ...path(), id), data);
}

export async function removeTask(id) {
  if (!state.online || !state.user) throw new Error('offline');
  return deleteDoc(doc(state.db, ...path(), id));
}
