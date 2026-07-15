import { Request, Response, Router } from "express";
import * as projectsService from "./projects.service";

export const projectsRouter = Router();

projectsRouter.get("/", (req: Request, res: Response) => {
    res.json(projectsService.findAll());
});

projectsRouter.get("/:id", (req: Request, res: Response) => {
    const project = projectsService.findById(Number(req.params.id));
    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
});

projectsRouter.post("/", (req: Request, res: Response) => {
    const { name, description } = req.body;
    const project = projectsService.create(name, description);
    res.status(201).json(project);
});