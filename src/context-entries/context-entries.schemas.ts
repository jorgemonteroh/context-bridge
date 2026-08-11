import { z } from "zod";

export const createEntrySchema = z.object({
    type: z.enum(['DECISION', 'CONVENTION', 'SNIPPET', 'TASK_STATUS']),
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().min(1, { message: "Content is required" }),
})

export const updateEntrySchema = createEntrySchema;