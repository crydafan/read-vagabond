import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const authorsTable = sqliteTable("authors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const mangasTable = sqliteTable(
  "mangas",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    authorId: text("author_id")
      .notNull()
      .references(() => authorsTable.id),
    artistId: text("artist_id")
      .notNull()
      .references(() => authorsTable.id),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [unique().on(table.authorId, table.title)],
);

export const volumesTable = sqliteTable(
  "volumes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    mangaId: text("manga_id")
      .notNull()
      .references(() => mangasTable.id),
    number: integer("number").notNull(),
    releaseDate: integer("release_date", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    unique().on(table.mangaId, table.number),
    index("volumes_number_idx").on(table.number),
  ],
);

export const chaptersTable = sqliteTable(
  "chapters",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => uuidv4()),
    mangaId: text("manga_id")
      .notNull()
      .references(() => mangasTable.id),
    volumeId: text("volume_id")
      .notNull()
      .references(() => volumesTable.id),
    title: text("title").notNull(),
    number: integer("number").notNull(),
    pageCount: integer("page_count").notNull(),
    releaseDate: integer("release_date", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    unique().on(table.volumeId, table.number),
    index("chapters_number_idx").on(table.number),
  ],
);
