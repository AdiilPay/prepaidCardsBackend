import {Router, Response} from 'express';

import PrismaClient from '@prismaClient'

import authenticate from "@utils/auth/authenticate";
import validate from "@utils/bodyValidation";
import userBody from "@clientObjects/user";
import {z} from "zod";

import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";
import asyncHandler from "@utils/asyncHandler";

const router = Router();

type BodyForm = z.infer<typeof userBody>;

router.post('/user', authenticate, validate(userBody), asyncHandler(async (req: AuthenticatedRequest<BodyForm>, res: Response) => {
    const result = await PrismaClient.user.create({
        data: {
            name: req.body.name,
            surname: req.body.surname,
            organizationId: req.admin!.organizationId
        }
    });

    res.status(201)
    res.json(result);
}));

router.get('/user', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const users = await PrismaClient.user.findMany({
        where: {
            organizationId: req.admin!.organizationId
        },
    });

    res.json(users);
}));

router.get('/user/:id', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await PrismaClient.user.findUnique({
        where: {
            id: req.params.id,
            organizationId: req.admin!.organizationId
        },

        include: {
            cards: true
        }

    });
    res.json(user);
}));


export default router;