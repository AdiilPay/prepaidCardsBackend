import {Router, Request, Response} from 'express';
import validate from "@utils/bodyValidation"
import loginBody from "@clientObjects/login";

import createToken from "@utils/auth/createTokens";

import {compare} from "@utils/auth/passwords";

const router = Router();

import prismaClient from "@prismaClient";
import {z} from "zod";

import AuthenticationError from "@errors/AuthenticationError";
import asyncHandler from "@utils/asyncHandler";
import {Admin, Organization} from "@prisma/client";

type LoginForm = z.infer<typeof loginBody>;

router.post('/login', validate(loginBody),
    asyncHandler(async (req: Request<{}, {}, LoginForm>, res: Response) => {

        const {login, password} = req.body;

        const admin = await prismaClient.admin.findUnique({
            where: {
                login: login
            },

            include: {
                organization: true
            }
        }) as (Admin & { organization: Organization }) | null;

        if (admin === null) {
            throw new AuthenticationError();
        }

        const passwordMatch = await compare(password, admin.password);

        if (!passwordMatch) {
            throw new AuthenticationError();
        }

        // On supprime le mot de passe du retour
        const {password: _, ...adminWithoutPassword} = admin;

        const token = createToken(admin);

        res.status(200);
        res.json({
            token: token,
            ...adminWithoutPassword
        });
    }));


export default router;