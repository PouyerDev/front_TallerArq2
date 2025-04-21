# Etapa 1: Construcción
FROM node:20 AS build

WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación Angular
RUN npm run build -- --output-path=dist/browser --base-href=/

# Etapa 2: Servidor NGINX
FROM nginx:alpine

# Copiar los archivos construidos al servidor NGINX
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copiar configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]