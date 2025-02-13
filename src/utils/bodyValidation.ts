import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import DataError from "@errors/DataError";

export default function validateData<T extends z.ZodType<any, any>>(schema: T) {
    return (req: Request<{}, {}, z.infer<T>>, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue) => (
                    `${issue.path.join(".")} is ${issue.message}`
                ));

                error = new DataError(errorMessages);
            }

            next(error);
        }
    };
}
