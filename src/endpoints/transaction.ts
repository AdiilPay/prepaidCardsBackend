import {Router, Response} from 'express';
import validate from "@utils/bodyValidation"
import transactionBody from "@zod/transaction";

import NotFoundError from '@errors/NotFoundError';

import prismaClient from "@prismaClient";
import {z} from "zod";

import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";
import authenticate from "@utils/auth/authenticate";
import asyncHandler from "@utils/asyncHandler";
import InsufficientBalanceError from "@errors/insufficientBalanceError";
import DisabledCardUseError from "@errors/DisabledCardUseError";
import deepTransformDecimals from "@utils/deepTransformDecimals";
import UnprocessableError from "@errors/UnprocessableError";

const router = Router();

type TransactionForm = z.infer<typeof transactionBody>;

router.post('/cards/:cardid/transactions', authenticate, validate(transactionBody),
    asyncHandler(async (req: AuthenticatedRequest<TransactionForm>, res: Response) => {

        const card = await prismaClient.card.findUnique({
            where: {
                id: req.params.cardid,
                organizationId: req.admin!.organizationId,
                enabled: true
            },
        });

        if (card === null) {
            throw new NotFoundError();
        }

        if (card.enabled === false) {
            throw new DisabledCardUseError();
        }

        if (card.balance.toNumber() < req.body.amount && req.body.amount < 0) {
            throw new InsufficientBalanceError();
        }

        if (req.body.type in ["PAYMENT", "WITHDRAWAL"] && req.body.amount > 0) {
            throw new UnprocessableError(req.body.type + " transactions must have a negative amount");
        } else if (req.body.type in ["DEPOSIT", "REFUND"] && req.body.amount < 0) {
            throw new UnprocessableError(req.body.type + " transactions must have a positive amount");
        }

        const data = await prismaClient.$transaction([
                prismaClient.card.update({
                    where: {
                        id: card.id
                    },
                    data: {
                        balance: {
                            increment: req.body.amount
                        }
                    }
                }),

                prismaClient.transaction.create({
                    data: {
                        amount: req.body.amount,
                        type: req.body.type,
                        description: req.body.description,
                        cardId: card.id,
                        adminId: req.admin!.id,
                    },
                    include: {
                        card: true
                    }
                })
            ]
        )
        res.status(201)
        // On ne récupère que la transaction qui nous intéresse
        res.json(data[1]);
    }));

router.get('/card/:cardId/transactions',
    asyncHandler(async (req: AuthenticatedRequest, res: Response) => {

        const start = Number(req.query.start) || 0;
        const count = Number(req.query.count) || 10;

        const user = await prismaClient.card.findUnique({
            where: {
                id: req.params.cardId,
            }
        });

        if (user === null) {
            throw new NotFoundError();
        }

        const transactions = await prismaClient.transaction.findMany({
            where: {
                cardId: req.params.cardId,
            },
            skip: start,
            take: count,

            orderBy: {
                date: 'desc'
            }
        });

        res.status(200);
        res.json(deepTransformDecimals(transactions));
    }));


export default router;