import { Router, Request, Response } from 'express';

import card from "@dbObjects/Card";
import profile from "@dbObjects/Profile";

import authenticate from "@utils/auth/authenticate";
import {toBigInt} from "@utils/parser";

const router = Router();

// Pas d'authentification pour cette route
// => Permets d'avoir les infos directement en scannant sa carte
router.post('/cards/:profileid', authenticate, async (req: Request, res: Response) => {

    const userId = toBigInt(req.params.profileid);

    if (userId === null) {
        res.status(400).json({ error: "Invalid profile id" });

    } else {
        profile.get(userId).then(async (profile) => {
            card.create(profile).then(async (card) => {
                res.status(200).json(await card.toJSON());
            }).catch((error) => {
                console.log(error)
                res.status(400).json({error});
            });
        }).catch((error) => {
            res.status(400).json({error});
        });
    }
});

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


export default router;