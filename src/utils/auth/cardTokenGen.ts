import ServerCard from "@serverObjects/card";

import jwt from "jsonwebtoken";

export default function createToken(card : ServerCard){

    // token qui sera stocké sur la carte, pour vérifier l'authenticité de la carte.

    return jwt.sign({id: card.id}, "xRYKazdn$@V0Vng57dcfurY3%3B3j*N0U3Y^CbVV3U0h15*qsS7GU8R6Xw@Rmw1e" )// process.env.SECRET_KEY as string);

}
