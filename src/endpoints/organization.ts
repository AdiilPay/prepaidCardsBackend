import {Router, Response} from 'express';

const router = Router();

import validate from "@utils/bodyValidation";

import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";
import asyncHandler from "@utils/asyncHandler";
import authenticate from "@utils/auth/authenticate";
import prismaClient from "@prismaClient";

import {organizationStatistics} from "@prisma/client/sql"

import organizationStatisticBody from "@zod/organizationStatistics";
import {z} from "zod";

import deepTransformDecimals from "@utils/deepTransformDecimals";
import fillMissingDates from "@utils/stats/fillMissingDates";
import {Statistics} from "@utils/stats/StatisticsObject";

import NotFoundError from "@errors/NotFoundError"
import organization from "@zod/organization";


type OrganizationStatisticsForm = z.infer<typeof organizationStatisticBody>;
type OrganizationSettings = z.infer<typeof  organization>



router.get('/organizations/:orgId/statistics', authenticate, validate(organizationStatisticBody),
    asyncHandler(async (req: AuthenticatedRequest<OrganizationStatisticsForm>, res: Response) => {

        if (req.admin!.organizationId !== req.params.orgId) {
            throw new NotFoundError();
        }

        const from = req.body.from;
        const to = req.body.to;

        const transactions = await prismaClient.$queryRawTyped(
            organizationStatistics(req.admin!.organizationId, from, to)
        )as unknown as Statistics[]

        res.status(200);
        res.json(deepTransformDecimals(fillMissingDates(transactions, from, to)));
    }));


router.get('/organizations/:orgId', asyncHandler(async (req, res) => {

        const organization = await prismaClient.organization.findUnique({
            where: {
                id: req.params.orgId
            }
        });

        if (organization === null) {
                throw new NotFoundError();
        }

        res.status(200);
        res.json(organization);
    }
));


router.put('/organizations/:orgId', authenticate, validate(organizationStatisticBody),
    asyncHandler(async (req: AuthenticatedRequest<OrganizationSettings>, res) => {

        if (req.admin!.organizationId !== req.params.orgId) {
            throw new NotFoundError();
        }

        const organization = await prismaClient.organization.update({
            where: {
                id: req.params.orgId
            },
            data: {
                name: req.body.name,
                primary_color: req.body.primary_color,
                secondary_color: req.body.secondary_color,
                accent_color: req.body.accent_color,
            }
        });

        res.status(200);
        res.json(organization);
    })
)

export default router;