import AppError from "./AppError";

export default class InvalidTokenError extends AppError {
    constructor() {
        super("The provided token is expired/invalid", 498);
    }
}