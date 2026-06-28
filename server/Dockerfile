FROM node:22-slim

WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Railway injects PORT; default for local
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
