import ServerAgent from "@serverObjects/agent";

import jwt from "jsonwebtoken";

export default function createToken(agent : ServerAgent){

    return jwt.sign({login: agent.login, id: agent.id}, process.env.SECRET_KEY as string, {expiresIn: '14h'});

}