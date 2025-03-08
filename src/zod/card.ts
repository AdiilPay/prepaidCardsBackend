import { z } from 'zod';

export default z.object({
    label: z.string().max(255)
});