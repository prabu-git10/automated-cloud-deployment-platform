FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY config ./config
COPY routes ./routes
COPY services ./services
COPY server.js ./

RUN npm uninstall -g npm

EXPOSE 5000

CMD ["node", "server.js"]