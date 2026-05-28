// src/pages/api/mihon/mangas/[manga]/index.ts
import type { APIRoute } from "astro";
import { getMangaById } from "../../../../../lib/db";

export const prerender = false;

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

  const manga = await getMangaById(1);
  return new Response(
    JSON.stringify({
      id: manga!.id,
      title: manga!.title,
      author: manga!.author,
      artist: manga!.artist,
      description: manga!.description,
      status: manga!.status,
      cover: "https://bucket.readbagabondo.com/covers/volume-37.jpg",
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
};
