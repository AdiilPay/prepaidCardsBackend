import {NextFunction, request, Request, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import * as process from "node:process";

export default (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({message: 'Accès refusé : aucun token fourni'});

    } else {

        //                "as string" nécessaire pour que typescript comprenne que process.env.SECRET_KEY est bien une string
        jwt.verify(token, process.env.SECRET_KEY as string, (err, user) => {
            // Vérification du token
            // Si le token matche avec la clé secrète, on peut continuer

            if (err) {
                res.status(403).json({message: 'Token invalide'});
            } else {
                // On stocke les informations de l'utilisateur dans req.user
                req.user = user as JwtPayload;
                next();
            }
        });
    }
}