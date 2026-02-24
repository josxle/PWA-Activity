# Etapa 1: Build - Compilar la aplicación React + Vite
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Etapa 2: Production - Servir archivos estáticos con Nginx
FROM nginx:stable-alpine

# Crear directorio de logs
RUN mkdir -p /var/log/nginx

# Copiar archivos compilados del builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear directorio para certificados SSL (será montado en tiempo de ejecución)
RUN mkdir -p /etc/nginx/certs

# Exponer puertos
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/index.html || exit 1

# Ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
