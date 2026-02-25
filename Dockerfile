FROM node:lts-alpine3.23 AS base


# deps
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci



# builder
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build



# runner
FROM base AS runner

WORKDIR /app

# COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]