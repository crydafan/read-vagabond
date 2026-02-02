// src/pages/api/comments/[id]/like.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ params, locals, request }) => {
  const db = locals.runtime?.env?.vagabond_db;
  const commentId = Number(params.id);

  if (!db || !commentId) {
    return new Response('Invalid request', { status: 400 });
  }

  const userId =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for') ??
    'anonymous';

  try {
    await db
      .prepare(
        `
        INSERT OR IGNORE INTO comment_likes (comment_id, user_id)
        VALUES (?, ?)
        `
      )
      .bind(commentId, userId)
      .run();

    const result = await db
      .prepare(
        `
        SELECT COUNT(*) as likes
        FROM comment_likes
        WHERE comment_id = ?
        `
      )
      .bind(commentId)
      .first<{ likes: number }>();

    return new Response(JSON.stringify({ likes: result?.likes ?? 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Failed to like comment', { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals, request }) => {
  const db = locals.runtime?.env?.vagabond_db;
  const commentId = Number(params.id);

  if (!db || !commentId) {
    return new Response('Invalid request', { status: 400 });
  }

  const userId =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for') ??
    'anonymous';

  try {
    await db
      .prepare(
        `
        DELETE FROM comment_likes
        WHERE comment_id = ? AND user_id = ?
        `
      )
      .bind(commentId, userId)
      .run();

    const result = await db
      .prepare(
        `
        SELECT COUNT(*) as likes
        FROM comment_likes
        WHERE comment_id = ?
        `
      )
      .bind(commentId)
      .first<{ likes: number }>();

    return new Response(JSON.stringify({ likes: result?.likes ?? 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Failed to unlike comment', { status: 500 });
  }
};
