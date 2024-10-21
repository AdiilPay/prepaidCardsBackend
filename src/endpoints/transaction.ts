import { Router, Request, Response } from 'express';
import Db from "@utils/db";
import authenticate from "@utils/auth/authenticate";

const router = Router();

router.get('/transactions/', authenticate, (req: Request, res: Response) => {
    console.log("yhrte")
    Db.getInstance().getCardTransactions(req.params.cardId).then((transactions) => {
        res.send(transactions);
    });
});

router.get('/transactions/:cardId', authenticate, (req: Request, res: Response) => {

    console.log("test")
    Db.getInstance().getLinkedCardTransactions(req.params.cardId).then((transactions) => {
        res.send(transactions);
    });
});

router.post('/transactions', authenticate, (req: Request, res: Response) => {

    Db.getInstance().addTransaction(req.body.memberId, req.body.amount, req.body.cardId).then((transaction) => {
        res.send(transaction);
    });
});

export default router;