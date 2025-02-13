import AppError from "./AppError";

export default class InvalidTokenError extends AppError {
    constructor() {
        super("Could not found the requested entity", 404);
    }
}