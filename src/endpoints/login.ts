import { Router, Request, Response } from 'express';
import validate from "@utils/bodyValidation"
import login from "@clientObjects/login";

import dbAgent from "@dbObjects/Agent";

import createToken from "@utils/auth/createTokens";

const router = Router();


router.post('/login', validate(login), (req: Request, res: Response) => {

    dbAgent.login(req.body.login, req.body.password).then((agent) => {
        if (agent === null) {
            res.status(401).json({ error: "Invalid credentials" });
        } else {
            res.status(200).json({ token: createToken(agent) });
        }
    }).catch((error) => {
        res.status(400).json({ error });
    });

});


export default router;