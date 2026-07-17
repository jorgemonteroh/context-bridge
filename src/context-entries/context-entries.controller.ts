import { Request, Response, Router } from 'express';
import * as contextEntriesService from './context-entries.service';

export const contextEntriesRouter = Router({ mergeParams: true });

contextEntriesRouter.get('/', async (req: Request, res: Response) => {
    const projectId = Number(req.params.projectId);
    const entries = await contextEntriesService.findAllByProject(projectId);
    res.json(entries);
});

contextEntriesRouter.post('/', async (req: Request, res: Response) => {
    const projectId = Number(req.params.projectId);
    const { type, title, content } = req.body;
    const entry = await contextEntriesService.create(projectId, type, title, content);
    res.status(201).json(entry);
});

contextEntriesRouter.delete('/:id', async (req: Request, res: Response) => {
    await contextEntriesService.deactivate(Number(req.params.id));
    res.status(204).send();
});