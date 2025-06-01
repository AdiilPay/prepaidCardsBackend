import { z } from 'zod';

export default z.object({
    name: z.string().max(255),

    // couleurs
    primary_color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
    secondary_color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
    accent_color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),

});