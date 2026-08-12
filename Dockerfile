# agent-notes: { ctx: "multi-stage production Dockerfile for Vite SPA with Nginx", deps: [nginx.conf, frontend/package.json], state: active, last: "ines@2026-08-08" }

# Stage 1: Build application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and frontend package files
COPY package.json ./
COPY frontend/package.json frontend/package-lock.json* ./frontend/

# Install frontend dependencies
RUN cd frontend && npm ci || cd frontend && npm install

# Copy application source code
COPY frontend ./frontend

# Build frontend production bundle
RUN npm run build

# Stage 2: Serve application with Nginx Alpine
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
