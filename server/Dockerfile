FROM node:22-slim

WORKDIR /app

# sharp needs these system libs on Debian slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Railway injects PORT; default for local
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
