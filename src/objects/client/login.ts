import { z } from 'zod';

export default z.object({
    login: z.string(),
    password: z.string()
});