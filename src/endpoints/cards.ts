import {Router, Request, Response} from 'express';

import PrismaClient from '@prismaClient'

import asyncHandler from "@utils/asyncHandler";

const router = Router();

// Pas d'authentification pour cette route
router.get('/cards/:cardid', asyncHandler(async (req: Request, res: Response) => {

    const cardId = req.params.cardid;

    const result = await PrismaClient.card.findUnique({
        where: {
            id: cardId
        }

    });

    if (result === null) {
        res.status(404).json({error: "Card not found"});
    } else {
        res.status(200).json(result);
    }
}));


export default router;