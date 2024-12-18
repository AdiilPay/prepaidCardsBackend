import ServerAgent from "@dbObjects/Agent";

import jwt from "jsonwebtoken";

export default function createToken(agent : ServerAgent){

    return jwt.sign({id: agent.id}, process.env.SECRET_KEY as string, {expiresIn: '14h'});

}