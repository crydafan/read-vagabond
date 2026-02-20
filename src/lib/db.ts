import { sql, eq, asc, countDistinct, min, max, desc } from "drizzle-orm";
import { chaptersTable, volumesTable } from "../db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

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

export const getMangaVolumeByNumber = async (
  db: DrizzleD1Database,
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

// TODO(crydafan): This is hacky. Find a better way to get volumes with chapters.
export const getMangaVolumesWithChapters = async (db: DrizzleD1Database) => {
  const data = await db
    .select({
      volumeId: volumesTable.id,
      number: volumesTable.number,
      chapters: sql<string>`JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'number', ${chaptersTable.number},
          'title', ${chaptersTable.title},
          'releaseDate', ${chaptersTable.releaseDate}
        )
      )`.as("chapters"),
    })
    .from(volumesTable)
    .innerJoin(chaptersTable, eq(chaptersTable.volumeId, volumesTable.id))
    .groupBy(volumesTable.id, volumesTable.number)
    .orderBy(desc(volumesTable.number));
  return data.map((item) => ({
    ...item,
    chapters: JSON.parse(item.chapters)
      .reverse()
      .map((chapter: any) => ({
        ...chapter,
        releaseDate: new Date(chapter.releaseDate * 1000), // Convert from seconds to milliseconds
      })),
  }));
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

export const getMangaChaptersByVolumeNumber = async (
  db: DrizzleD1Database,
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

export const getMangaChapterById = async (
  db: DrizzleD1Database,
  chapterId: number,
) => {
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
  db: DrizzleD1Database,
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
