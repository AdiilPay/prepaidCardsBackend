import AppError from "./AppError";

export default class DataError extends AppError {

    details: any

    constructor(description: any) {
        super("This card has been disabled and can’t be used anymore.", 403);

        this.details = description;
    }
}