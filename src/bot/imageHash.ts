import { PNG } from 'pngjs';

/**
 * dHash for TEXT ONLY
 * - background → black
 * - text → white
 */
export function dHash(img: PNG): string {
  const size = 9; // 9x8 for dHash
  const resized = resizeBinary(img, size, 8);

  let hash = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const left = resized[y][x];
      const right = resized[y][x + 1];
      hash += left > right ? '1' : '0';
    }
  }
  return hash;
}

/**
 * Resize + binarize (NO grayscale)
 * white text = 255
 * black background = 0
 */
function resizeBinary(
  img: PNG,
  w: number,
  h: number,
  threshold = 210
): number[][] {
  const out: number[][] = [];

  for (let y = 0; y < h; y++) {
    out[y] = [];
    for (let x = 0; x < w; x++) {
      const srcX = Math.floor((x / w) * img.width);
      const srcY = Math.floor((y / h) * img.height);
      const i = (srcY * img.width + srcX) * 4;

      const r = img.data[i];
      const g = img.data[i + 1];
      const b = img.data[i + 2];

      // TEXT vs BACKGROUND
      const v =
        r > threshold &&
        g > threshold &&
        b > threshold
          ? 255
          : 0;

      out[y][x] = v;
    }
  }

  return out;
}

/**
 * Hamming distance
 */
export function hamming(a: string, b: string): number {
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) d++;
  }
  return d;
}