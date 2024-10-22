import { Router, Request, Response } from 'express';
import Db from "@utils/db";
import authenticate from "@utils/auth/authenticate";
import transactionSchema from "@utils/interfaces/client/transaction";

const router = Router();

router.get('/transactions/', authenticate, (req: Request, res: Response) => {
    console.log("yhrte")
    Db.getInstance().getCardTransactions(req.params.cardId).then((transactions) => {
        res.send(transactions);
    });
});

// Pas d'authentification pour cette route
// => Permets d'avoir l'historique des achats directement en scannant sa carte
router.get('/transactions/:cardId', (req: Request, res: Response) => {

    Db.getInstance().getLinkedCardTransactions(req.params.cardId).then((transactions) => {
        res.send(transactions);
    });
});

router.post('/transactions/:cardId', authenticate, (req: Request, res: Response) => {
    const parsedBody = transactionSchema.safeParse(req.body);
    if (!parsedBody.success) {
        res.status(400).send(parsedBody.error);
    } else {

        Db.getInstance().getCard(req.params.cardId).then((card) => {
            console.log(card.solde + req.body.amount < 0 )
            console.log(req.body.amount < 0)
            console.log(card.solde)

            console.log(req.body.amount)
            console.log(card.solde + req.body.amount)

            console.log((card.solde + req.body.amount < 0 ) && (req.body.amount < 0))

            if (!card) {
                res.status(404).send({message: 'Carte non trouvée'});
            } else if ((card.solde + req.body.amount < 0 ) && (req.body.amount < 0)) {
                res.status(400).send({message: 'Solde insuffisant'});
            } else {
                Db.getInstance().addTransaction(
                    // @ts-ignore
                    req.user.id,
                    req.body.amount, req.params.cardId).then((transaction) => {
                    Db.getInstance().getCard(req.params.cardId).then((card) => {
                        res.send({
                            transaction: transaction,
                            card: card
                        });
                    });
                });
            }
        });
    }
});

export default router;