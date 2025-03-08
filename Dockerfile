# Utilise une image de base Node.js avec une version LTS (Long Term Support)
FROM node:22

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de configuration (package.json et package-lock.json)
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install --legacy-peer-deps

# Copie le reste du code source
COPY . .

# Expose le port de l'application (remplacez 3000 par le port utilisé par votre application)
EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]