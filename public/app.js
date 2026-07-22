const projectSelect = document.getElementById('projectSelect');
const compileBtn = document.getElementById('compileBtn');
const contextOutput = document.getElementById('contextOutput');
const copyBtn = document.getElementById('copyBtn');
const status = document.getElementById('status');
const entriesList = document.getElementById('entriesList');
const entryForm = document.getElementById('entryForm');

async function loadProjects() {
  const res = await fetch('/projects');
  const projects = await res.json();

  projectSelect.innerHTML = '';
  for (const project of projects) {
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.name;
    projectSelect.appendChild(option);
  }

  await loadEntries();
}

async function loadEntries() {
  const projectId = projectSelect.value;
  if (!projectId) return;

  const res = await fetch(`/projects/${projectId}/context-entries`);
  const entries = await res.json();

  entriesList.innerHTML = '';
  for (const entry of entries) {
    const li = document.createElement('li');
    li.textContent = `[${entry.type}] ${entry.title}: ${entry.content} `;

    const deactivateBtn = document.createElement('button');
    deactivateBtn.textContent = 'Desactivar';
    deactivateBtn.addEventListener('click', () => deactivateEntry(entry.id));

    li.appendChild(deactivateBtn);
    entriesList.appendChild(li);
  }
}

async function deactivateEntry(id) {
  const projectId = projectSelect.value;
  await fetch(`/projects/${projectId}/context-entries/${id}`, { method: 'DELETE' });
  await loadEntries();
}

async function createEntry(event) {
  event.preventDefault();

  const projectId = projectSelect.value;
  const type = document.getElementById('entryType').value;
  const title = document.getElementById('entryTitle').value;
  const content = document.getElementById('entryContent').value;

  const bodyJson = JSON.stringify({ type, title, content });

  await fetch(`/projects/${projectId}/context-entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: bodyJson,
  });

  entryForm.reset();
  await loadEntries();
}

async function compileContext() {
  const projectId = projectSelect.value;
  if (!projectId) return;

  const res = await fetch(`/projects/${projectId}/compile-context`);
  const data = await res.json();
  contextOutput.value = data.compiledContext ?? data.message ?? 'Error al compilar el contexto';
}

async function copyToClipboard() {
  await navigator.clipboard.writeText(contextOutput.value);
  status.textContent = 'Copiado!';
  setTimeout(() => { status.textContent = ''; }, 2000);
}

compileBtn.addEventListener('click', compileContext);
copyBtn.addEventListener('click', copyToClipboard);
entryForm.addEventListener('submit', createEntry);
projectSelect.addEventListener('change', loadEntries);

loadProjects();