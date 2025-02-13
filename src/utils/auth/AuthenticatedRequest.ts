import { Request } from "express";
import { Admin } from "@prisma/client";

export interface AuthenticatedRequest<T = any> extends Request {
    admin?: Admin;
    body: T;
}
