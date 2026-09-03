# Contributing to Read Vagabond Manga

Thank you for your interest in contributing to Read Vagabond Manga! We welcome all contributions and are excited to have you join our project.

## Project Overview

Read Vagabond Manga is a manga reader web application for Takehiko Inoue's masterpiece Vagabond. Built with Astro and deployed on Cloudflare Workers, it provides a minimalist, high-quality reading experience using D1 database for metadata and R2 for image storage.

> **Important**: This software is licensed under the MIT License, but this license does NOT grant any rights to manga content. Vagabond © Takehiko Inoue / Kodansha. This site is unofficial and provides content for personal reference only. All rights remain with the original creators and publishers.

**NO SCANS ARE PROVIDED IN THIS REPOSITORY.**

## Current Development Priorities

### Major Feature Development

We're actively working on these high-impact features:

1. **Single Page Reader (Alternative Reading Mode)**
   - Implement single-page horizontal navigation as an alternative to current cascade layout
   - Canvas-based rendering with smooth page flip transitions
   - Thumbnail navigation sidebar/bottom panel
   - Reading progress indicator adapted for single-page navigation
   - RTL mode: mirrored navigation controls, reversed keyboard shortcuts (← becomes next, → becomes previous)
   - Mobile gesture support implementation
   - Page preloading for smooth transitions

2. **Dark Mode Implementation**
   - Theme system with manual toggle
   - Integration with Tailwind/Flowbite patterns
   - Theme persistence via localStorage
   - No automatic dark mode based on system preference

3. **Comment Sections (per Chapter & Volume)**
   - Database schema design for chapter/volume comments
   - API routes for comment CRUD operations
   - UI components using existing Tailwind/Flowbite patterns
   - Reading progress tracking per chapter

4. **Chapter Selection UI Improvements**
   - Manual chapter navigation within reader interface (currently requires going back to volume page)
   - Integration with volume/chapter data structure
   - Reading progress display for each chapter

### Mihon API Modernization

- **Current Status**: Mihon API v1 is in production and will be deprecated
- **Next Phase**: Mihon API v2 is in design/thinking phase (not yet implemented)
- **Breaking Changes**: v2 will introduce breaking changes; Keiyoushi extension will need updates

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Git
- Cloudflare account (for deploying to production, optional for local development)

### Setup for Contributors

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone <your-fork-url>
cd read-vagabond

# 3. Install dependencies
pnpm install

# 4. Set up local SQLite database (packages/db/local.db is committed and ready)
# If regenerating from seeds:
sqlite3 packages/db/local.db < packages/db/seeds/0000_seed_vagabond_metadata.sql

# 5. Create a feature branch from main
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
# Examples:
# git checkout -b feat/single-page-reader
# git checkout -b feat/dark-mode
# git checkout -b fix/reading-progress

# 6. Start development server
pnpm dev               # Local development server for the static reader
```

### Database Setup Details

The application reader is a fully static site (SSG) that reads metadata from a local SQLite database (`packages/db/local.db`) via Drizzle ORM and `@libsql/client`:

- **Database Package**: `@readbagabondo/db` in `packages/db/`
- **Database File**: `packages/db/local.db` (committed for reproducible builds)
- **Migrations**: `packages/db/drizzle/migrations/`
- **Seeds**: `packages/db/seeds/`

**Database Commands**:

```bash
# Generate migrations
pnpm db:generate

# Apply migrations to local.db
pnpm db:migrate

# Inspect database
pnpm db:studio
```

### Development Commands

```bash
pnpm dev               # Start Astro development server
pnpm build             # Build static site to dist/
pnpm preview           # Preview production build locally
```

### Cloudflare Authentication (Optional)

- **For Local Development**: No Cloudflare account required - wrangler works locally
- **For Deployment**: Cloudflare account needed for `git push` to main branch (auto-deploys)
- **For Remote Database Testing**: Cloudflare account needed for `wrangler d1 execute --remote`

**Login to Cloudflare (when needed)**:

```bash
pnpm wrangler login     # Login to Cloudflare account
pnpm wrangler whoami    # Verify authentication
```

## Feature-Specific Implementation Guidelines

### Single Page Reader Implementation

**Current State**: Vertical cascade layout with continuous scrolling (default reader)
**Target State**: Single page horizontal navigation as optional alternative mode with LTR/RTL support

**Technical Requirements**:

- Use canvas for page rendering (not image elements)
- Implement page flip transitions between pages
- Add thumbnail navigation panel (sidebar or bottom)
- Show reading progress for single-page navigation
- RTL Mode: Mirror navigation controls, reverse keyboard shortcuts
- Mobile: Implement swipe gestures for page navigation
- Performance: Preload next/previous pages for smooth transitions

**Files to Modify**:

- `src/pages/volume-[volume]/chapter-[chapter]/index.astro` (main reading interface)
- `src/feature/reading/` (add reading direction context)
- `src/styles/global.css` (add canvas and transition styles)

### Dark Mode Implementation

**Current State**: Light theme only, no theme system
**Target State**: Manual dark mode toggle with persistence

**Technical Requirements**:

- Create theme context/store for state management
- Add dark mode classes to Tailwind configuration
- Implement theme toggle UI component
- Store theme preference in localStorage
- Update all page templates to use theme classes

**Files to Modify**:

- `src/feature/theme/` (add theme context)
- `src/styles/global.css` (dark mode CSS variables)
- All page templates (add theme class bindings)

### Comment System Implementation

**Current State**: No comment functionality
**Target State**: Per chapter and volume discussions

**Technical Requirements**:

- Design database schema for comments (users, comments, reactions)
- Create API routes for CRUD operations
- Build comment UI components using Tailwind/Flowbite
- Integrate with existing chapter/volume structure

**Files to Create/Modify**:

- `migrations/` (add comment database schema)
- `src/feature/comments/` (add comment functions)
- Page templates (add comment components)

### Chapter Selection UI Implementation

**Current State**: Users must go back to volume page to change chapters
**Target State**: Chapter selection within reading interface

**Technical Requirements**:

- Add chapter navigation dropdown/sidebar in reader
- Display reading progress per chapter
- Integrate with existing volume/chapter data structure

**Files to Modify**:

- `src/pages/volume-[volume]/chapter-[chapter]/index.astro` (add chapter selector)

### Mihon API v2 Development

**Current State**: Mihon API v1 with hardcoded values and workarounds
**Target State**: Redesigned API supporting multiple works and localization

**Technical Requirements**:

- Remove hardcoded values and workarounds
- Design flexible API structure for multiple manga works
- Support for multi-language/localization
- Integration with manga reader applications

**Note**: v2 is currently in design/thinking phase. Once specification is complete, API will be refactored as a short-lived feature branch merged to `main`.

## Branch Strategy & Submission Process

### Trunk-Based Development

This project uses **trunk-based development** with `main` as the primary development branch:

- `main`: Primary development trunk (auto-deploys to production on merge)
- Feature branches: Short-lived, created from and merged directly to `main`
- No long-lived development branches

### Branch Structure

- `main`: Production trunk (all development happens here)
- `feat/*`: Feature branches (short-lived)
- `fix/*`: Bug fix branches (short-lived)
- `mihon-api-v2/*`: API v2 feature branches (short-lived)
- `docs/*`: Documentation update branches

### Branch Naming Conventions

- Features: `feat/single-page-reader`, `feat/dark-mode`, `feat/comment-system`
- **Breaking API changes**: Follow breaking changes policy (see above)
- **Version API endpoints**: Use `/api/v1/`, `/api/v2/` for breaking changes

### Hotfixes & Bug Resolution

**If a bug is discovered in production after merge**:

1. **Create hotfix branch from `main`**:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b fix/critical-bug-name
   ```

2. **Fix the issue** with minimal changes
3. **Open PR targeting `main`** with `[HOTFIX]` prefix in title
4. **Fast-track review** by maintainer
5. **Merge and auto-deploy** to production

**Forward-fix strategy**: We fix forward, not rollback. Cloudflare deployments are fast enough to patch issues quickly.

**For critical production outages**: Maintainer may manually rollback via Cloudflare dashboard while hotfix is prepared.

- Bug fixes: `fix/reading-progress`, `fix/navigation-issue`, `fix/cache-headers`
- API work: `mihon-api-v2/endpoints`, `mihon-api-v2/schema`, `mihon-api-v2/localization`
- Documentation: `docs/update-contributing`, `docs/api-migration-guide`

### Pull Request Workflow

1. **Fork the repository**
2. **Clone your fork locally**
3. **Create feature branch from `main`**:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/your-feature-name
   ```

4. **Develop and test your changes locally**
5. **Push to your fork**: `git push origin feat/your-feature-name`
6. **Open pull request targeting `main` branch**
7. **CodeRabbit automatically reviews your PR**
8. **Cloudflare builds check passes**
9. **Address review feedback**
10. **Maintainer approves PR** (after CodeRabbit review + passing Cloudflare build)
11. **Merge to `main`** → automatic production deployment

### Testing Your PR

**Local Testing** (required before opening PR):

```bash
pnpm dev                      # Test locally with Astro dev server
pnpm wrangler dev             # Test with Cloudflare Workers runtime
pnpm build && pnpm preview    # Test production build locally
```

**Testing Others' PRs** (for reviewers and contributors):

```bash
# Using GitHub CLI
gh pr checkout <pr-number>

# Or manually
git fetch origin pull/<pr-number>/head:pr-<pr-number>
git checkout pr-<pr-number>

# Then test locally
pnpm install
pnpm dev
```

### Merge Requirements

Before a PR can be merged to `main`:

1. **CodeRabbit review passed** (automated)
2. **Cloudflare build successful** (automated)
3. **Maintainer approval** (manual)
4. **No merge conflicts with main**

**All checks must pass** - no manual override for failed builds.

### Merge Strategy

- **All work merges directly to `main`**
- **Every merge to `main` = production deployment** (automatic via Cloudflare)
- **Short-lived feature branches** - merge within days, not weeks
- **Small, incremental PRs preferred** over large, long-lived branches

## Technical Guidelines

### Code Style & Standards

- Follow detailed guidelines in [AGENTS.md](./AGENTS.md)
- Use TypeScript strict mode
- Follow Astro SSR patterns
- Implement proper error handling and validation
- Use Tailwind utility classes, Flowbite components
- Mobile-first responsive design approach

### Database Operations

- Use D1 database with proper connection handling
- Always validate database exists before use
- Use prepared statements with parameter binding
- Return `null` for not-found results
- Use TypeScript generics for query result typing

### API Development

- Export typed functions: `GET`, `POST`, etc. of type `APIRoute`
- Return proper HTTP status codes
- Set appropriate `Content-Type` headers
- Include cache headers for static content
- Use JSON error responses with descriptive messages

### Security Best Practices

- Sanitize all user input and URL parameters
- Use parameterized queries for database operations
- Validate route parameters before processing
- Never expose sensitive data or API keys
- Implement proper CORS headers for API endpoints

## Commit Message Conventions

We follow **Conventional Commits** format to maintain consistency and enable automated changelog generation.

### Format

```
<type>: <description>
```

### Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code formatting/style changes (no functional changes)
- `refactor`: Code refactoring without functional changes
- `test`: Adding/updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements

### Examples

- `feat: implement single page canvas rendering`
- `fix: resolve chapter data timeout issue`
- `docs: update setup instructions for local dev`
- `refactor: extract common database utilities`
- `style: adjust dark mode toggle positioning`
- `test: add unit tests for page navigation`
- `chore: update tailwind to v4.2.0`
- `perf: optimize image loading for large chapters`

## Pull Request Title Conventions

PR titles follow the same format as commit messages for consistency.

### Format

```
<type>: <description>
```

### Guidelines

- Keep titles under 72 characters
- Use present tense ("add" not "added")
- Include issue numbers when applicable
- Be specific about what the PR does

### Examples

- `feat: add LTR/RTL reading direction support`
- `fix: resolve chapter count calculation error`
- `docs: update Mihon API v2 documentation`
- `refactor: extract common page layout components`
- `perf: improve image caching strategy`

## Pull Request Description Guidelines

Clear PR descriptions help reviewers understand your changes quickly. Use this template:

### Required Sections

```markdown
## Problem/Motivation

Brief description of what problem this change addresses and why it's needed.

## Implementation

How the change was implemented, including technical details and any important decisions made.

## Testing

How this was tested:

- Manual testing steps performed
- Devices/browsers checked
- Specific functionality verified

## Breaking Changes

List any breaking changes or note "None" if there are none.

## Related Issues

Closes #123, Related to #456, or "None"
```

### Examples by Contribution Type

**Feature Example:**

```markdown
## Problem/Motivation

Users currently need to navigate back to the volume page to switch chapters while reading. This PR adds chapter navigation directly in the reader interface.

## Implementation

Implemented chapter dropdown navigation in reader sidebar that:

- Fetches all chapters from current volume
- Maintains current reading position
- Updates URL for bookmarking
- Includes reading progress indicators

## Testing

- Tested chapter navigation in volume 4
- Verified dropdown works on mobile and desktop
- Confirmed reading position is preserved
- Checked bookmark functionality with new URLs

## Breaking Changes

None

## Related Issues

Closes #87
```

**Bug Fix Example:**

```markdown
## Problem/Motivation

Chapter pages were not loading correctly due to database timeout issue after 30 seconds.

## Implementation

- Added connection timeout handling in database queries
- Implemented retry mechanism for failed requests
- Added proper error messaging for users

## Testing

- Reproduced original timeout issue
- Verified fix works consistently
- Tested error handling scenarios
- Checked mobile and desktop compatibility

## Breaking Changes

None

## Related Issues

Closes #92
```

**API Development Example:**

```markdown
## Problem/Motivation

Mihon API v1 has hardcoded values that prevent multi-language support and future expansion.

## Implementation

- Refactored API structure to support dynamic manga data
- Added language parameter support
- Implemented new endpoint for manga metadata
- Updated response format for compatibility

## Testing

- Tested with existing Mihon client applications
- Verified backward compatibility
- Checked new language parameter functionality
- Validated response format matches expected schema

## Breaking Changes

API response format updated (backward compatible)

## Related Issues

Related to #45, Part of Mihon API v2 roadmap
```

## Testing Approach

Currently, this project uses manual testing rather than automated tests:

1. **Local Testing**: Run `pnpm dev` and test all user flows
2. **API Testing**: Test API endpoints directly
3. **Responsive Testing**: Verify functionality across devices
4. **Workers Testing**: Use `wrangler dev` for Cloudflare deployment testing

Before submitting a PR, please ensure:

- Your changes work as expected
- UI is responsive across different screen sizes
- API endpoints return correct responses
- No console errors or warnings

## Deployment Process

### Automatic Cloudflare Deployment

- **Trigger**: Any merge to `main` branch
- **Process**: Cloudflare automatically deploys to production
- **No manual steps required**: Cloudflare Workers handles all deployment infrastructure
- **Timeline**: Deployment completes within seconds of merge

### Development Deployment Flow

1. **Development**: `pnpm dev` for local Astro development
2. **Workers Testing**: `wrangler dev` for Cloudflare Workers runtime testing
3. **Production**: Merge to `main` triggers automatic Cloudflare deployment

## Community & Support

### Response Time Expectations

- PR reviews: Typically within 1-2 weeks
- Issue responses: Within 1 week for questions, sooner for bugs
- Feature requests: Will be evaluated against project roadmap

### Communication Channels

- GitHub Issues: Bug reports, feature requests, questions
- Pull Requests: Code contributions and reviews

### Security Disclosures

If you find a security vulnerability, do NOT open an issue. Please report it responsibly through appropriate channels.

## Important Disclaimers

### Licensing

- **Code**: Licensed under MIT License
- **Content**: No manga scans provided, respect copyright
- **Manga**: Vagabond © Takehiko Inoue / Kodansha

### Contribution Boundaries

- Code contributions are welcome and encouraged
- Do not submit manga scans or copyrighted content
- Respect licensing terms and copyright notices
- Focus on improving the reader application functionality

### Legal Notice

This site is unofficial and provides content for personal reference only. All rights remain with the original creators and publishers. Please support the official editions.

---

Thank you for contributing! Your help makes this project better for everyone interested in experiencing Takehiko Inoue's masterpiece.
