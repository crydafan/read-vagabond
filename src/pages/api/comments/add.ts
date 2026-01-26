import type { APIRoute } from 'astro';
import { addChapterComment } from '../../../lib/db';

type AddCommentBody = {
  manga: string;
  volume: number;
  chapter: number;
  author: string;
  content: string;
};

export const POST: APIRoute = async ({ request, locals }) => {
  const db = locals.runtime?.env?.vagabond_db;

  if (!db) {
    return new Response('Database not configured', { status: 500 });
  }

  let body: AddCommentBody;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { volume, chapter, author, content } = body;

  if (!volume || !chapter || !author || !content) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
    });
  }

  try {
    const comment = await addChapterComment(db, {
      volume: Number(volume),
      chapter: Number(chapter),
      author,
      content,
    });

    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Failed to add comment', { status: 500 });
  }
};
