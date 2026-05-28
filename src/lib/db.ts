import { sql, eq, asc, countDistinct, min, max } from "drizzle-orm";
import {
  artistAlias,
  authorAlias,
  chaptersTable,
  mangasTable,
  volumesTable,
} from "../db/schema";
import { db } from "../db/client";

export const getMangaById = async (mangaId: number) => {
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

export const getMangaLibraryCounts = async () => {
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

export const getMangaVolumes = async () => {
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

export const getMangaVolumeById = async (volumeId: number) => {
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

export const getMangaVolumeByNumber = async (volumeNumber: number) => {
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

export const getMangaChaptersByVolumeId = async (volumeId: number) => {
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

export const getMangaChaptersByVolumeNumber = async (volumeNumber: number) => {
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

export const getMangaChapterById = async (chapterId: number) => {
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

export const getMangaChapterByNumber = async (chapterNumber: number) => {
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
