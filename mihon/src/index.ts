import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { createDb, type Db } from "../../db";
import {
  getMangaById,
  getMangaChapterByMangaIdAndChapterId,
  getMangaChaptersByMangaId,
  getMangas,
} from "../../db/queries";

const app = new Hono<{ Bindings: CloudflareBindings; Variables: { db: Db } }>();

app.use(trimTrailingSlash());

app.use(async (c, next) => {
  c.set("db", createDb(c.env.bagabondo_db));
  await next();
});

app.get("/mangas", async (c) => {
  const mangas = await getMangas(c.var.db);
  return c.json(
    mangas.map((manga) => ({
      ...manga,
      status: "hiatus",
      cover: "https://pub.moleve.net/covers/volume-37.jpg",
    })),
  );
});

app.get("/mangas/:mangaId", async (c) => {
  const { mangaId } = c.req.param();
  const manga = await getMangaById(c.var.db, Number(mangaId));
  if (!manga) {
    return c.text("Manga not found", 404);
  }
  return c.json({
    ...manga,
    status: "hiatus",
    cover: "https://pub.moleve.net/covers/volume-37.jpg",
  });
});

app.get("/mangas/:mangaId/chapters", async (c) => {
  const { mangaId } = c.req.param();
  const chapters = await getMangaChaptersByMangaId(c.var.db, Number(mangaId));
  if (!chapters) {
    return c.text("Manga not found", 404);
  }
  return c.json(chapters);
});

app.get("/mangas/:mangaId/chapters/:chapterId", async (c) => {
  const { mangaId, chapterId } = c.req.param();
  const chapter = await getMangaChapterByMangaIdAndChapterId(
    c.var.db,
    Number(mangaId),
    Number(chapterId),
  );
  if (!chapter) {
    return c.text("Chapter not found", 404);
  }
  return c.json(chapter);
});

export default app;
