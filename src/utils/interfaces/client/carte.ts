import { z } from 'zod';

export default z.object({
    nom: z.string(),
    prenom: z.string(),
});