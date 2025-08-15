
import { initFirebase, state } from './firebase-init.js';
import * as Tasks from './services/tasksService.js';
import * as Notes from './services/notesService.js';
import * as Links from './services/linksService.js';
import * as Cats from './services/categoriesService.js';

initFirebase();

const q = (sel, root=document)=> root.querySelector(sel);
const qa = (sel, root=document)=> [...root.querySelectorAll(sel)];

window.addEventListener('hashchange', render);
document.addEventListener('auth:changed', render);

function greet(){
  const d = new Date();
  return d.toLocaleDateString('da-DK', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

function html(strings,...vals){return strings.map((s,i)=>s+(vals[i]??'')).join('')}

function render(){
  const route = location.hash.replace('#','') || 'dashboard';
  q('#nav a.active')?.classList.remove('active');
  q(`#nav a[data-route="${route}"]`)?.classList.add('active');
  const main = q('#main');
  main.innerHTML = '';
  if (route === 'dashboard') return viewDashboard(main);
  if (route === 'tasks') return viewTasks(main);
  if (route === 'reports') return viewReports(main);
  if (route === 'integrations') return viewIntegrations(main);
  if (route === 'links') return viewLinks(main);
}

function ensureAuthCTA(container){
  if (!state.user){
    const box = document.createElement('div');
    box.className = 'banner';
    box.innerHTML = 'Du er ikke logget ind. <button class="btn ghost" onclick="firebaseLogin()">Log ind med Google</button>';
    container.prepend(box);
  } else {
    const small = document.createElement('div');
    small.className='small';
    small.innerHTML = 'Logget ind som <b>'+state.user.displayName+'</b> – <a href="#" onclick="firebaseLogout()">Log ud</a>';
    container.prepend(small);
  }
}

function viewDashboard(main){
  main.innerHTML = html`
    <div class="topbar">
      <div>
        <h1 class="h1">Hej, Michael Møller</h1>
        <p class="sub">${greet()}</p>
      </div>
      <div class="kv"><button class="btn" onclick="location.hash='tasks'">Tilføj Opgave</button>
      <button class="btn ghost" onclick="firebaseLogin()">Spørg AI</button></div>
    </div>

    <div class="grid two">
      <div class="card pad">
        <div class="kv" style="justify-content:space-between">
          <h3>Opgaver</h3>
          <div class="tabs">
            <button class="active">I dag</button>
            <button>Uge</button>
            <button>Måned</button>
            <button>Alle</button>
          </div>
        </div>
        <div id="task-list" class="list"></div>
        <div class="empty" id="task-empty">Ingen opgaver matcher dine filtre.</div>
      </div>

      <div class="card pad">
        <h3>Husk</h3>
        <div id="notes-list" class="list"></div>
        <div class="kv" style="margin-top:8px;gap:8px">
          <input id="note-input" class="input" placeholder="Tilføj punkt">
          <button class="btn" id="note-add">Tilføj</button>
        </div>
      </div>
    </div>
  `;
  ensureAuthCTA(main);

  // Bind notes
  if (state.user){
    Notes.watchNotes(renderNotes);
    Tasks.watchTasks(renderTasks);
  }
  q('#note-add')?.addEventListener('click', async ()=>{
    const title = q('#note-input').value.trim();
    if (!title) return;
    await Notes.createNote({ title, checked:false });
    q('#note-input').value='';
  });
}

function renderNotes(items=[]){
  const list = q('#notes-list');
  list.innerHTML='';
  if (!items.length){ list.innerHTML='<div class="empty">Intet at huske.</div>'; return; }
  items.forEach(it=>{
    const row = document.createElement('div');
    row.className='check';
    row.innerHTML = html\`<input type="checkbox" \${it.checked?'checked':''}> <span>\${it.title}</span>\`;
    const cb = row.querySelector('input');
    cb.addEventListener('change', ()=> Notes.toggleNote(it.id, cb.checked));
    list.appendChild(row);
  });
}

function renderTasks(items=[]){
  const list = q('#task-list');
  const empty = q('#task-empty');
  list.innerHTML='';
  if (!items.length){ empty.style.display='block'; return; }
  empty.style.display='none';
  items.forEach(t=>{
    const row = document.createElement('div');
    row.className='card pad';
    row.innerHTML = html\`
      <div class="kv" style="justify-content:space-between">
        <div class="kv"><span class="dot \${t.status||'new'}"></span> <b>\${t.title||'Ny opgave'}</b></div>
        <div class="tags">
          <span class="badge prio-\${(t.priority||'low')}">Prioritet: \${t.priority||'lav'}</span>
          <span class="tag">\${t.category||'Uden kategori'}</span>
        </div>
      </div>
      <div class="small">\${t.description||''}</div>
    \`;
    list.appendChild(row);
  });
}

function viewTasks(main){
  main.innerHTML = html\`
    <div class="topbar">
      <div><h1 class="h1">Opgaver</h1><p class="sub">Administrer dine opgaver og kategorier.</p></div>
      <div class="kv"><button class="btn" id="add-task">Tilføj Opgave</button> 
      <button class="btn muted" id="btn-cats">Administrer Kategorier</button></div>
    </div>
    <div class="searchbar">
      <input class="input" placeholder="Søg opgave...">
      <select class="input"><option>Alle Prioriteter</option></select>
      <select class="input" id="cat-filter"><option value="">Alle Kategorier</option></select>
      <select class="input"><option>Alle Statusser</option></select>
    </div>
    <div id="task-list" class="list" style="margin-top:12px"></div>
    <div class="empty" id="task-empty">Ingen opgaver.</div>

    <div class="modal-backdrop" id="modal-task">
      <div class="modal">
        <div class="head">Rediger opgave <button onclick="hide('modal-task')">✕</button></div>
        <div class="body grid" style="grid-template-columns:1fr 1fr;gap:12px">
          <div><div class="small">Opgave</div><input id="t-title" class="input"></div>
          <div><div class="small">Prioritet</div><select id="t-prio" class="input">
            <option value="low">Lav</option><option value="med">Mellem</option><option value="high">Høj</option>
          </select></div>
          <div style="grid-column:1/3"><div class="small">Beskrivelse</div><textarea id="t-desc" class="input" rows="4"></textarea></div>
          <div><div class="small">Status</div><select id="t-status" class="input">
            <option value="new">NY</option><option value="run">IGANGVÆRENDE</option><option value="wait">VENTER</option><option value="done">UDFØRT</option>
          </select></div>
          <div><div class="small">Kategori</div><select id="t-cat" class="input"></select></div>
        </div>
        <div class="foot"><button class="btn muted" onclick="hide('modal-task')">Annuller</button>
        <button class="btn" id="task-save">Gem Opgave</button></div>
      </div>
    </div>

    <div class="modal-backdrop" id="modal-cats">
      <div class="modal">
        <div class="head">Administrer Kategorier <button onclick="hide('modal-cats')">✕</button></div>
        <div class="body" id="cat-list"></div>
        <div class="foot">
          <input id="cat-new" class="input" placeholder="Navn på ny kategori" style="flex:1">
          <button class="btn" id="cat-add">Tilføj</button>
        </div>
      </div>
    </div>
  \`;
  ensureAuthCTA(main);

  if (state.user){
    Tasks.watchTasks(renderTasks);
    Cats.watchCategories(renderCatUI);
  }

  q('#add-task').addEventListener('click', ()=>{
    show('modal-task');
    populateCats('#t-cat');
    q('#task-save').onclick = async ()=>{
      const data = {
        title: q('#t-title').value.trim(),
        description: q('#t-desc').value.trim(),
        priority: q('#t-prio').value,
        status: q('#t-status').value,
        category: q('#t-cat').value || null
      };
      await Tasks.createTask(data);
      hide('modal-task');
    };
  });
  q('#btn-cats').addEventListener('click', ()=>{ show('modal-cats'); });
  q('#cat-add').addEventListener('click', async ()=>{
    const name = q('#cat-new').value.trim();
    if (!name) return;
    await Cats.createCategory(name);
    q('#cat-new').value='';
  });
}

function renderCatUI(cats=[]){
  const list = q('#cat-list');
  const filter = q('#cat-filter');
  list.innerHTML='';
  filter.innerHTML='<option value="">Alle Kategorier</option>';
  cats.forEach(c=>{
    const row = document.createElement('div');
    row.className='kv'; row.style.justifyContent='space-between'; row.style.padding='6px 2px';
    row.innerHTML = '<div>'+c.name+'</div><div class="kv"><button class="btn muted" data-act="edit">Rediger</button> <button class="btn muted" data-act="del">Slet</button></div>';
    row.querySelector('[data-act="edit"]').onclick = async ()=>{
      const name = prompt('Nyt navn', c.name);
      if (name) Cats.renameCategory(c.id, name);
    };
    row.querySelector('[data-act="del"]').onclick = ()=> Cats.removeCategory(c.id);
    list.appendChild(row);
    const opt = document.createElement('option'); opt.value=c.name; opt.textContent=c.name; filter.appendChild(opt);
  });
}

function populateCats(sel){
  const target = q(sel);
  target.innerHTML='';
  qa('#cat-filter option').forEach(o=>{
    if (o.value==='') return;
    const el = document.createElement('option'); el.value=o.value; el.textContent=o.value;
    target.appendChild(el);
  });
}

function viewReports(main){
  main.innerHTML = '<h1 class="h1">Rapporter</h1><p class="sub">Her kan du senere se grafer og nøgletal.</p>';
  ensureAuthCTA(main);
}

function viewIntegrations(main){
  main.innerHTML = `
    <div class="topbar"><div><h1 class="h1">Integrationer</h1>
      <p class="sub">Forbind dine eksterne tjenester for at berige dine rapporter.</p></div></div>
    <div class="grid" style="grid-template-columns:repeat(2,minmax(260px,1fr))">
      <div class="card pad"><h3>Opret via E-mail</h3>
        <div class="small">Videresend e-mails for at oprette opgaver.</div>
        <input class="input" readonly value="opgave.xyz123@kontrolcenter.dk">
      </div>
      <div class="card pad"><h3>Google Analytics</h3>
        <div class="small">Forbundet – henter 3 nøgletal.</div>
        <button class="btn muted">Administrer</button>
      </div>
      <div class="card pad"><h3>Facebook Ads</h3>
        <div class="small">Forbind for at hente annonce‑data.</div>
        <button class="btn">Forbind</button>
      </div>
      <div class="card pad"><h3>RSS Feed</h3>
        <div class="small">Forbind et nyhedsfeed til din forside.</div>
        <div class="kv"><input class="input" placeholder="https://eksempel.dk/feed"><button class="btn">Forbind</button></div>
      </div>
    </div>`;
  ensureAuthCTA(main);
}

function viewLinks(main){
  main.innerHTML = `
    <div class="topbar"><div><h1 class="h1">Links</h1>
      <p class="sub">Administrer dine bogmærker og hurtige links.</p></div>
      <button class="btn" id="link-add">Tilføj Link</button></div>
    <input id="link-search" class="input" placeholder="Søg i links efter titel, kategori eller beskrivelse…">
    <div id="links-list" style="margin-top:12px" class="grid" ></div>

    <div class="modal-backdrop" id="modal-link">
      <div class="modal">
        <div class="head">Nyt link <button onclick="hide('modal-link')">✕</button></div>
        <div class="body grid" style="grid-template-columns:1fr 1fr;gap:12px">
          <div><div class="small">Titel</div><input id="l-title" class="input"></div>
          <div><div class="small">Kategori</div><input id="l-cat" class="input" placeholder="SEO, Hosting, Internt…"></div>
          <div style="grid-column:1/3"><div class="small">URL</div><input id="l-url" class="input" placeholder="https://"></div>
          <div style="grid-column:1/3"><div class="small">Beskrivelse</div><textarea id="l-desc" class="input" rows="3"></textarea></div>
        </div>
        <div class="foot"><button class="btn muted" onclick="hide('modal-link')">Annuller</button><button class="btn" id="link-save">Gem</button></div>
      </div>
    </div>
  `;
  ensureAuthCTA(main);

  const list = q('#links-list');
  function renderLinkCards(items=[]){
    list.innerHTML='';
    if (!items.length){ list.innerHTML='<div class="empty">Ingen links oprettet.</div>'; return; }
    items.forEach(it=>{
      const card = document.createElement('div');
      card.className='card pad';
      card.innerHTML = html\`
        <div class="kv" style="justify-content:space-between">
          <div class="kv" style="gap:10px"><div class="tag">\${it.category||'Ukendt'}</div><b>\${it.title||'Link'}</b></div>
          <div class="kv"><button class="btn muted" data-act="edit">✎</button>
          <button class="btn muted" data-act="del">🗑</button></div>
        </div>
        <div class="small" style="margin:6px 0">\${it.description||''}</div>
        <a class="btn ghost" href="\${it.url}" target="_blank">Besøg link</a>
      \`;
      card.querySelector('[data-act="del"]').onclick = ()=> Links.removeLink(it.id);
      card.querySelector('[data-act="edit"]').onclick = ()=> alert('Redigering kan tilføjes hurtigt – fokus nu er CRUD & lister.');
      list.appendChild(card);
    });
  }

  if (state.user){
    Links.watchLinks(renderLinkCards);
  }

  q('#link-add').onclick = ()=>{ show('modal-link'); };
  q('#link-save').onclick = async ()=>{
    const data = {
      title:q('#l-title').value.trim(),
      category:q('#l-cat').value.trim(),
      url:q('#l-url').value.trim(),
      description:q('#l-desc').value.trim()
    };
    await Links.createLink(data);
    hide('modal-link');
  };
}

window.show = (id)=>{ q('#'+id).style.display='flex'; }
window.hide = (id)=>{ q('#'+id).style.display='none'; }

render();
