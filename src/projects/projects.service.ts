import { PrismaPg } from "@prisma/adapter-pg";
import { NotFoundError } from "../errors";
import { PrismaClient } from '../generated/prisma';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export interface Project {
  id: number;
  name: string;
  description: string;
}

export async function findAll(): Promise<Project[]> {
    return prisma.project.findMany();
}

export async function findById(id: number): Promise<Project> {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
        throw new NotFoundError(`Project ${id} not found`);
    }
    return project;
}

export async function create(name: string, description: string): Promise<Project> {
    return prisma.project.create({ data: { name, description } });
}