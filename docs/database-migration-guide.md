# Database Migration Guide

This guide documents the migration from the legacy flat chapter schema to the new normalized database schema with `authors`, `mangas`, `volumes`, and `chapters` tables.

## Overview

The migration transforms the legacy database structure into a properly normalized schema that separates concerns and provides better data integrity through foreign key relationships.

## Legacy Schema (Deprecated)

Located in `migrations/deprecated/`:

- **0001_init.sql**: Single `chapters` table with denormalized data
- **0002_seed_chapters.sql**: 328 chapter records
- **0003_update_page_count.sql**: Initial page count updates
- **0004_update_page_count_vizbig.sql**: Final VizBig edition page counts (chapters 1-322)

### Legacy `chapters` Table

```sql
- id: INTEGER PRIMARY KEY
- number: INTEGER NOT NULL UNIQUE
- title: TEXT NOT NULL
- description: TEXT NULL
- volume: INTEGER NULL
- release_date: TEXT NULL (YYYY-MM-DD format)
- page_count: INTEGER NULL
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP
```

## New Schema (Drizzle)

Located in `drizzle/migrations/0000_complex_mimic.sql`:

### `authors`

```sql
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- name: TEXT NOT NULL
- created_at: INTEGER DEFAULT unixepoch() NOT NULL
```

### `mangas`

```sql
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- author_id: INTEGER NOT NULL → authors(id)
- artist_id: INTEGER NOT NULL → authors(id)
- title: TEXT NOT NULL
- description: TEXT
- status: TEXT NOT NULL
- created_at: INTEGER DEFAULT unixepoch() NOT NULL
```

### `volumes`

```sql
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- manga_id: INTEGER NOT NULL → mangas(id)
- number: INTEGER NOT NULL
- release_date: INTEGER (Unix timestamp)
- created_at: INTEGER DEFAULT unixepoch() NOT NULL
```

### `chapters`

```sql
- id: INTEGER PRIMARY KEY AUTOINCREMENT
- volume_id: INTEGER NOT NULL → volumes(id)
- title: TEXT NOT NULL
- number: INTEGER NOT NULL
- page_count: INTEGER NOT NULL
- release_date: INTEGER (Unix timestamp)
- created_at: INTEGER DEFAULT unixepoch() NOT NULL
```

## Migration Changes

### Data Transformations

1. **Author/Artist**: Created single author record for "Takehiko Inoue"
2. **Manga**: Created "Vagabond" manga with status "Hiatus"
3. **Volumes**: Extracted 37 distinct volume numbers from legacy chapters
4. **Chapters**: Migrated 322 chapters with the following transformations:
   - **Excluded**: Chapters 323-327 (no volume assignment, not in VizBig)
   - **Page counts**: Applied values from `0004_update_page_count_vizbig.sql`
   - **Release dates**: Converted from TEXT `YYYY-MM-DD` to INTEGER Unix timestamps
   - **Volume references**: Converted volume numbers to `volume_id` foreign keys
   - **Description field**: Discarded (not in new schema)
   - **created_at**: Uses default `unixepoch()` instead of legacy timestamps

### Excluded Data

**Chapters 323-327** were intentionally excluded because:

- Legacy data had `volume = NULL` for these chapters
- Not included in VizBig edition (0004_update_page_count_vizbig.sql ends at chapter 322)
- New schema requires `volume_id` NOT NULL
- User decision: skip rather than assign to unknown volume

## Generated Migration Files

### `seeds/0001_seed_data.sql`

Auto-generated SQL script containing:

- 1 author insert (Takehiko Inoue)
- 1 manga insert (Vagabond)
- 37 volume inserts (volumes 1-37)
- 322 chapter inserts (chapters 1-322, excluding 323-327)

**File size**: ~55KB  
**Total records**: 361

### `seeds/0000_seed_from_legacy.sql`

Generated SQL script containing legacy seed data already parsed for the new database schema.

## How to Apply the Migration

### Step 1: Apply Schema and Seed Migration

```bash
pnpm wrangler d1 execute bagabondo-db --file=./drizzle/migrations/0000_complex_mimic.sql
pnpm wrangler d1 execute bagabondo-db --file=./drizzle/migrations/0001_conscious_mongu.sql
pnpm wrangler d1 execute bagabondo-db --file=./seeds/0000_seed_from_legacy.sql
pnpm wrangler d1 execute bagabondo-db --file=./drizzle/migrations/0002_aspiring_thena.sql
pnpm wrangler d1 execute bagabondo-db --file=./seeds/0001_update_manga_id_in_chapters.sql
pnpm wrangler d1 execute bagabondo-db --file=./drizzle/migrations/0003_conscious_marvel_apes.sql
```

### Step 2: Verify Migration

```bash
# Check record counts
pnpm wrangler d1 execute bagabondo-db --command="SELECT COUNT(*) FROM authors"
pnpm wrangler d1 execute bagabondo-db --command="SELECT COUNT(*) FROM mangas"
pnpm wrangler d1 execute bagabondo-db --command="SELECT COUNT(*) FROM volumes"
pnpm wrangler d1 execute bagabondo-db --command="SELECT COUNT(*) FROM chapters"

# Expected results:
# authors: 1
# mangas: 1
# volumes: 37
# chapters: 322
```

## Notes

- The migration uses subqueries `(SELECT id FROM volumes WHERE number = X)` to resolve foreign keys
- All `created_at` timestamps use the database's `unixepoch()` function at insert time
- Legacy migration files are preserved in `migrations/deprecated/` for reference and will be removed in the future.

## Future Migrations

To add new chapters after this migration:

```sql
-- Example: Adding chapter 323
INSERT INTO chapters (manga_id, volume_id, title, number, page_count, release_date)
VALUES (
  1, -- Vagabond manga id
  (SELECT id FROM volumes WHERE number = 38),  -- Create volume 38 first if needed
  'Chapter Title',
  323,
  25,
  unixepoch('2026-02-15')  -- Or NULL if not released
);
```
