# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ---------- Serve Stage ----------
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Add metadata
LABEL maintainer="Shreyansh Rajesh Kumbhare <shreyansh7804@gmail.com>"
LABEL version="8.1.0"
LABEL description="MyFin Frontend Application"
LABEL org.opencontainers.image.authors="Shreyansh Rajesh Kumbhare <shreyansh7804@gmail.com>"
LABEL org.opencontainers.image.version="8.1.0"
LABEL org.opencontainers.image.title="MyFin Frontend"
LABEL org.opencontainers.image.description="Web frontend for the personal finances platform that'll help you budget, keep track of your income/spending and forecast your financial future."

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|myfin-api-url-placeholder|$VITE_MYFIN_BASE_API_URL|g" {} +' >> /start.sh && \
    echo "nginx -g 'daemon off;'" >> /start.sh && \
    chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/ | grep -q '<title>MyFin Budget</title>' || exit 1

# Start nginx
CMD ["/start.sh"]
