import { Router, Request, Response } from 'express';
import Db from '@utils/db';
import authenticate from "@utils/auth/authenticate";

const router = Router();

router.get('/cards', authenticate, (req: Request, res: Response) => {

    Db.getInstance().getCards().then((cards) => {
        res.send(cards);
    });
});


router.post('/cards', authenticate, (req: Request, res: Response) => {

    Db.getInstance().addCard(req.body.prenom, req.body.nom).then((card) => {
        res.send(card);
    });
});


router.get('/cards/:id', authenticate, (req: Request, res: Response) => {

    Db.getInstance().getCard(req.params.id).then((card) => {
        res.send(card);
    });
});

export default router;