export default class AppError extends Error {

    statusCode: number;
    details?: any;


    constructor(message: string, statusCode: number, details?: any) {
        super();

        this.message = message;
        this.statusCode = statusCode;
        this.details = details;

        Object.setPrototypeOf(this, AppError.prototype);
    }

}