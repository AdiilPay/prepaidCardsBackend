import express from 'express';

import dotenv from 'dotenv';
import loadRoutes from "@utils/loadRoutes";

dotenv.config();

const app = express();

app.use(express.json());

// On charge dynamiquement toutes les endpoints
loadRoutes(app);

// Démarrer le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
