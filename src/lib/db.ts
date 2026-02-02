type Database = D1Database;
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

import type { Config } from 'unique-names-generator';

export type Comment = {
  id: number;
  author: string;
  content: string;
  created_at: string;
  parent_id: number | null;
  likes: number;
  likedByMe: number; // 0 or 1
  replies?: Comment[];
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
  chapterNumber: number,
  userId: string
): Promise<Comment[]> {
  const res = await db
    .prepare(
      `
      SELECT
        c.*,
        COUNT(cl.comment_id) AS likes,
        MAX(CASE WHEN cl.user_id = ? THEN 1 ELSE 0 END) AS likedByMe
      FROM comments c
      LEFT JOIN comment_likes cl ON cl.comment_id = c.id
      WHERE c.manga = ? AND c.chapter = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
      `
    )
    .bind(userId, mangaId, chapterNumber)
    .all<Comment>();

  if (!res.success) {
    throw new Error('Failed to fetch comments');
  }

  const rows = res.results ?? [];

  const commentMap = new Map<number, Comment & { replies: Comment[] }>();

  rows.forEach((row) => {
    commentMap.set(row.id, { ...row, replies: [] });
  });

  const rootComments: Comment[] = [];

  rows.forEach((row) => {
    if (row.parent_id === 0 || row.parent_id === null) {
      rootComments.push(commentMap.get(row.id)!);
    } else {
      const parent = commentMap.get(row.parent_id);
      if (parent) {
        parent.replies.push(commentMap.get(row.id)!);
      }
    }
  });

  return rootComments;
}

export async function addChapterComment(
  db: Database,
  comment: {
    volume: number;
    chapter: number;
    author: string;
    content: string;
    parent_id: null | number;
  }
) {
  let author: string;
  if (
    comment.author == undefined ||
    comment.author == '' ||
    comment.author.toLowerCase() === 'anonymous' ||
    comment.author === 'test'
  ) {
    const customConfig: Config = {
      dictionaries: [adjectives, colors, animals],
      separator: '',
      length: 2,
      style: 'capital',
    };
    author = uniqueNamesGenerator(customConfig);
  } else {
    author = comment.author;
  }
  const result = await db
    .prepare(
      `
      INSERT INTO comments (manga, volume, chapter, author, content, parent_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    )
    .bind(
      'vagabond',
      comment.volume,
      comment.chapter,
      author,
      comment.content,
      comment.parent_id
    )
    .run();
  return {
    id: result.meta.last_row_id,
    volume: comment.volume,
    chapter: comment.chapter,
    author,
    content: comment.content,
    parent_id: comment.parent_id,
  };
}
