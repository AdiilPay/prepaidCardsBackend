import { z } from 'zod';

export default z.object({
    login: z.string().max(255),
    password: z.string()
});