import { Router, Request, Response } from 'express';

import card from "@dbObjects/Card";

const router = Router();

// Pas d'authentification pour cette route
// => Permets d'avoir les infos directement en scannant sa carte
router.get('/cards/:id', (req: Request, res: Response) => {

    const id = Number(req.params.id);

    // On vérifie que l'id est bien un snowflake
    if (isNaN(id)) {
        res.status(400).send("Invalid id");
        return;
    }

    card.get(id).then((card) => {
        res.send(card);
    }).catch(() => {
        res.status(404).send("Card not found");
    });
});


export default router;