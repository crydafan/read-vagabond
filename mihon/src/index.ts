import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { createDb, type Db } from "../../db";
import {
  getMangaById,
  getMangaChapterByMangaIdAndChapterId,
  getMangaChaptersByMangaId,
  getMangas,
} from "../../db/queries";

const app = new Hono<{ Bindings: CloudflareBindings; Variables: { db: Db } }>().basePath(
  "/api/mihon",
);

app.use(trimTrailingSlash());

app.use(async (c, next) => {
  c.set("db", createDb(c.env.bagabondo_db));
  await next();
});

const PAGE_SIZE = 20;

app.get("/mangas", async (c) => {
  const q = c.req.query("q")?.trim();
  const page = Math.max(1, Number(c.req.query("page")) || 1);

  const mangas = await getMangas(c.var.db);

  const filtered = q
    ? mangas.filter((manga) => manga.title === q)
    : mangas;

  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return c.json(
    paginated.map((manga) => ({
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
