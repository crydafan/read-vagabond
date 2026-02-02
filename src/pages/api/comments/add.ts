import type { APIRoute } from 'astro';
import { addChapterComment } from '../../../lib/db';

type AddCommentBody = {
  volume: number;
  chapter: number;
  author: string;
  content: string;
  parent_id: Number | null;
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

  const { volume, chapter, author, content, parent_id } = body;

  if (!volume || !chapter || !content) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
    });
  }

  const normalizedParentId =
    parent_id === null || parent_id === undefined ? null : Number(parent_id);

  try {
    const comment = await addChapterComment(db, {
      volume: Number(volume),
      chapter: Number(chapter),
      parent_id: normalizedParentId,
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
