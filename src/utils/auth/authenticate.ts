import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import Agent from "@dbObjects/Agent";

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];

    // On récupère ce qui suit le mot "Bearer" dans le header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({message: 'Accès refusé : aucun token fourni'});

    } else {

        //                "as string" nécessaire pour que typescript comprenne que process.env.SECRET_KEY est bien un string
        jwt.verify(token, process.env.SECRET_KEY as string, async (err, user) => {
            // Vérification du token
            // Si le token matche avec la clé secrète, on peut continuer

            if (err) {
                res.status(403).json({message: 'Token invalide'});
            } else {

                const data = user as JwtPayload;

                const agent = Agent.get(data.id);

                req.user = await agent;
                next();
            }
        });
    }
}