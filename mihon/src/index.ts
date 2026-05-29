import { Hono } from "hono";
import {
  getMangaById,
  getMangaChapterByMangaIdAndChapterId,
  getMangaChaptersByMangaId,
  getMangas,
} from "./lib/db";
import { trimTrailingSlash } from "hono/trailing-slash";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(trimTrailingSlash());

app.get("/mangas", async (c) => {
  const mangas = await getMangas(c.env.bagabondo_db);
  return c.json(mangas);
});

app.get("/mangas/:mangaId", async (c) => {
  const { mangaId } = c.req.param();
  const manga = await getMangaById(c.env.bagabondo_db, mangaId);
  if (!manga) {
    return c.text("Manga not found", 404);
  }
  return c.json(manga);
});

app.get("/mangas/:mangaId/chapters", async (c) => {
  const { mangaId } = c.req.param();
  const manga = await getMangaChaptersByMangaId(c.env.bagabondo_db, mangaId);
  if (!manga) {
    return c.text("Manga not found", 404);
  }
  return c.json(manga);
});

app.get("/mangas/:mangaId/chapters/:chapterId", async (c) => {
  const { mangaId, chapterId } = c.req.param();
  const chapters = await getMangaChapterByMangaIdAndChapterId(
    c.env.bagabondo_db,
    mangaId,
    chapterId,
  );
  if (!chapters) {
    return c.text("Chapter not found", 404);
  }
  return c.json(chapters);
});

export default app;
