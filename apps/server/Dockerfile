FROM node:20-alpine AS base

RUN apk add --no-cache gcompat
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app

COPY package.json tsconfig.json src ./

RUN pnpm install && \
    pnpm build && \
    pnpm prune --prod

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono

# EXPOSE 8080
# ENV PORT 8080

CMD ["npm", "start"]
