// /api/mihon/v2/mangas/[manga]
import type { APIRoute } from "astro";
import { getDb } from "@/db/client";
import { getMangaById } from "@/lib/db";

export const GET: APIRoute = async ({ locals, params }) => {
  const { manga: mangaId = "0" } = params;

  const db = getDb(locals.runtime.env.bagabondo_db);
  if (!db) {
    return new Response("Database connection error", { status: 500 });
  }

  return new Response(JSON.stringify(await getMangaById(db, +mangaId)), {
    headers: { "Content-Type": "application/json" },
  });
};
