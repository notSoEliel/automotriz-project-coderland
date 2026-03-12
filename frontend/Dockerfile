# Etapa 1: Construcción
FROM node:24-slim AS build
WORKDIR /app
# Copiamos solo los archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install
# Copiamos el resto del código y construimos la versión optimizada de producción
COPY . .
RUN npm run build

# Etapa 2: Servidor de Producción (Nginx)
FROM nginx:alpine
# Copiamos la carpeta 'dist' (resultado del build de Vite) al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Truco vital para React Router: Forzamos a Nginx a redirigir todas las rutas al index.html
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]