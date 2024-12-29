import { Router, Request, Response } from 'express';

import card from "@dbObjects/Card";

import authenticate from "@utils/auth/authenticate";
import {toBigInt} from "@utils/parser";

const router = Router();

// Pas d'authentification pour cette route
router.get('/cards/:cardid', async (req: Request, res: Response) => {

        const cardId = toBigInt(req.params.cardid);

        if (cardId === null) {
            res.status(400).json({ error: "Invalid card id" });

        } else {
            card.get(cardId).then(async (card) => {
                if (card === null) {
                    res.status(404).json({ error: "Card not found" });
                } else {
                    res.status(200).json(await card.toJSON());
                }
            }).catch((error) => {
                res.status(400).json({error});
            });
        }
})

// Désactive la carte
router.delete('/cards/:cardid', authenticate, async (req: Request, res: Response) => {

        const cardId = toBigInt(req.params.cardid);

        if (cardId === null) {
            res.status(400).json({ error: "Invalid card id" });

        } else {
            card.get(cardId).then(async (card) => {
                if (card === null) {
                    res.status(404).json({ error: "Card not found" });
                } else {
                    card.disable().then(() => {
                        res.status(200).json({ success: true });
                    }).catch((error) => {
                        res.status(400).json({error});
                    });
                }
            }).catch((error) => {
                res.status(400).json({error});
            });
        }
})



export default router;