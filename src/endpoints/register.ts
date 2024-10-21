import {Request, Response, Router} from "express";
import authenticate from "@utils/auth/authenticate";
import bcrypt from 'bcryptjs';
import Db from "@utils/db";

const router = Router();

router.post('/register', authenticate, (req: Request, res: Response) => {


    let { login, password } = req.body;

   bcrypt.hash(password, 10).then((hash) => {

       Db.getInstance().addMember(login, hash).then((user) => {
           // On renvoie l'utilisateur créé, en supprimant le mot de passe
           delete user.password;

           res.send(user);
       });
    });
});


export default router;