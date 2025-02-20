import {Prisma} from "@prisma/client";

export type Statistics = {
    date: string;
    payments: Prisma.Decimal;
    refunds: Prisma.Decimal;
    deposits: Prisma.Decimal;
    withdrawals: Prisma.Decimal;
    other: Prisma.Decimal;
};
