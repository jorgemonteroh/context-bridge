import { PrismaPg } from '@prisma/adapter-pg';
import { NotFoundError } from '../errors';
import { PrismaClient, entryType } from '../generated/prisma';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({ adapter });

export async function compileContext(projectId: number): Promise<string> {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
        throw new NotFoundError(`Project with ID ${projectId} not found`);
    }

    const entries = await prisma.contextEntry.findMany({ where: { projectId, active: true }, orderBy: { type: 'asc' } });

    const sections: Record<entryType, string[]> = {
        DECISION: [],
        CONVENTION: [],
        SNIPPET: [],
        TASK_STATUS: [],
    };

    for (const entry of entries) {
        sections[entry.type].push(`- ${entry.title}: ${entry.content}`);
    }

    let prompt = `Estás ayudando en el proyecto "${project.name}". ${project.description}\n\n`;

    if (sections.DECISION.length > 0) {
        prompt += `Decisiones de arquitectura:\n${sections.DECISION.join('\n')}\n\n`;
    }
    if (sections.CONVENTION.length > 0) {
        prompt += `Convenciones de código:\n${sections.CONVENTION.join('\n')}\n\n`;
    }
    if (sections.SNIPPET.length > 0) {
        prompt += `Snippets relevantes:\n${sections.SNIPPET.join('\n')}\n\n`;
    }
    if (sections.TASK_STATUS.length > 0) {
        prompt += `Estado actual de tareas:\n${sections.TASK_STATUS.join('\n')}\n\n`;
    }

    return prompt.trim();

}