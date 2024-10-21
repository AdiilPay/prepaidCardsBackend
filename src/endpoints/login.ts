import {Request, Response, Router} from "express";
import authenticate from "@utils/auth/authenticate";
import jwt from "jsonwebtoken";
import process from "node:process";
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/login', (req: Request, res: Response) => {

    const { login, password } = req.body;


    // if (!user) {
    //    res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    // }

    //const isPasswordValid = bcrypt.compare(password, user.password);
    const isPasswordValid = true;

    if (!isPasswordValid) {
        res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Création d'un token JWT avec une durée d'expiration
    const token = jwt.sign({ email: login }, process.env.SECRET_KEY as string, { expiresIn: '1h' });

    res.json({ token });
});


export default router;