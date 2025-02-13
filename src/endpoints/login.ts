import { Router, Request, Response } from 'express';
import validate from "@utils/bodyValidation"
import loginBody from "@clientObjects/login";

import createToken from "@utils/auth/createTokens";

import {compare} from "@utils/auth/passwords";

const router = Router();

import prismaClient from "@prismaClient";
import {z} from "zod";

import AuthenticationError from "@errors/AuthenticationError";

type LoginForm = z.infer<typeof loginBody>;

router.post('/login', validate(loginBody), async (req: Request<{}, {}, LoginForm>, res: Response) => {

    const {login, password} = req.body;

    const admin = await prismaClient.admin.findUnique({
        where: {
            login: login
        }
    })

    if (admin === null) {
        throw new AuthenticationError();
    }

    const passwordMatch = await compare(password, admin.password);

    if (!passwordMatch) {
        throw new AuthenticationError();
    }

    const token = createToken(admin);

    res.status(200);
    res.json({token: token});

});


export default router;