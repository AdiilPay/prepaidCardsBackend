import AppError from "./AppError";

export default class DisabledCardUseError extends AppError {

    constructor() {
        super("This card has been disabled and can’t be used anymore.", 403);

    }
}