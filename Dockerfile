# ==============================================================================
# Production Dockerfile optimized for Coolify & Self-Hosted PaaS
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Client build arguments passed by Coolify
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_APP_URL

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_APP_URL=$VITE_APP_URL
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NITRO_PRESET="node-server"
ENV NODE_ENV="production"

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==============================================================================
# Lightweight Runner Container (< 120MB)
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV NODE_OPTIONS="--max-old-space-size=384"

# Non-root security
USER node

COPY --chown=node:node --from=builder /app/.output ./.output
COPY --chown=node:node --from=builder /app/package.json ./package.json

EXPOSE 3000 8080

CMD ["node", ".output/server/index.mjs"]
