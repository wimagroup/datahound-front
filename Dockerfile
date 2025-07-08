# Etapa de build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Corrigido: usar npx para build Angular em produção
RUN npx ng build --configuration production

# Etapa de produção
FROM nginx:alpine

COPY --from=build /app/dist/datahound-web /usr/share/nginx/html

# Remove configuração default do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adiciona configuração customizada
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
