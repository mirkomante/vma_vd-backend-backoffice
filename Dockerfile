# Build e runtime Next.js standalone (Cloud Run). Node LTS — allineato a `engines` in package.json.
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Placeholder solo per `next build` (nessun DB in fase di build). Valori reali su Cloud Run (Secret Manager).
ENV PAYLOAD_SECRET=build-time-placeholder-not-for-runtime
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
ENV NEXT_PUBLIC_URL=http://localhost:3000
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
