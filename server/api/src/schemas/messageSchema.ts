import { z } from 'zod';

export const messageSchema = z.object({
    channel_id: z.string().min(1),
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
});
