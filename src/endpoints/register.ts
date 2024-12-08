import {Request, Response, Router} from "express";
import authenticate from "@utils/auth/authenticate";
import bcrypt from 'bcryptjs';
import Db from "@utils/db";

import loginSchema from "@utils/interfaces/client/login";
const router = Router();

router.post('/register', authenticate, (req: Request, res: Response) => {
    const parsedBody = loginSchema.safeParse(req.body);
    if (!parsedBody.success) {res.status(400).send(parsedBody.error);return;}

    let { login, password } = req.body;

   bcrypt.hash(password, 10).then((hash) => {

       Db.getInstance().addAgent(login, hash).then((agent) => {

           res.send({id: agent.id, login: agent.login});
       });
    });
});


export default router;