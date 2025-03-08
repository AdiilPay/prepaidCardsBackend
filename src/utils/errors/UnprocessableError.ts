import AppError from "./AppError";

export default class UnprocessableError extends AppError {
    constructor(details?: any) {
        super("The provided data could not be processed due to logic error", 498, details);
    }
}