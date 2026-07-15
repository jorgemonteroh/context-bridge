export interface Project {
  id: number;
  name: string;
  description: string;
}

let projects: Project[] = [];
let nextId = 1;

export function findAll(): Project[] {
    return projects;
}

export function findById(id: number): Project | undefined {
    return projects.find(project => project.id === id);
}

export function create(name: string, description: string): Project {
    const project: Project = { id: nextId++, name, description };
    projects.push(project);
    return project;
}