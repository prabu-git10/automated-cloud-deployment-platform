FROM node:24-alpine

WORKDIR /app

# Update npm to the latest npm 11 release
RUN npm install -g npm@11.19.0

COPY package*.json ./

RUN npm ci --omit=dev

COPY server.js ./

EXPOSE 5000

CMD ["node", "server.js"]