import AppError from "./AppError";

export default class DataError extends AppError {

    details: any

    constructor(description: any) {
        super("Could not process the data", 400);

        this.details = description;
    }
}