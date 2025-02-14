import AppError from "./AppError";

export default class DataError extends AppError {

    constructor(details?: any) {
        super("Could not process the data", 400, details);
    }
}