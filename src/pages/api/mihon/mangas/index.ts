// /api/mihon/v2/mangas
import type { APIRoute } from "astro";
import { getDb } from "@/db/client";
import { getMangas } from "@/lib/db";

export const GET: APIRoute = async ({ locals }) => {
  const db = getDb(locals.runtime.env.bagabondo_db);
  if (!db) {
    return new Response("Database connection error", { status: 500 });
  }

  return new Response(JSON.stringify(await getMangas(db)), {
    headers: { "Content-Type": "application/json" },
  });
};
