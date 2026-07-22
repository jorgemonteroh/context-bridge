import { Request, Response, Router } from 'express';
import * as contextEntriesService from './context-entries.service';

export const contextEntriesRouter = Router({ mergeParams: true });

contextEntriesRouter.get('/', async (req: Request, res: Response) => {
    const projectId = Number(req.params.projectId);
    const includeInactive = req.query.includeInactive === 'true';
    const entries = await contextEntriesService.findAllByProject(projectId, includeInactive);
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

contextEntriesRouter.patch('/:id/activate', async (req: Request, res: Response) => {
  const entry = await contextEntriesService.activate(Number(req.params.id));
  res.json(entry);
});