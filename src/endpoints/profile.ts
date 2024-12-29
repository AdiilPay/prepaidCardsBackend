import { Router, Request, Response } from 'express';

import card from "@dbObjects/Card";
import profile from "@dbObjects/Profile";

import authenticate from "@utils/auth/authenticate";
import {toBigInt} from "@utils/parser";

const router = Router();


// Pas d'authentification pour cette route
router.get('/profile/:profileId', async (req: Request, res: Response) => {

    const userId = toBigInt(req.params.profileId);

    if (userId === null) {
        res.status(400).json({ error: "Invalid profile id" });

    } else {
        profile.get(userId).then(async (profile) => {
            if (profile === null) {
                res.status(404).json({error: "Profile not found"});
            } else {
                res.status(200).json(await profile.toJSON());
            }
        }).catch((error) => {
            res.status(400).json({error});
        });
    }
});


router.post('/profile/:profileId/card', authenticate, async (req: Request, res: Response) => {

    const userId = toBigInt(req.params.profileId);

    if (userId === null) {
        res.status(400).json({ error: "Invalid profile id" });

    } else {
        profile.get(userId).then(async (profile) => {
            if (profile === null) {
                res.status(404).json({error: "Profile not found"});
            } else {
                card.create(profile).then(async (card) => {
                    res.status(200).json(await card.toJSON());

                }).catch((error) => {
                    console.log(error);
                    res.status(400).json({error});
                });
            }

        }).catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
    }

});




export default router;