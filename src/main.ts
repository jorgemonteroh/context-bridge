import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { compilerRouter } from './compiler/compiler.controller';
import { contextEntriesRouter } from './context-entries/context-entries.controller';
import { AppError } from './errors';
import { projectsRouter } from './projects/projects.controller';

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use('/projects', projectsRouter);
app.use('/projects/:projectId/context-entries', contextEntriesRouter);
app.use('/projects/:projectId/compile-context', compilerRouter);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({ message: 'Validation error', errors: err.issues });
        return;
    }

    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})