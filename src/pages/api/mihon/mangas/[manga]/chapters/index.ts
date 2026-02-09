// /api/mihon/v2/mangas/[manga]/chapters
import type { APIRoute } from "astro";
import { getDb } from "@/db/client";
import { getMangaChapters } from "@/lib/db";

export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals.runtime.env.bagabondo_db);
  if (!db) {
    return new Response("Database connection error", { status: 500 });
  }

  const chapters = await getMangaChapters(db);

  return new Response(JSON.stringify(chapters.reverse()), {
    headers: { "Content-Type": "application/json" },
  });
};
