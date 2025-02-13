import AppError from "@errors/AppError";

export default function (error: any, req: any, res: any, next: () => void) {

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
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    next();
}