import {Prisma} from "@prisma/client";
import {Statistics} from "@utils/stats/StatisticsObject";

export default function fillMissingDates(data: Statistics[], from: Date, to: Date): Statistics[] {
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