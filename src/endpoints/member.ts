import { Router, Request, Response } from 'express';
import Db from "@utils/db";
import authenticate from "@utils/auth/authenticate";
import transactionSchema from "@utils/interfaces/client/transaction";

const router = Router();

router.get('/members/:userId', authenticate, (req: Request, res: Response) => {
    // On vérirife que userId est un nombre
    if (isNaN(parseInt(req.params.userId))) {
        res.status(400).send({message: 'Identifiant invalide'});
        return;
    }

    Db.getInstance().getMemberById(parseInt(req.params.userId)).then((user) => {
        if (!user) {
            res.status(404).send({message: 'Utilisateur non trouvé'});
        } else {
            Db.getInstance().getMemberTransactions(user.id).then((cards) => {
                delete user.password;
                res.send({
                    user: user,
                    activity: cards
                });

            })
        }
    })
});

export default router;