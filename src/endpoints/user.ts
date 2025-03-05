import {Router, Response, Request} from 'express';

import PrismaClient from '@prismaClient'

import authenticate from "@utils/auth/authenticate";
import validate from "@utils/bodyValidation";
import userBody from "@clientObjects/user";
import {z} from "zod";

import NotFoundError from '@errors/NotFoundError';

import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";
import asyncHandler from "@utils/asyncHandler";
import deepTransformDecimals from "@utils/deepTransformDecimals";

const router = Router();

type BodyForm = z.infer<typeof userBody>;

router.post('/user', authenticate, validate(userBody),
    asyncHandler(async (req: AuthenticatedRequest<BodyForm>, res: Response) => {
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

router.get('/user', authenticate,
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const users = await PrismaClient.user.findMany({
        where: {
            organizationId: req.admin!.organizationId,
            deleted: false
        },
    });

    res.json(deepTransformDecimals(users));
}));

router.get('/user/:id',
    asyncHandler(async (req: Request, res: Response) => {
    const user = await PrismaClient.user.findUnique({
        where: {
            id: req.params.id,
            deleted: false
        },
        include: {
            cards: {
                where: {
                    enabled: true
                }
            }
        }
    });

    if (user === null) {
        throw new NotFoundError();
    }

    res.json(deepTransformDecimals(user));
}));

router.put('/user/:id', authenticate, validate(userBody),

    asyncHandler(async (req: AuthenticatedRequest<BodyForm>, res: Response) => {
    const user = await PrismaClient.user.findUnique({
        where: {
            id: req.params.id,
            organizationId: req.admin!.organizationId
        }
    });

    if (user === null) {
        throw new NotFoundError();
    }

    const result = await PrismaClient.user.update({
        where: {
            id: req.params.id
        },
        data: {
            name: req.body.name,
            surname: req.body.surname
        }
    });

    res.json(result);
}));

router.delete('/user/:id', authenticate,
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await PrismaClient.user.findUnique({
        where: {
            id: req.params.id,
            organizationId: req.admin!.organizationId
        }
    });

    if (user === null) {
        throw new NotFoundError();
    }

    await PrismaClient.user.update({
        where: {
            id: req.params.id
        },
        data: {
            deleted: true,
            name : "deleted",
            surname: "deleted"
        }
    });

    res.status(204);
    res.send();
}));


export default router;