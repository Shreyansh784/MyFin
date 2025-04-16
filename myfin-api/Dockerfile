# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client & build the project
RUN npx prisma generate && \
    npm run build && \
    npm prune --production

# ---------- Production Stage ----------
FROM node:20-alpine

ARG VERSION="custom-local-build"

LABEL maintainer="Shreyansh Rajesh Kumbhare <shreyansh7804@gmail.com>"
LABEL version="${VERSION}"
LABEL description="Custom MyFin Backend API built locally"

WORKDIR /app

RUN apk --no-cache add curl openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY .env .env  

# Startup Script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting MyFin Backend..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy || echo "No migrations to apply"' >> /app/start.sh && \
    echo 'node dist/server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/ || exit 1

EXPOSE 3001

CMD ["/app/start.sh"]
