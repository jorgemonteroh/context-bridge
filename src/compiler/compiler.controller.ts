import { Request, Response, Router } from 'express';
import * as compilerService from './compiler.service';

export const compilerRouter = Router({ mergeParams: true });

compilerRouter.get('/', async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);
  const prompt = await compilerService.compileContext(projectId);
  res.json({ compiledContext: prompt });
});