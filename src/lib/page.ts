export const buildVolumeCoverUrl = (volume: number): string =>
  `https://vagabond.b-cdn.net/covers/volume-${volume.toString()}.jpg`;

export const buildPageUrl = ({
  chapter,
  page,
}: {
  volume: number;
  chapter: number;
  page: number;
}): string =>
  `https://vagabond.b-cdn.net/chapter-${chapter.toString()}/page-${page.toString()}.png`;
