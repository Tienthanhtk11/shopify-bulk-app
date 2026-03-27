# SubBulk — Shopify Remix app (production image cho VM / dev store)
#
# Build:
#   docker build -t subbulk .
#
# Chạy (thay URL, secret, DATABASE_URL Postgres):
#   docker run --rm -p 3000:3000 \
#     -e SHOPIFY_API_KEY=xxx -e SHOPIFY_API_SECRET=xxx \
#     -e SCOPES='read_products,write_products,...' \
#     -e SHOPIFY_APP_URL=https://your-domain.example \
#     -e DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public \
#     subbulk
#
# Hoặc: docker compose up --build (cần file .env từ .env.example)

FROM node:22-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# --- Cài dependency (kèm dev để build) ---
FROM base AS deps
COPY package.json package-lock.json ./
COPY extensions/subbulk-buy-box/package.json ./extensions/subbulk-buy-box/
RUN npm ci

# --- Build Remix + Prisma client ---
FROM deps AS builder
COPY . .
# generate không cần DB thật nhưng schema dùng env("DATABASE_URL")
ENV DATABASE_URL=postgresql://subbulk:build@localhost:5432/subbulk?schema=public
RUN npx prisma generate
ENV NODE_ENV=production
RUN npm run build

# --- Runtime: chỉ production deps + artifact build ---
FROM base AS runner
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY extensions/subbulk-buy-box/package.json ./extensions/subbulk-buy-box/
RUN npm ci --omit=dev && npm cache clean --force

COPY prisma ./prisma
COPY --from=builder /app/build ./build

# Runtime: DATABASE_URL do docker-compose / -e cung cấp (Postgres)
ENV DATABASE_URL=postgresql://subbulk:runtime@localhost:5432/subbulk?schema=public
RUN npx prisma generate \
  && chown -R node:node /app

USER node
EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

# migrate deploy + remix-serve (theo package.json)
CMD ["npm", "run", "docker-start"]
