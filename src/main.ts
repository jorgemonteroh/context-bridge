import 'dotenv/config';
import express from 'express';
import { compilerRouter } from './compiler/compiler.controller';
import { contextEntriesRouter } from './context-entries/context-entries.controller';
import { projectsRouter } from './projects/projects.controller';

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use('/projects', projectsRouter);
app.use('/projects/:projectId/context-entries', contextEntriesRouter);
app.use('/projects/:projectId/compile-context', compilerRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})