import {Request, Response, Router} from 'express';

import PrismaClient from '@prismaClient'


import asyncHandler from "@utils/asyncHandler";

import NotFoundError from '@errors/NotFoundError';
import authenticate from "@utils/auth/authenticate";
import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";

const router = Router();

// Pas d'authentification pour cette route
router.get('/cards/:cardid',
    asyncHandler(async (req: Request, res: Response) => {

        const cardId = req.params.cardid;

        const result = await PrismaClient.card.findUnique({
            where: {
                id: cardId,
                enabled: true
            }

        });

        if (result === null) {
            res.status(404).json({error: "Card not found"});
        } else {
            res.status(200).json(result);
        }
    }));

router.post('/user/:userid/cards', authenticate,
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {

        // On vérifie que l'utilisateur existe et qu'il appartient à l'organisation de l'admin
        const user = await PrismaClient.user.findFirst({
            where: {
                id: req.params.userid,
                organizationId: req.admin!.organizationId,
                deleted: false
            },
        });

        // Si l'utilisateur n'existe pas ou n'appartient pas à l'orgas, on renvoie une erreur 404
        if (!user) {
            throw new NotFoundError();
        }

        // Si l'utilisateur existe, on crée une carte pour cet utilisateur
        const result = await PrismaClient.card.create({
            data: {
                userId: req.params.userid
            },
        })

        res.status(201).json(result);
    }));

router.delete('/cards/:cardid', authenticate,
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const cardId = req.params.cardid;

        const result = await PrismaClient.card.update({
            where: {
                id: cardId,
                user: {
                    organizationId: req.admin!.organizationId
                }
            },
            data: {
                enabled: false
            }
        });

        res.status(204).json(result);

    }));

export default router;