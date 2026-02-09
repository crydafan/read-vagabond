// src/pages/api/mihon/mangas.ts
import type { APIRoute } from "astro";
import data from "./data.json";

export const GET: APIRoute = async ({ url }) => {
  let filteredData = data;
  const searchQuery = url.searchParams.get("q")?.toLocaleLowerCase();
  if (searchQuery) {
    filteredData = data.filter((manga) =>
      manga.title.toLocaleLowerCase().includes(searchQuery),
    );
  }

  // For possible pagination in the future
  // const startIndex = (page - 1) * pageSize;
  // const endIndex = startIndex + pageSize;
  // const paginatedData = filteredData.slice(startIndex, endIndex);

  return new Response(JSON.stringify(filteredData), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
