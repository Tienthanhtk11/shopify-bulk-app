# SubBulk — Shopify Remix app (production image cho VM / dev store)
#
# Build:
#   docker build -t subbulk .
#
# Chạy (thay URL & secret; volume giữ SQLite giữa các lần restart):
#   docker run --rm -p 3000:3000 \
#     -e SHOPIFY_API_KEY=xxx -e SHOPIFY_API_SECRET=xxx \
#     -e SCOPES='read_products,write_products,...' \
#     -e SHOPIFY_APP_URL=https://your-domain.example \
#     -v subbulk-data:/app/data \
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
ENV DATABASE_URL=file:dev.sqlite
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

# SQLite trên volume riêng (không mount đè cả /app/prisma → vẫn giữ migrations trong image)
ENV DATABASE_URL=file:/app/data/subbulk.sqlite
RUN mkdir -p /app/data \
  && npx prisma generate \
  && chown -R node:node /app

USER node
EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

# migrate deploy + remix-serve (theo package.json)
CMD ["npm", "run", "docker-start"]
