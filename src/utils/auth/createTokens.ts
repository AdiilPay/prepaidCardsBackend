import jwt from "jsonwebtoken";

import {Admin} from "@prisma/client";

export default function createToken(admin : Admin): string {

    return jwt.sign({id: admin.id}, process.env.SECRET_KEY as string, {expiresIn: '14h'});

}