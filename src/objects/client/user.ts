import { z } from 'zod';

export default z.object({
    name: z.string().max(191),
    surname: z.string().max(191),
});