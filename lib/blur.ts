/** Neutral dark placeholder for below-the-fold <Image placeholder="blur">.
 *  The screenshots are photographic and all sit on the same surface tone,
 *  so a flat surface-coloured rect reads better than a per-image blur and
 *  costs nothing at build time. */
export const BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="10"><rect width="16" height="10" fill="#15181c"/></svg>'
  );
