// src/pages/api/mihon/mangas/[id]/chapters/[id].ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals, params }) => {
  const chapterId = params.chapter;

  const db = locals.runtime.env.vagabond_db;
  const chapterData = await db
    .prepare("SELECT * FROM chapters WHERE number = ?")
    .bind(chapterId)
    .first();

  return new Response(
    JSON.stringify({ ...chapterData, manga_id: params.manga }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
};
