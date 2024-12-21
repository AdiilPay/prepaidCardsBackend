import express from 'express';

import dotenv from 'dotenv';
import loadRoutes from "@utils/loadRoutes";

import errorHandler from "@utils/errorHandler";

dotenv.config();

const app = express();

// On ajoute une méthode toJSON pour les BigInt parce que, evidemment, JS ne sait pas les gérer
// @ts-ignore
BigInt.prototype.toJSON = function () {
    return String(this);
};

// Middleware pour parser le JSON, avec une gestion d'erreur
app.use(express.json());
app.use(errorHandler);


// On charge dynamiquement toutes les endpoints
loadRoutes(app);

// Démarrer le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
