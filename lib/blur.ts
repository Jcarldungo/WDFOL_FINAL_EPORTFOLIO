/** Neutral placeholder for below-the-fold <Image placeholder="blur">.
 *  A flat mid-grey rect reads fine under both themes and costs nothing at
 *  build time (the screenshots are photographic, so a real per-image blur
 *  would add weight for little gain). */
export const BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="10"><rect width="16" height="10" fill="#8b8f94"/></svg>'
  );
