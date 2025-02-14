import {Router, Response} from 'express';

const router = Router();

import validate from "@utils/bodyValidation";

import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";
import asyncHandler from "@utils/asyncHandler";
import authenticate from "@utils/auth/authenticate";
import prismaClient from "@prismaClient";

import {organizationStatistics} from "@prisma/client/sql"
import {Prisma} from "@prisma/client";

import organizationStatisticBody from "@clientObjects/organizationStatistics";
import {z} from "zod";

import deepTransformDecimals from "@utils/deepTransformDecimals";

type OrganizationStatisticsForm = z.infer<typeof organizationStatisticBody>;

type Statistics = {
    date: string;
    payments: Prisma.Decimal;
    refunds: Prisma.Decimal;
    deposits: Prisma.Decimal;
    withdrawals: Prisma.Decimal;
    other: Prisma.Decimal;
};

function fillMissingDates(data: Statistics[], from: Date, to: Date): Statistics[] {
    // Générer toutes les dates entre startDate et today
    const allDates = [];
    for (let d = to; d <= from; d.setDate(d.getDate() + 1)) {
        allDates.push(d.toISOString().split('T')[0]);
    }

    // Créer un ensemble de dates existantes pour une recherche rapide
    const existingDates = new Set(data.map(transaction => transaction.date.split('T')[0]));

    // Ajouter les dates manquantes
    const completeData = [...data];
    allDates.forEach(date => {
        if (!existingDates.has(date)) {
            completeData.push({
                date: `${date}T00:00:00.000Z`,
                payments: new Prisma.Decimal(0),
                refunds: new Prisma.Decimal(0),
                deposits: new Prisma.Decimal(0),
                withdrawals: new Prisma.Decimal(0),
                other: new Prisma.Decimal(0)
            });
        }
    });

    // Trier les données par date
    completeData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return completeData;

}


router.get('/transactions/statistics', authenticate, validate(organizationStatisticBody),
    asyncHandler(async (req: AuthenticatedRequest<OrganizationStatisticsForm>, res: Response) => {

        const from = req.body.from;
        const to = req.body.to;

        const transactions = await prismaClient.$queryRawTyped(
            organizationStatistics(req.admin!.organizationId, from, to)
        )as unknown as Statistics[]

        res.status(200);
        res.json(deepTransformDecimals(fillMissingDates(transactions, from, to)));
    }));


export default router;