FROM node:24-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Remove npm from the runtime image
RUN npm uninstall -g npm

# Copy application
COPY server.js ./

EXPOSE 5000

CMD ["node", "server.js"]