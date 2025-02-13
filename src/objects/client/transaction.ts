import { z } from 'zod';
import TransactionEnum from "../transactionType";

export default z.object({
    amount: z.number().positive(),
    type: z.nativeEnum(TransactionEnum),
    description: z.string().max(512).optional()
});