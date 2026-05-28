// src/pages/api/mihon/mangas/[manga]/chapters/index.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { db } from "../../../../../../db/client";

export const GET: APIRoute = async ({ params }) => {
  const mangaId = parseInt(params.manga ?? "");
  if (!mangaId) {
    return new Response(JSON.stringify({ error: "Invalid manga ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  }
  // Only one manga in the database, so we can just check if the ID is 1. This is just to prevent unnecessary database queries for invalid IDs.
  if (mangaId !== 1) {
    return new Response(JSON.stringify({ error: "Manga not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  }

  const chapters = await db.query.chaptersTable.findMany({
    where: (chapter, { eq }) => eq(chapter.mangaId, mangaId),
    orderBy: (chapter, { desc }) => desc(chapter.number),
  });

  return new Response(JSON.stringify(chapters), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
