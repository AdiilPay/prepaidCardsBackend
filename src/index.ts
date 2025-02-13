import express from 'express';

import dotenv from 'dotenv';
import loadRoutes from "@utils/loadRoutes";

import errorHandler from "@utils/errorHandler";
import prisma from "@prismaClient";

dotenv.config();

const app = express();

// On ajoute une méthode toJSON pour les BigInt parce que, evidemment, JS ne sait pas les gérer
// @ts-ignore
BigInt.prototype.toJSON = function () {
    return String(this);
};

// Middleware pour parser le JSON, avec une gestion d'erreur
app.use(express.json());

// On charge dynamiquement toutes les endpoints
loadRoutes(app);

app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
