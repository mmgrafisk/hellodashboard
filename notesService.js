import { db } from './firebase-init.js';
import { getUser, waitForUser } from './firebase-auth.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

function userNotesCol(uid){ return collection(db, 'users', uid, 'notes'); }

export async function createNote({ title, body }){
  const user = getUser() ?? await waitForUser(3000);
  if (!user || !user.uid){
    alert('Du skal være logget ind for at oprette noter.');
    return;
  }
  await addDoc(userNotesCol(user.uid), { title, body, createdAt: serverTimestamp() });
}
