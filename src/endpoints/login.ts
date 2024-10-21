import {Request, Response, Router} from "express";
import jwt from "jsonwebtoken";
import process from "node:process";
import bcrypt from 'bcryptjs';
import Db from "@utils/db";

const router = Router();

router.get('/login', (req: Request, res: Response) => {

    const {login, password} = req.body;

    // Recherche de l'utilisateur dans la base de données

    Db.getInstance().getMember(login).then((user) => {
        if (!user) {
            res.status(400).json({message: 'Email ou mot de passe incorrect'});
        }

        bcrypt.compare(password, user.password!).then((valid) => {

            if (!valid) {
                res.status(400).json({message: 'Email ou mot de passe incorrect'});
            } else {

                // Création d'un token JWT avec une durée d'expiration
                const token = jwt.sign({login: user.identifiant, id: user.id}, process.env.SECRET_KEY as string, {expiresIn: '1h'});

                res.json({token});
            }
        })
    }).catch((err) => {
        res.status(400).json({message: 'Email ou mot de passe incorrect'});
    });
});


export default router;