import type { APIRoute } from "astro";
import { getMangaVolumes } from "../lib/db";

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export const GET: APIRoute = async () => {
  const siteUrl = "https://readbagabondo.com";
  const volumes = await getMangaVolumes();

  const urls: SitemapUrl[] = [];

  // Homepage
  urls.push({
    loc: `${siteUrl}/`,
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "1.0",
  });

  // Volume pages
  for (const volume of volumes) {
    urls.push({
      loc: `${siteUrl}/volume-${volume.number}`,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "monthly",
      priority: "0.8",
    });

    const firstChapter = volume.firstChapter;
    const lastChapter = volume.lastChapter;

    if (firstChapter == null || lastChapter == null) {
      continue;
    }

    // Chapter pages for this volume
    for (let i = firstChapter; i <= lastChapter; i++) {
      urls.push({
        loc: `${siteUrl}/volume-${volume.number}/chapter-${i}`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: "0.7",
      });
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
