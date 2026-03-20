import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export function matchText(
  slot: PNG,
  templates: Record<string, PNG>
) {
  let best = { name: '', diff: Infinity };

  for (const [name, tpl] of Object.entries(templates)) {
    if (tpl.width !== slot.width || tpl.height !== slot.height) continue;

    const diff = pixelmatch(
      slot.data,
      tpl.data,
      null,
      tpl.width,
      tpl.height,
      { threshold: 0.1 }
    );

    if (diff < best.diff) {
      best = { name, diff };
    }
  }

  return best;
}
