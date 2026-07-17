import { PrismaPg } from "@prisma/adapter-pg";
import { entryType, PrismaClient } from '../generated/prisma';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export async function findAllByProject(projectId: number) {
    return prisma.contextEntry.findMany({
        where: { projectId, active: true }
    });
}

export async function create(projectId: number, type: entryType, title: string, content: string) {
    return prisma.contextEntry.create({
        data: { projectId, type, title, content }
    });
}

export async function deactivate(id: number) {
    return prisma.contextEntry.update({
        where: { id },
        data: { active: false }
    });
}