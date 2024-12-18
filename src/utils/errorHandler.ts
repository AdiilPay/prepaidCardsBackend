export default function (error: any, req: any, res: any, next: () => void) {
    if (error instanceof SyntaxError) {
        res.status(400).json({ error: 'Invalid JSON' });
    } else if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        next();
    }
}