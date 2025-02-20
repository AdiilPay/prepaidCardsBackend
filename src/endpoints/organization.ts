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
import fillMissingDates from "@utils/stats/fillMissingDates";
import {Statistics} from "@utils/stats/StatisticsObject";


type OrganizationStatisticsForm = z.infer<typeof organizationStatisticBody>;



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