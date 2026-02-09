// /api/mihon/v2/mangas/[manga]/chapters/[chapter]
import type { APIRoute } from "astro";
import { getDb } from "@/db/client";
import { getMangaChapterById } from "@/lib/db";

export const GET: APIRoute = async ({ locals, params }) => {
  const { chapter: chapterId = "0" } = params;

  const db = getDb(locals.runtime.env.bagabondo_db);
  if (!db) {
    return new Response("Database connection error", { status: 500 });
  }

  const chapter = await getMangaChapterById(db, +chapterId);

  return new Response(JSON.stringify(chapter), {
    headers: { "Content-Type": "application/json" },
  });
};
