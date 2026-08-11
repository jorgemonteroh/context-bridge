import { Request, Response, Router } from "express";
import { createProjectSchema } from "./projects.schemas";
import * as projectsService from "./projects.service";

export const projectsRouter = Router();

projectsRouter.get("/", async (req: Request, res: Response) => {
    const projects = await projectsService.findAll();
    res.json(projects);
});

projectsRouter.get("/:id", async (req: Request, res: Response) => {
    const project = await projectsService.findById(Number(req.params.id));
    res.json(project);
});

projectsRouter.post("/", async (req: Request, res: Response) => {
    const { name, description } = createProjectSchema.parse(req.body);
    const project = await projectsService.create(name, description);
    res.status(201).json(project);
});