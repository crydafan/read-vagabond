// src/pages/api/mihon/mangas/[id]/index.ts
import type { APIRoute } from "astro";
import data from "../../data.json";

export const GET: APIRoute = async ({ locals, params }) => {
  const mangaId = params.manga;

  const manga = data.find((manga) => manga.id === mangaId);
  if (!manga) {
    return new Response(JSON.stringify({ error: "Manga not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(manga), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
