type Database = D1Database;

export type Comment = {
  id: number;
  manga: string;
  volume: number;
  chapter: number;
  author: string;
  content: string;
  created_at: string | number;
};

export async function getMetadata(db: Database) {
  const result = await db
    .prepare(
      `
      SELECT 
        COUNT(DISTINCT volume) as tankobon,
        COUNT(*) as chapters
      FROM chapters
    `
    )
    .first<{ tankobon: number; chapters: number }>();

  return result || { tankobon: 0, chapters: 0 };
}

export async function getVolumes(db: Database) {
  const result = await db
    .prepare(
      `
      SELECT
        volume,
        MIN(release_date) as release_date,
        COUNT(*) as chapter_count,
        MIN(number) as first_chapter,
        MAX(number) as last_chapter
      FROM chapters
      WHERE volume IS NOT NULL
      GROUP BY volume
      ORDER BY volume ASC
    `
    )
    .all<{
      volume: number;
      release_date: string;
      chapter_count: number;
      first_chapter: number;
      last_chapter: number;
    }>();

  return result?.results || [];
}

export async function getVolumeDetails(
  db: Database,
  volumeNumber: string | number
) {
  const volumeData = await db
    .prepare(
      `
      SELECT 
        volume,
        MIN(number) as first_chapter,
        MAX(number) as last_chapter,
        COUNT(*) as chapter_count,
        MIN(release_date) as release_date
      FROM chapters 
      WHERE volume = ?
      GROUP BY volume
    `
    )
    .bind(volumeNumber)
    .first<{
      volume: number;
      first_chapter: number;
      last_chapter: number;
      chapter_count: number;
      release_date: string;
    }>();

  if (!volumeData) {
    return null;
  }

  const chapters = await db
    .prepare(
      `
      SELECT number, title, description, release_date 
      FROM chapters 
      WHERE volume = ? 
      ORDER BY number ASC
    `
    )
    .bind(volumeNumber)
    .all<{
      number: number;
      title: string;
      description: string | null;
      release_date: string;
    }>();

  return {
    volume: volumeData,
    chapters: chapters?.results || [],
  };
}

export async function getChapterDetails(
  db: Database,
  chapterNumber: string | number
) {
  const chapter = await db
    .prepare(`SELECT * FROM chapters WHERE number = ?`)
    .bind(chapterNumber)
    .first<{
      id: number;
      number: number;
      title: string;
      description: string | null;
      volume: number;
      release_date: string;
      page_count: number;
      created_at: string;
    }>();

  return chapter;
}

export async function getChapterComments(
  db: Database,
  mangaId: string,
  chapterNumber: string | number
): Promise<Comment[]> {
  const CommentsAPIResponse = await db
    .prepare(
      `SELECT *
       FROM comments
       WHERE manga = ? AND chapter = ?
       ORDER BY created_at DESC`
    )
    .bind(mangaId, chapterNumber)
    .all<Comment>();

  if (!CommentsAPIResponse.success) {
    throw new Error('Failed to fetch chapter comments');
  }

  return CommentsAPIResponse.results ?? [];
}

export async function addChapterComment(
  db: Database,
  comment: {
    volume: number;
    chapter: number;
    author: string;
    content: string;
  }
) {
  if (comment.author == undefined || comment.author == '') {
    comment.author = 'Anonymous';
  }
  const result = await db
    .prepare(
      `
      INSERT INTO comments (manga, volume, chapter, author, content)
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .bind(
      'vagabond',
      comment.volume,
      comment.chapter,
      comment.author,
      comment.content
    )
    .run();

  return {
    id: result.meta.last_row_id,
    ...comment,
  };
}
