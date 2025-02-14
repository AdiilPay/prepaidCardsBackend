import AppError from "./AppError";

export default class DatabaseCommunicationError extends AppError {
    constructor() {
        super("An error occurred while communicating with the database", 500);
    }
}