// src/pages/api/mihon/mangas/[manga]/chapters/[chapter]/comments.ts

import type { APIRoute } from 'astro';
import { getChapterComments } from '../../../../../../../lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  const chapterId = params.chapter;

  if (!chapterId) {
    return new Response(
      JSON.stringify({ error: 'Missing chapter parameter' }),
      { status: 400 }
    );
  }

  const db = locals.runtime?.env?.vagabond_db;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 500,
    });
  }

  const mangaName = 'vagabond';
  const chapterNumber = Number(chapterId);

  try {
    const comments = await getChapterComments(db, mangaName, chapterNumber);

    return new Response(
      JSON.stringify({
        manga_id: mangaName,
        chapter_id: chapterNumber,
        comments,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to load comments' }), {
      status: 500,
    });
  }
};
