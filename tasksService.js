import { db, isOffline } from './firebase-init.js';
import {
  collection, addDoc, serverTimestamp, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const state = { tasks: [] };

function render(listEl) {
  listEl.innerHTML = '';
  state.tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'py-3 flex items-center justify-between';
    li.innerHTML = `<span>${t.title}</span><span class="text-xs text-slate-500">${t.status ?? ''}</span>`;
    listEl.appendChild(li);
  });
  document.getElementById('activeCount').textContent = state.tasks.length.toString();
}

async function addTaskOnline(title) {
  const col = collection(db, 'tasks');
  await addDoc(col, { title, status: 'ny', createdAt: serverTimestamp() });
}

function addTaskOffline(title) {
  state.tasks.unshift({ title, status: 'lokal' });
}

export function setupTasksUI() {
  const input = document.getElementById('taskInput');
  const btn = document.getElementById('addTask');
  const list = document.getElementById('taskList');

  btn.addEventListener('click', async () => {
    const title = (input.value || '').trim();
    if (!title) return;
    if (isOffline || !db) {
      alert('Ingen forbindelse til Firestore endnu. Opgaven gemmes lokalt.');
      addTaskOffline(title);
      render(list);
    } else {
      try {
        await addTaskOnline(title);
        input.value = '';
      } catch (e) {
        console.error(e);
        alert('Kunne ikke gemme i Firestore. Vi gemmer lokalt i mellemtiden.');
        addTaskOffline(title);
        render(list);
      }
    }
  });

  // Live Firestore lytning (hvis online)
  if (!isOffline && db) {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snap) => {
      state.tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      render(list);
    }, (err) => {
      console.error('onSnapshot error', err);
    });
  } else {
    // offline init
    render(list);
  }
}
