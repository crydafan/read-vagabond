FROM node:22-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV DB_FILE_NAME=file:/app/local.db

RUN corepack enable && apk add --no-cache sqlite

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY astro.config.ts drizzle.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public
COPY drizzle ./drizzle
COPY seeds ./seeds

RUN pnpm drizzle-kit migrate && \
    for f in seeds/*.sql; do sqlite3 /app/local.db < "$f"; done && \
    pnpm build

FROM nginx:alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
