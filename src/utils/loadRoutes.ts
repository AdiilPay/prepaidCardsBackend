import {readdirSync} from 'fs';
import {join} from 'path';
import express, {Express} from "express";
import errorHandler from "@utils/errorHandler";

export default (app: Express) => {
    // On récupère le chemin du dossier /endpoints
    const routesDir = join(__dirname, '../endpoints');
    const files = readdirSync(routesDir);

    files.forEach((file) => {
        // Importer chaque fichier du dossier /endpoints
        const route = require(join(routesDir, file)).default;
        app.use(express.json());
        app.use(errorHandler);
        app.use(route);
    });

    app.use((req, res) => {
            res.status(404).json({error: 'Not Found'});
        }
    );
};