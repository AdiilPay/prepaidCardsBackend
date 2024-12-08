import {Request, Response, Router} from "express";
import authenticate from "@utils/auth/authenticate";
import bcrypt from 'bcryptjs';
import Db from "@utils/db";

const router = Router();

router.post('/register', authenticate, (req: Request, res: Response) => {


    let { login, password } = req.body;

   bcrypt.hash(password, 10).then((hash) => {

       Db.getInstance().addAgent(login, hash).then((agent) => {

           res.send({id: agent.id, login: agent.login});
       });
    });
});


export default router;