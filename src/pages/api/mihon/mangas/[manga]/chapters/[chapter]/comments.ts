// src/pages/api/mihon/mangas/[manga]/chapters/[chapter]/comments.ts

import type { APIRoute } from 'astro';
import { getChapterComments } from '../../../../../../../lib/db';

export const GET: APIRoute = async ({ locals, params }) => {
  const mangaId = params.manga;
  const chapterId = params.chapter;

  if (!mangaId || !chapterId) {
    return new Response(
      JSON.stringify({ error: 'Missing manga or chapter parameter' }),
      { status: 400 }
    );
  }

  const db = locals.runtime?.env?.vagabond_db;

  if (!db) {
    return new Response(JSON.stringify({ error: 'Database not available' }), {
      status: 500,
    });
  }

  try {
    const comments = await getChapterComments(db, mangaId, chapterId);

    return new Response(
      JSON.stringify({
        manga_id: mangaId,
        chapter_id: chapterId,
        comments,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('Error fetching comments:', err);

    return new Response(JSON.stringify({ error: 'Failed to load comments' }), {
      status: 500,
    });
  }
};
