import jwt from "jsonwebtoken";

import {Admin} from "@prisma/client";

export default function createToken(admin : Admin): string {

    const tokenExp = process.env.NO_TOKEN_EXPIRATION as unknown as boolean ? '3650d' : '14h';

    return jwt.sign({id: admin.id}, process.env.SECRET_KEY as string, {expiresIn: tokenExp});

}