import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const authorsTable = sqliteTable("authors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const mangasTable = sqliteTable(
  "mangas",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    authorId: integer("author_id")
      .notNull()
      .references(() => authorsTable.id),
    artistId: integer("artist_id")
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
    id: integer("id").primaryKey({ autoIncrement: true }),
    mangaId: integer("manga_id")
      .notNull()
      .references(() => mangasTable.id),
    number: integer("number").notNull(),
    releaseDate: integer("release_date", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [unique().on(table.mangaId, table.number)],
);

export const chaptersTable = sqliteTable(
  "chapters",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    mangaId: integer("manga_id")
      .notNull()
      .references(() => mangasTable.id),
    volumeId: integer("volume_id")
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
  (table) => [unique().on(table.volumeId, table.number)],
);
