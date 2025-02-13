import {Request, Response, NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import prismaClient from "@prismaClient";
import {AuthenticatedRequest} from "@utils/auth/AuthenticatedRequest";
import InvalidTokenError from "@errors/InvalidTokenError";

export default async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ").length !== 2) {
            throw new InvalidTokenError();
        }

        const token = authHeader.split(" ")[1];

        try {
            const data = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;


            const admin = await prismaClient.admin.findUnique({
                where: {id: data.id}
            });

            if (!admin) {
                throw new InvalidTokenError();
            }

            (req as AuthenticatedRequest).admin = admin;

            next();

        } catch (e) {
            throw new InvalidTokenError();
        }

    } catch (e) {next(e);}
}
