export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Read Vagabond Manga Online",
    url: "https://readbagabondo.com",
    description:
      "Read Vagabond manga online for free and without any ads, with high-quality scans",
    publisher: {
      "@type": "Person",
      name: "Leonardo",
      logo: {
        "@type": "ImageObject",
        url: "https://readbagabondo.com/Vagabond_Logo.png",
      },
    },
    potentialAction: {
      "@type": "ReadAction",
      target: "https://readbagabondo.com",
    },
  };
}

export function getComicSeriesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ComicSeries",
    name: "Vagabond",
    author: {
      "@type": "Person",
      name: "Takehiko Inoue",
    },
    numberOfEpisodes: 327, // TODO: Retrieve from database
    genre: ["Action", "Drama", "Historical", "Martial Arts", "Seinen"],
    description:
      "Vagabond is a critically acclaimed, epic historical manga by Takehiko Inoue, based on Eiji Yoshikawa's novel Musashi. It tells the fictionalized life story of legendary swordsman Musashi Miyamoto as he transforms from a wild, violent young man into a disciplined, philosophical warrior seeking the meaning of strength and enlightenment",
    image: "https://readbagabondo.com/Musashi_Eating.webp",
  };
}

export function getBreadcrumbSchema(volume: number) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://readbagabondo.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Volume ${volume}`,
        item: `https://readbagabondo.com/volume-${volume}`,
      },
    ],
  };
}

export function getBookSchema(
  volume: number,
  releaseDate: string,
  coverUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: `Vagabond Volume ${volume}`,
    author: {
      "@type": "Person",
      name: "Takehiko Inoue",
    },
    bookFormat: "GraphicNovel",
    genre: ["Action", "Drama", "Historical", "Martial Arts", "Seinen"],
    image: `${coverUrl}`,
    url: `https://readbagabondo.com/volume-${volume}`,
    datePublished: releaseDate,
    isPartOf: {
      "@type": "BookSeries",
      name: "Vagabond",
    },
  };
}

export function getChapterBreadcrumbSchema(
  chapterVolume: string,
  chapterNumber: number,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://readbagabondo.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Volume ${chapterVolume}`,
        item: `https://readbagabondo.com/volume-${chapterVolume}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Chapter ${chapterNumber}`,
        item: `https://readbagabondo.com/volume-${chapterVolume}/chapter-${chapterNumber}`,
      },
    ],
  };
}

export function getChapterSchema(
  chapterTitle: string,
  chapterVolume: string,
  chapterNumber: number,
  chapterPageCount: number,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ComicIssue",
    name: `Chapter ${chapterNumber}: ${chapterTitle}`,
    issueNumber: chapterNumber,
    author: {
      "@type": "Person",
      name: "Takehiko Inoue",
    },
    numberOfPages: chapterPageCount,
    genre: ["Action", "Drama", "Historical", "Martial Arts", "Seinen"],
    url: `https://readbagabondo.com/volume-${chapterVolume}/chapter-${chapterNumber}`,
    isPartOf: {
      "@type": "ComicSeries",
      name: "Vagabond",
    },
  };
}
