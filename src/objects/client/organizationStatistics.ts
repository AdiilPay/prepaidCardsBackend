import { z } from 'zod';

export default z.object({
    from: z.coerce.date().default(new Date()),
    // Il y a 7 jours.
    to: z.coerce.date().default(new Date(new Date().setDate(new Date().getDate() - 6))),
})