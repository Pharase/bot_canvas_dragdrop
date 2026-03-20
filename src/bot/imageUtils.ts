import { PNG } from 'pngjs';

/** Convert to pure black & white (text = white) */
export function toBlackWhite(
  src: PNG,
  threshold = 200
): PNG {
  const out = new PNG({ width: src.width, height: src.height });

  for (let i = 0; i < src.data.length; i += 4) {
    const r = src.data[i];
    const g = src.data[i + 1];
    const b = src.data[i + 2];

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const v = gray > threshold ? 255 : 0;

    out.data[i]     = v;
    out.data[i + 1] = v;
    out.data[i + 2] = v;
    out.data[i + 3] = 255;
  }

  return out;
}

/** Calculate ratio of white pixels */
export function whiteRatio(img: PNG): number {
  let white = 0;
  const total = img.width * img.height;

  for (let i = 0; i < img.data.length; i += 4) {
    if (img.data[i] === 255) white++;
  }

  return white / total;
}
