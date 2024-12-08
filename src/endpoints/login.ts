import {Request, Response, Router} from "express";
import jwt from "jsonwebtoken";
import process from "node:process";
import Db from "@utils/db";
import "@utils/auth/passwords";
import {compare} from "@utils/auth/passwords";

const router = Router();

router.post('/login', async (req: Request, res: Response) => {

    let {login, password} = req.body;

    if (!login || !password) {
        res.status(400).json({message: 'Veuillez renseigner un email et un mot de passe'});
    }

    Db.getInstance().getAgent(login).then((agent) => {

        if (!agent) {
            res.status(400).json({message: 'Email !!!! ou mot de passe incorrect'});
            return;
        }
        compare(password, agent.password).then((passwordOK) => {
            if (!passwordOK) {
                res.status(400).json({message: 'Email ou mot de passe incorrect : '  + passwordOK});
                return;
            }

            // Création d'un token JWT avec une durée d'expiration de 12h
            const token = jwt.sign({login: agent.login, id: agent.id}, process.env.SECRET_KEY as string, {expiresIn: '12h'});
            res.json({token});
        });

    }).catch((err) => {
        res.status(400).json({message: err});
    });
});


export default router;