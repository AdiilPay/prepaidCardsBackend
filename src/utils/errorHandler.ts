import AppError from "@errors/AppError";
import {Prisma} from "@prisma/client";
import NotFoundError from "@errors/NotFoundError";
import DatabaseCommunicationError from "@errors/DatabaseCommunicationError";

export default function (error: any, req: any, res: any, next: () => void) {

    console.log(`Error: ${error.message}`);

    // Permets de gérer les erreurs de type Prisma
    // On les convertit en erreurs plus explicites si possible
    // Sinon on les considère comme des erreurs de DB
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2025':
                error = new NotFoundError();
                return;
            default:
                error = new DatabaseCommunicationError();
        }
    }

    if (error instanceof AppError) {
        res.status(error.statusCode);

        if (error.details !== undefined) {
            res.json({ error: error.message, details: error.details });
        } else {
            res.json({error: error.message});

        }
        return;
    }

    if (error instanceof SyntaxError) {
        res.status(400).json({ error: 'Invalid JSON' });
        return;

    } else if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    next();
}