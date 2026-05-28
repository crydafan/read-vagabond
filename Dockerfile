FROM node:22-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

FROM deps AS build

WORKDIR /app

COPY astro.config.ts drizzle.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public

RUN pnpm build

FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV DB_FILE_NAME=file:/data/local.db

RUN apk add --no-cache sqlite

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

VOLUME ["/data"]

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]