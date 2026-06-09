export const buildVolumeCoverUrl = (volume: number): string =>
  `https://pub.moleve.net/covers/volume-${volume.toString()}.jpg`;

export const buildPageUrl = ({
  chapter,
  page,
}: {
  chapter: number;
  page: number;
}): string =>
  `https://pub.moleve.net/chapter-${chapter.toString()}/page-${page.toString()}.png`;
