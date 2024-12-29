import { z } from 'zod';

export default z.object({
    amount: z.number().positive(),
    agentId: z.bigint().positive(),
    cardId: z.bigint().positive(),
    type: z.number().int().positive()
});