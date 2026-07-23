const projectSelect = document.getElementById('projectSelect');
const compileBtn = document.getElementById('compileBtn');
const contextOutput = document.getElementById('contextOutput');
const copyBtn = document.getElementById('copyBtn');
const status = document.getElementById('status');
const entriesList = document.getElementById('entriesList');
const entryForm = document.getElementById('entryForm');
const projectForm = document.getElementById('projectForm');

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

  const res = await fetch(`/projects/${projectId}/context-entries?includeInactive=true`);
  const entries = await res.json();

  entriesList.innerHTML = '';
  for (const entry of entries) {
    const li = document.createElement('li');
    const activeLabel = entry.active ? '' : ' (inactiva)';
    li.textContent = `[${entry.type}] ${entry.title}: ${entry.content}${activeLabel} `;

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = entry.active ? 'Desactivar' : 'Activar';
    toggleBtn.addEventListener('click', () => toggleEntry(entry.id, entry.active));

    li.appendChild(toggleBtn);
    entriesList.appendChild(li);
  }
}

async function toggleEntry(id, isActive) {
  const projectId = projectSelect.value;
  const action = isActive ? '' : '/activate';
  const method = isActive ? 'DELETE' : 'PATCH';
  await fetch(`/projects/${projectId}/context-entries/${id}${action}`, { method });
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

async function createProject(event) {
  event.preventDefault();

  const name = document.getElementById('projectName').value;
  const description = document.getElementById('projectDescription').value;

  const bodyJson = JSON.stringify({ name, description });

  await fetch('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: bodyJson,
  });

  projectForm.reset();
  await loadProjects();
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
projectForm.addEventListener('submit', createProject);
projectSelect.addEventListener('change', loadEntries);

loadProjects();