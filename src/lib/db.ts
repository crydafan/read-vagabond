import { db } from "../db/client";
import * as queries from "../../db/queries";

export async function getMangaById(mangaId: number) {
  return queries.getMangaById(db, mangaId);
}

export async function getMangaLibraryCounts() {
  return queries.getMangaLibraryCounts(db);
}

export async function getMangaVolumes() {
  return queries.getMangaVolumes(db);
}

export async function getMangaVolumeById(volumeId: number) {
  return queries.getMangaVolumeById(db, volumeId);
}

export async function getMangaVolumeByNumber(volumeNumber: number) {
  return queries.getMangaVolumeByNumber(db, volumeNumber);
}

export async function getMangaChaptersByVolumeId(volumeId: number) {
  return queries.getMangaChaptersByVolumeId(db, volumeId);
}

export async function getMangaChaptersByVolumeNumber(volumeNumber: number) {
  return queries.getMangaChaptersByVolumeNumber(db, volumeNumber);
}

export async function getMangaChapterById(chapterId: number) {
  return queries.getMangaChapterById(db, chapterId);
}

export async function getMangaChapterByNumber(chapterNumber: number) {
  return queries.getMangaChapterByNumber(db, chapterNumber);
}
