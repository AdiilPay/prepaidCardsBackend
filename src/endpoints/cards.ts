import {Request, Response, Router} from 'express';

import PrismaClient from '@prismaClient'


import asyncHandler from "@utils/asyncHandler";

import NotFoundError from '@errors/NotFoundError';
import authenticate from "@utils/auth/authenticate";
import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";
import validate from "@utils/bodyValidation";
import cardBody from "@zod/card";
import {z} from "zod";

const router = Router();

type CardForm = z.infer<typeof cardBody>;

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
            throw new NotFoundError()
        } else {
            res.status(200).json(result);
        }
    }));


router.get('/cards', authenticate,
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {

        const result = await PrismaClient.card.findMany({
            where: {
                organizationId: req.admin!.organizationId,
                enabled: true
            }
        });

        res.status(200).json(result);
    }));

router.post('/cards', authenticate, validate(cardBody),
    asyncHandler(async (req: AuthenticatedRequest<CardForm>, res: Response) => {


        // Si l'utilisateur existe, on crée une carte pour cet utilisateur
        const result = await PrismaClient.card.create({
            data: {
                label: req.body.label,
                organizationId: req.admin!.organizationId
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
                organizationId: req.admin!.organizationId
            },
            data: {
                enabled: false
            }
        });

        res.status(204).json({});
    }));

// Supression d'une carte
router.delete('/cards/:cardid/nuke', authenticate,
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const cardId = req.params.cardid;

        await PrismaClient.card.delete({
            where: {
                id: cardId,
                organizationId: req.admin!.organizationId
            }
        });

        res.status(204).json({});
    }));


export default router;