import { sql, and, eq, asc, desc, countDistinct, min, max } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import {
  authorsTable,
  chaptersTable,
  mangasTable,
  volumesTable,
} from "./schema";
import type * as schema from "./schema";

type Database = BaseSQLiteDatabase<"async", unknown, typeof schema>;

const authorAlias = alias(authorsTable, "author");
const artistAlias = alias(authorsTable, "artist");

export const getMangas = async (db: Database) => {
  const data = await db
    .select({
      id: mangasTable.id,
      author: authorAlias.name,
      artist: artistAlias.name,
      title: mangasTable.title,
      description: mangasTable.description,
      status: mangasTable.status,
    })
    .from(mangasTable)
    .innerJoin(authorAlias, eq(mangasTable.authorId, authorAlias.id))
    .innerJoin(artistAlias, eq(mangasTable.artistId, artistAlias.id))
    .orderBy(desc(mangasTable.createdAt));
  return data;
};

export const getMangaById = async (db: Database, mangaId: number) => {
  const data = await db
    .select({
      id: mangasTable.id,
      title: mangasTable.title,
      description: mangasTable.description,
      status: mangasTable.status,
      createdAt: mangasTable.createdAt,
      author: authorAlias.name,
      artist: artistAlias.name,
    })
    .from(mangasTable)
    .leftJoin(authorAlias, eq(mangasTable.authorId, authorAlias.id))
    .leftJoin(artistAlias, eq(mangasTable.artistId, artistAlias.id))
    .where(eq(mangasTable.id, mangaId));
  return data[0];
};

export const getMangaLibraryCounts = async (db: Database) => {
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

export const getMangaVolumes = async (db: Database) => {
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

export const getMangaVolumeById = async (db: Database, volumeId: number) => {
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

export const getMangaVolumeByNumber = async (
  db: Database,
  volumeNumber: number,
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
    .where(eq(volumesTable.number, volumeNumber))
    .groupBy(volumesTable.id, volumesTable.number);
  return data[0];
};

export const getMangaChaptersByVolumeId = async (
  db: Database,
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

export const getMangaChaptersByVolumeNumber = async (
  db: Database,
  volumeNumber: number,
) => {
  const data = await db
    .select({
      number: chaptersTable.number,
      title: chaptersTable.title,
      releaseDate: chaptersTable.releaseDate,
    })
    .from(chaptersTable)
    .innerJoin(volumesTable, eq(volumesTable.id, chaptersTable.volumeId))
    .where(eq(volumesTable.number, volumeNumber))
    .orderBy(asc(chaptersTable.number));
  return data;
};

export const getMangaChapterById = async (db: Database, chapterId: number) => {
  const data = await db
    .select({
      title: chaptersTable.title,
      number: chaptersTable.number,
      pageCount: chaptersTable.pageCount,
      releaseDate: chaptersTable.releaseDate,
    })
    .from(chaptersTable)
    .where(eq(chaptersTable.id, chapterId));
  return data[0];
};

export const getMangaChapterByNumber = async (
  db: Database,
  chapterNumber: number,
) => {
  const data = await db
    .select({
      title: chaptersTable.title,
      number: chaptersTable.number,
      pageCount: chaptersTable.pageCount,
      releaseDate: chaptersTable.releaseDate,
    })
    .from(chaptersTable)
    .where(eq(chaptersTable.number, chapterNumber));
  return data[0];
};

export const getMangaChaptersByMangaId = async (
  db: Database,
  mangaId: number,
) => {
  const data = await db
    .select({
      id: chaptersTable.id,
      number: chaptersTable.number,
      title: chaptersTable.title,
      volume: volumesTable.number,
      releaseDate: chaptersTable.releaseDate,
      pageCount: chaptersTable.pageCount,
      mangaId: chaptersTable.mangaId,
    })
    .from(chaptersTable)
    .innerJoin(volumesTable, eq(volumesTable.id, chaptersTable.volumeId))
    .where(eq(chaptersTable.mangaId, mangaId))
    .orderBy(desc(chaptersTable.number));
  return data[0];
};

export const getMangaChapterByMangaIdAndChapterId = async (
  db: Database,
  mangaId: number,
  chapterId: number,
) => {
  const data = await db
    .select({
      id: chaptersTable.id,
      number: chaptersTable.number,
      title: chaptersTable.title,
      volume: volumesTable.number,
      releaseDate: chaptersTable.releaseDate,
      pageCount: chaptersTable.pageCount,
      mangaId: chaptersTable.mangaId,
    })
    .from(chaptersTable)
    .innerJoin(volumesTable, eq(volumesTable.id, chaptersTable.volumeId))
    .where(
      and(eq(chaptersTable.mangaId, mangaId), eq(chaptersTable.id, chapterId)),
    );
  return data[0];
};
