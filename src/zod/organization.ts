import { z } from 'zod';

export default z.object({
    name: z.string().max(255),

    // couleurs
    primary: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
    secondary: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
    accent: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),

});