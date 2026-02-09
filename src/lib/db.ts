import { alias } from "drizzle-orm/sqlite-core";
import { sql, eq, asc, countDistinct, min, max } from "drizzle-orm";
import {
  authorsTable,
  chaptersTable,
  mangasTable,
  volumesTable,
} from "../db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

const authorAlias = alias(authorsTable, "author");
const artistAlias = alias(authorsTable, "artist");

export const getMangas = async (db: DrizzleD1Database) => {
  const mangas = await db
    .select({
      id: mangasTable.id,
      title: mangasTable.title,
      description: mangasTable.description,
      author: authorAlias.name,
      artist: artistAlias.name,
      status: mangasTable.status,
    })
    .from(mangasTable)
    .leftJoin(authorAlias, eq(mangasTable.authorId, authorAlias.id))
    .leftJoin(artistAlias, eq(mangasTable.artistId, artistAlias.id));
  return mangas;
};

export const getMangaById = async (db: DrizzleD1Database, mangaId: number) => {
  const mangas = await db
    .select({
      id: mangasTable.id,
      title: mangasTable.title,
      description: mangasTable.description,
      author: authorAlias.name,
      artist: artistAlias.name,
      status: mangasTable.status,
    })
    .from(mangasTable)
    .leftJoin(authorAlias, eq(mangasTable.authorId, authorAlias.id))
    .leftJoin(artistAlias, eq(mangasTable.artistId, artistAlias.id))
    .where(eq(mangasTable.id, mangaId))
    .get();
  return mangas;
};

export const getMangaLibraryCounts = async (db: DrizzleD1Database) => {
  const data = await db
    .select({
      volumeCount: countDistinct(volumesTable.id).as("volumeCount"),
      chapterCount: sql<number>`(SELECT COUNT(*) FROM ${chaptersTable})`.as(
        "chapterCount",
      ),
    })
    .from(volumesTable);
  return data[0];
};

export const getMangaVolumes = async (db: DrizzleD1Database) => {
  const data = await db
    .select({
      number: volumesTable.number,
      releaseDate: min(chaptersTable.releaseDate).as("releaseDate"),
      chapterCount: countDistinct(chaptersTable.number).as("chapterCount"),
      firstChapter: min(chaptersTable.number).as("firstChapter"),
      lastChapter: max(chaptersTable.number).as("lastChapter"),
    })
    .from(volumesTable)
    .innerJoin(chaptersTable, eq(chaptersTable.volumeId, volumesTable.id))
    .groupBy(volumesTable.id, volumesTable.number)
    .orderBy(asc(volumesTable.number));
  return data;
};

export const getMangaVolumeById = async (
  db: DrizzleD1Database,
  volumeId: number,
) => {
  const data = await db
    .select({
      number: volumesTable.number,
      releaseDate: min(chaptersTable.releaseDate).as("releaseDate"),
      chapterCount: countDistinct(chaptersTable.number).as("chapterCount"),
      firstChapter: min(chaptersTable.number).as("firstChapter"),
      lastChapter: max(chaptersTable.number).as("lastChapter"),
    })
    .from(volumesTable)
    .innerJoin(chaptersTable, eq(chaptersTable.volumeId, volumesTable.id))
    .where(eq(volumesTable.id, volumeId))
    .groupBy(volumesTable.id, volumesTable.number);
  return data[0];
};

export const getMangaChapters = async (db: DrizzleD1Database) => {
  const data = await db
    .select({
      id: chaptersTable.id,
      mangaId: chaptersTable.mangaId,
      volumeId: chaptersTable.volumeId,
      title: chaptersTable.title,
      number: chaptersTable.number,
      pageCount: chaptersTable.pageCount,
      releaseDate: chaptersTable.releaseDate,
    })
    .from(chaptersTable)
    .orderBy(asc(chaptersTable.number));
  return data;
};

export const getMangaChaptersByVolumeId = async (
  db: DrizzleD1Database,
  volumeId: number,
) => {
  const data = await db
    .select({
      number: chaptersTable.number,
      title: chaptersTable.title,
      releaseDate: chaptersTable.releaseDate,
    })
    .from(chaptersTable)
    .where(eq(chaptersTable.volumeId, volumeId))
    .orderBy(asc(chaptersTable.number));
  return data;
};

export const getMangaChapterById = async (
  db: DrizzleD1Database,
  chapterId: number,
) => {
  const data = await db
    .select({
      id: chaptersTable.id,
      mangaId: chaptersTable.mangaId,
      volumeId: chaptersTable.volumeId,
      title: chaptersTable.title,
      number: chaptersTable.number,
      pageCount: chaptersTable.pageCount,
      releaseDate: chaptersTable.releaseDate,
    })
    .from(chaptersTable)
    .where(eq(chaptersTable.id, chapterId));
  return data[0];
};
