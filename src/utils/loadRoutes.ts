import { readdirSync } from 'fs';
import { join } from 'path';
import express, {Express} from "express";

export default (app : Express) => {
    // On récupère le chemin du dossier /endpoints
    const routesDir = join(__dirname, '../endpoints');
    const files = readdirSync(routesDir);

    files.forEach((file) => {
        // Importer chaque fichier du dossier /endpoints
        const route = require(join(routesDir, file)).default;
        route.use(express.json());
        app.use(route);
    });
};