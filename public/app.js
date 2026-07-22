const projectSelect = document.getElementById('projectSelect');
const compileBtn = document.getElementById('compileBtn');
const contextOutput = document.getElementById('contextOutput');
const copyBtn = document.getElementById('copyBtn');
const status = document.getElementById('status');

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

loadProjects();