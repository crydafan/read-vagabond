# AGENTS.md

This document contains guidelines and commands for agentic coding agents working in the read-vagabond repository.

## Project Overview

This is a manga reader application built with Astro, serving Takehiko Inoue's Vagabond manga with a minimalist, high-quality reading experience. The reader is a **fully static site** (Astro SSG): all pages are pre-rendered at build time from a local SQLite database, and manga images are served from Bunny CDN.

A separate Cloudflare Worker (`mihon/`) exposes a small read-only API consumed by the Mihon/Keiyoushi browser extension. This is the only part of the project still running on Cloudflare.

> **Note:** This project was migrated off Cloudflare Workers/Pages (SSR, D1, R2). If you find references to D1, R2, the Cloudflare adapter, `Astro.locals.runtime`, or cache middleware in older docs or code, they are legacy and should not be reintroduced in the main app.

## Build & Development Commands

### Core Commands

```bash
# Development
pnpm dev              # Start Astro dev server
pnpm build            # Build the static site to dist/
pnpm preview          # Preview the production build locally

# Astro CLI
pnpm astro <command>  # Run any Astro CLI command
```

### Database Commands

The database layer is encapsulated in `@readbagabondo/db` (`packages/db/`). The reader reads from a local SQLite file (`packages/db/local.db`, committed to the repo) via Drizzle ORM. Schema is defined in `packages/db/src/schema.ts`, queries in `packages/db/src/queries.ts`, and the Drizzle client in `packages/db/src/client.ts`.

```bash
# Generate a migration from schema changes (packages/db/src/schema.ts)
pnpm db:generate

# Apply migrations to local.db
pnpm db:migrate

# Inspect/browse the database
pnpm db:studio
```

Seeds live in `packages/db/seeds/` and are applied directly to the SQLite file:

```bash
sqlite3 packages/db/local.db < packages/db/seeds/0000_seed_vagabond_metadata.sql
```

Because the static build reads `packages/db/local.db` at build time, the database file is committed so builds are reproducible. Regenerate/seed it locally if you change the schema or data, then commit the updated `packages/db/local.db`.

### Testing

No dedicated test framework is currently configured. Manual testing should be performed by:

1. Running `pnpm dev` and testing all user flows
2. Running `pnpm build && pnpm preview` to validate the static output
3. Verifying responsive design across devices and both light/dark themes

## Architecture & Tech Stack

- **Framework**: Astro v6 with `output: "static"` (SSG)
- **Database**: Local SQLite (`packages/db/local.db`) accessed at build time via `@readbagabondo/db` (Drizzle ORM + `@libsql/client`)
- **Migrations**: drizzle-kit, output to `packages/db/drizzle/migrations/`
- **Image CDN**: Bunny CDN (`https://vagabond.b-cdn.net/`)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`) with Flowbite components
- **State**: nanostores (reader UI state)
- **Mihon API**: separate Cloudflare Worker (`mihon/`) built with Hono, backed by D1
- **Package manager**: pnpm workspace (`pnpm-workspace.yaml`) — root reader app + `packages/db` + `mihon` worker

## Code Style Guidelines

### File Organization

```txt
src/
├── pages/                          # Astro file-based routing (all statically rendered)
│   ├── index.astro                 # Homepage
│   ├── 404.astro
│   ├── sitemap.xml.ts              # Generated sitemap
│   ├── volume-[volume]/            # Volume + chapter routes (getStaticPaths)
│   └── volume-[volume]/chapter-[chapter]/
├── layouts/                        # BaseLayout, MainLayout, ChapterLayout
├── components/                     # UI components (.astro)
├── feature/reader/store.ts         # nanostores reader state
├── lib/                            # Page URLs (page.ts), metadata
├── styles/                         # Global styles and Tailwind imports
└── env.d.ts                        # Astro client type reference

packages/
└── db/                             # @readbagabondo/db (schema, client, queries, drizzle config)
    ├── src/
    │   ├── schema.ts
    │   ├── client.ts
    │   ├── queries.ts
    │   └── index.ts
    ├── drizzle/
    │   └── migrations/             # Generated SQL migrations
    ├── seeds/                      # SQL seed data for local.db
    ├── drizzle.config.ts
    ├── local.db                    # Committed SQLite database for SSG build
    ├── package.json
    └── tsconfig.json

mihon/                              # Cloudflare Worker (Hono) for the extension API
manga/                              # Image source + bunny-upload.sh (rclone -> Bunny CDN)
```

### Imports

- Use package import for database: `import { getMangaVolumes } from "@readbagabondo/db"`
- Use relative imports for internal modules: `import { buildPageUrl } from "../lib/page"`
- Use absolute imports for dependencies: `import type { GetStaticPaths } from "astro"`
- Group imports: 1) Astro imports, 2) third-party, 3) local imports
- Type imports use `import type` when possible

### TypeScript Patterns

- Strict TypeScript config (extends `astro/tsconfigs/strict`)
- Prefer letting Drizzle infer query result types; add explicit annotations for function parameters and returns
- Leverage Astro's built-in types: `GetStaticPaths`, `APIRoute`, `AstroGlobal`

### Astro Components

- Use frontmatter (---) for build-time logic and data fetching
- Pages with dynamic params (`[volume]`, `[chapter]`) **must** export `getStaticPaths` so every page is pre-rendered
- Use HTML5 semantic elements appropriately
- Include proper meta tags for SEO and accessibility (see `MetadataTags`)
- Use `Astro.redirect("/")` for invalid params

### Database Operations (Drizzle ORM)

- Import queries and schema from `@readbagabondo/db`
- All query helpers live in `packages/db/src/queries.ts` — add new queries there rather than querying inline in pages
- Use Drizzle's query builder (`db.select(...).from(...).where(eq(...))`); avoid raw SQL except where aggregation requires it
- Table aliases (e.g. author/artist on `authorsTable`) are defined in `packages/db/src/queries.ts`
- Helpers return a single row or `undefined` for by-id/by-number lookups; handle the empty case in the caller

### Styling Guidelines

- Use Tailwind utility classes for layout and spacing
- Use Flowbite components for UI elements
- Support light/dark themes (see `ThemeToggle`); use theme-aware utility classes
- Custom CSS only for animations or complex interactions
- Mobile-first responsive design approach

### Naming Conventions

- Files: kebab-case for pages/routes (`volume-[volume].astro`), PascalCase for components/layouts
- Variables: camelCase, descriptive names
- Constants: UPPER_SNAKE_CASE for static values
- Functions: verb-based names (`getMangaVolumes`, `buildPageUrl`)

### Security Best Practices

- Validate and sanitize route parameters before use
- Use Drizzle's parameterized query builder (never string-concatenate SQL)
- Never expose secrets in client code or commit them
- For the mihon Worker, validate path params and return appropriate status codes

## State Management

### Reader State (nanostores)

The reader uses nanostores for lightweight reactive client-side state.

**Location**: `src/feature/reader/store.ts`

```typescript
const currentPage = atom<number>(0); // Current page index
const percentageRead = atom<number>(0); // Reading progress percentage
const navbarVisibility = atom<boolean>(true); // UI navbar toggle
const isProgrammaticScroll = atom<boolean>(false); // Scroll source flag
```

Usage:

- Import atoms from `src/feature/reader/store.ts`
- Subscribe with `subscribe()` and update with `set()` / `update()`
- Keep store values immutable

## Components & Layouts

### Layouts (`src/layouts/`)

- `BaseLayout.astro` — base HTML shell, head, theme handling
- `MainLayout.astro` — homepage/volume pages layout
- `ChapterLayout.astro` — reading interface layout

### Components (`src/components/`)

- `ArrowIcon.astro` — navigation arrow icon
- `ArrowKeysHint.astro` — keyboard navigation hint
- `ChapterList.astro` — list of chapters for a volume
- `ChapterNavigation.astro` — chapter navigation controls
- `CopyButton.astro` — copy-to-clipboard (used for crypto donation addresses)
- `Footer.astro` — page footer
- `MetadataTags.astro` — SEO meta tags and structured data
- `Navigation.astro` — main navigation bar
- `PageViewer.astro` — cascade reader component (main reading interface)
- `ProgressBar.astro` — reading progress bar
- `ThemeToggle.astro` — light/dark theme switch
- `VolumeCard.astro` — volume preview card
- `VolumeCover.astro` — volume cover image
- `VolumeInformation.astro` — volume metadata display

## Image Delivery

Manga images are served from **Bunny CDN**:

- **Cover URL**: `https://vagabond.b-cdn.net/covers/volume-<n>.jpg`
- **Page URL**: `https://vagabond.b-cdn.net/chapter-<chapter>/page-<page>.png`
- URL builders live in `src/lib/page.ts` (`buildVolumeCoverUrl`, `buildPageUrl`)

### Uploading images

Source images live under `manga/chapter-*/`. They are synced to Bunny CDN with rclone via `manga/bunny-upload.sh` (configure a `bunny:` rclone remote). **No scans are committed to the repository.**

### Image Loading Strategy

- Use `loading="lazy"` for chapter images to optimize initial page load
- Preload cover images for improved perceived performance

## SEO & Structured Data

**Location**: `src/lib/metadata.ts`

Supported schemas:

- **WebSite** — site-level metadata and search action
- **ComicSeries** — Vagabond series metadata
- **BreadcrumbList** — navigation breadcrumbs (volume, chapter)
- **Book** — per-volume metadata
- **ComicIssue** — per-chapter metadata

Usage:

- Inject structured data via the `<MetadataTags>` component in the page head
- A `sitemap.xml` is generated at `src/pages/sitemap.xml.ts`
- Verify structured data with Google Rich Results Test

## Mihon API Worker (`mihon/`)

A small read-only HTTP API consumed by the Mihon/Keiyoushi browser extension.

- **Stack**: Cloudflare Worker + Hono, backed by D1 (`bagabondo-db`)
- **Config**: `mihon/wrangler.jsonc` (binding `bagabondo_db`)
- **Routes** (`mihon/src/index.ts`):
  - `GET /mangas`
  - `GET /mangas/:mangaId`
  - `GET /mangas/:mangaId/chapters`
  - `GET /mangas/:mangaId/chapters/:chapterId`
- **Commands** (run from `mihon/`):

```bash
pnpm wrangler dev                 # Local development
pnpm wrangler deploy --minify     # Deploy
pnpm wrangler types               # Regenerate CloudflareBindings types
```

When changing the API contract, document breaking changes and notify external integration maintainers (Keiyoushi extension).

## Special Considerations

### Manga Content

- This application serves copyrighted manga content for personal reference only
- All content must be properly licensed or fall under fair use
- **Never include actual manga scans in the repository**
- Respect copyright notices and licensing terms

## Deployment Notes

- **Reader**: `pnpm build` produces a static site in `dist/` that can be served from any static host or CDN. (Cloudflare Pages/Workers auto-deploy and the previous Docker/nginx setup have been removed; there is no in-repo CI deploy config on this branch.)
- **Database**: regenerate/seed `local.db` locally and commit it; the static build reads it at build time
- **Images**: sync to Bunny CDN via `manga/bunny-upload.sh`
- **Mihon Worker**: deployed separately to Cloudflare with `pnpm wrangler deploy --minify` from `mihon/`

## Development Workflow

### Trunk-Based Development

This project uses trunk-based development with `main` as the primary branch:

- All feature branches are created from `main`
- All PRs merge directly to `main`
- No long-lived development branches

**Branch strategy**:

- `main`: production trunk
- `feat/*`: short-lived feature branches
- `fix/*`: short-lived bug fix branches
- `infra/*`: infrastructure/migration branches
- `docs/*`: documentation update branches

**Workflow**:

1. Create a branch from `main`
2. Develop and test locally (`pnpm dev`, `pnpm build && pnpm preview`)
3. Open a PR targeting `main`
4. CodeRabbit review + build checks
5. Maintainer approval required
6. Merge to `main`

### Breaking Changes

When changing the mihon API or database schema:

- Document all breaking changes in the PR description
- Provide a migration path where relevant
- Notify external integration maintainers (Keiyoushi extension)
- Require maintainer approval for database schema changes

### PR Testing

**Local testing** (your own changes):

```bash
pnpm dev                       # Astro dev server
pnpm build && pnpm preview     # Static production build
```

**Testing others' PRs** (for code review):

```bash
gh pr checkout <pr-number>
pnpm install
pnpm dev
```
