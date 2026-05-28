// src/pages/api/mihon/mangas/index.ts
import type { APIRoute } from "astro";
import { getMangaById } from "../../../../lib/db";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const searchQuery = url.searchParams.get("q")?.toLocaleLowerCase();

  // Just so we don't hit the database every time someone searches for something we don't have. We only have one manga in the database.
  if (searchQuery && !"Vagabond".toLowerCase().includes(searchQuery)) {
    return new Response(JSON.stringify([]), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  }

  const manga = await getMangaById(1);

  return new Response(
    JSON.stringify([
      {
        id: manga!.id,
        title: manga!.title,
        author: manga!.author,
        artist: manga!.artist,
        description: manga!.description,
        status: manga!.status,
        cover: "https://bucket.readbagabondo.com/covers/volume-37.jpg",
      },
    ]),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
};
