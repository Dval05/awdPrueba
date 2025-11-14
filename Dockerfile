FROM node:18-alpine
WORKDIR /app

# Instalación de dependencias
COPY package.json package-lock.json* ./
RUN npm install --production

# Copiar código necesario (omitimos carpeta PHP legacy)
COPY server ./server
COPY js ./js
COPY css ./css
COPY HTML ./HTML
COPY img ./img
COPY vendor ./vendor
COPY tools ./tools

# Variables de entorno (Render inyecta PORT)
ENV PORT=8080
EXPOSE 8080

# Comando de arranque
CMD ["node","server/index.js"]
