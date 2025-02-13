import AppError from "./AppError";

export default class InsufficientBalanceError extends AppError {
    constructor() {
        super("The balance is insufficient to perform this operation", 402);
    }
}