import AppError from "./AppError";

export default class AuthenticationError extends AppError {
    constructor() {
        super("Wrong login or password", 401);
    }
}