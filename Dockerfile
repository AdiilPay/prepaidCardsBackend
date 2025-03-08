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

# Définit les permissions pour le script entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]