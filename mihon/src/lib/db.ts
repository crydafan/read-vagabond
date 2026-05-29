export const getMangas = async (db: D1Database) => {
  const data = await db
    .prepare(
      `
      SELECT 
        mangas.id,
        authors.name AS author,
        artists.name AS artist,
        mangas.title,
        mangas.description,
        mangas.status
      FROM mangas
      JOIN authors AS authors ON mangas.author_id = authors.id
      JOIN authors AS artists ON mangas.artist_id = artists.id
      ORDER BY mangas.created_at DESC
      `,
    )
    .all();
  return data.results;
};

export const getMangaById = async (db: D1Database, id: string) => {
  const data: {
    id: string;
    author: string;
    artist: string;
    title: string;
    description: string;
    status: string;
  } | null = await db
    .prepare(
      `
      SELECT 
        mangas.id,
        authors.name AS author,
        artists.name AS artist,
        mangas.title,
        mangas.description,
        mangas.status
      FROM mangas
      JOIN authors AS authors ON mangas.author_id = authors.id
      JOIN authors AS artists ON mangas.artist_id = artists.id
      WHERE mangas.id = ?
      `,
    )
    .bind(id)
    .first();
  return data;
};

export const getMangaChaptersByMangaId = async (
  db: D1Database,
  mangaId: string,
) => {
  const data = await db
    .prepare(
      `
      SELECT 
        chapters.id,
        chapters.number,
        chapters.title,
        volume.number AS volume,
        chapters.release_date,
        chapters.page_count,
        chapters.manga_id
      FROM chapters
      JOIN volumes AS volume
      ON chapters.volume_id = volume.id AND chapters.manga_id = volume.manga_id
      WHERE chapters.manga_id = ?
      ORDER BY chapters.number DESC
      `,
    )
    .bind(mangaId)
    .all();
  return data.results;
};

export const getMangaChapterByMangaIdAndChapterId = async (
  db: D1Database,
  mangaId: string,
  chapterId: string,
) => {
  const data = await db
    .prepare(
      `
      SELECT 
        chapters.id,
        chapters.number,
        chapters.title,
        volume.number AS volume,
        chapters.release_date,
        chapters.page_count,
        chapters.manga_id
      FROM chapters
      JOIN volumes AS volume
      ON chapters.volume_id = volume.id AND chapters.manga_id = volume.manga_id
      WHERE chapters.manga_id = ? AND chapters.id = ?
      `,
    )
    .bind(mangaId, chapterId)
    .first();
  return data;
};
