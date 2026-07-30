import { PrismaPg } from "@prisma/adapter-pg";
import { NotFoundError } from "../errors";
import { entryType, PrismaClient } from '../generated/prisma';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export async function findAllByProject(projectId: number, includeInactive = false) {
    return prisma.contextEntry.findMany({
        where: includeInactive ? { projectId } : { projectId, active: true },
    });
}

export async function create(projectId: number, type: entryType, title: string, content: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
        throw new NotFoundError(`Project ${projectId} not found`);
    }
    return prisma.contextEntry.create({
        data: { projectId, type, title, content }
    });
}

async function findEntryOrThrow(id: number) {
    const entry = await prisma.contextEntry.findUnique({ where: { id } });
    if (!entry) {
        throw new NotFoundError(`Context entry ${id} not found`);
    }
    return entry;
}

export async function update(id: number, type: entryType, title: string, content: string) {
    await findEntryOrThrow(id);
    return prisma.contextEntry.update({
        where: { id },
        data: { type, title, content }
    });
}

export async function deactivate(id: number) {
    await findEntryOrThrow(id);
    return prisma.contextEntry.update({
        where: { id },
        data: { active: false }
    });
}

export async function activate(id: number) {
    await findEntryOrThrow(id);
    return prisma.contextEntry.update({
        where: { id },
        data: { active: true },
    });
}