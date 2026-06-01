FROM node:26-alpine AS builder

RUN apk add --no-cache libc6-compat

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . ./
ARG NEXT_PUBLIC_BUILD_NUMBER
ARG NEXT_PUBLIC_GIT_SHA
ENV NEXT_PUBLIC_BUILD_NUMBER=$NEXT_PUBLIC_BUILD_NUMBER
ENV NEXT_PUBLIC_GIT_SHA=$NEXT_PUBLIC_GIT_SHA
RUN npm run build

FROM node:26-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV TICKET_GENERATOR_JSON_LOGS=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/scripts/node-json-console.mjs ./scripts/node-json-console.mjs

USER nextjs
EXPOSE 3000

CMD ["node", "--import", "./scripts/node-json-console.mjs", "server.js"]
