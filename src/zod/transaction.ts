import { z } from 'zod';
import TransactionType from '@prisma/client';

export default z.object({
    amount: z.number().multipleOf(0.01),
    type: z.nativeEnum(TransactionType.TransactionType),
    description: z.string().default(""),
});