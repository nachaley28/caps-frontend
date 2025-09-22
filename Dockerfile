FROM node:20-alpine AS builder

WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY app ./

RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
