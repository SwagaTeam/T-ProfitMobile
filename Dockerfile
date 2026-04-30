FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npx expo export --platform web

FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY <<< 'server {
    listen 8081;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}' /etc/nginx/conf.d/default.conf

EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]
