// src/pages/api/mihon/mangas/[id]/chapters/index.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  const db = locals.runtime.env.vagabond_db;
  const { results: chapters } = await db
    .prepare("SELECT * FROM chapters ORDER BY number DESC")
    .all();

  const processedChapters = chapters.map((chapter) => ({
    ...chapter,
    manga_id: "1",
  }));

  return new Response(JSON.stringify(processedChapters), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
