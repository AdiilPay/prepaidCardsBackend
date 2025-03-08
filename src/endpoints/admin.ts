import authenticate from "@utils/auth/authenticate";
import validate from "@utils/bodyValidation";
import organizationStatisticBody from "@zod/organizationStatistics";
import asyncHandler from "@utils/asyncHandler";
import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";
import {Response} from "express";
import prismaClient from "@prismaClient";
import {adminStatistics} from "@prisma/client/sql";
import deepTransformDecimals from "@utils/deepTransformDecimals";
import router from "./organization";
import {z} from "zod";
import fillMissingDates from "@utils/stats/fillMissingDates";
import {Statistics} from "@utils/stats/StatisticsObject";


type OrganizationStatisticsForm = z.infer<typeof organizationStatisticBody>;

router.get('/admin/adminId/statistics', authenticate, validate(organizationStatisticBody),
    asyncHandler(async (req: AuthenticatedRequest<OrganizationStatisticsForm>, res: Response) => {

        const from = req.body.from;
        const to = req.body.to;

        const transactions = await prismaClient.$queryRawTyped(
            adminStatistics(req.admin!.organizationId, req.admin!.id, from, to)
        ) as unknown as Statistics[]

        res.status(200);
        res.json(deepTransformDecimals(fillMissingDates(transactions, from, to)));
}));

router.get('/admins', authenticate,
    asyncHandler(async (req: AuthenticatedRequest<OrganizationStatisticsForm>, res: Response) => {

        const admins = await prismaClient.admin.findMany({
            where: {
                organizationId: req.admin!.organizationId
            },

            omit: {
                password: true
            }
        });

        res.status(200);
        res.json(admins);
}));

export default router;