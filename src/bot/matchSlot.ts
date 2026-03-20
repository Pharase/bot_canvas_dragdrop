import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export type SlotResult = {
  slotIndex: number;
  matchedName: string;
  score: number;
};

export function matchSlot(
  slotIndex: number,
  slotImg: PNG,
  templates: Record<string, PNG>
): SlotResult {
  let best: SlotResult = {
    slotIndex,
    matchedName: '',
    score: Infinity
  };

  for (const [name, tpl] of Object.entries(templates)) {
    if (tpl.width !== slotImg.width || tpl.height !== slotImg.height) continue;

    const diff = pixelmatch(
      slotImg.data,
      tpl.data,
      null,
      tpl.width,
      tpl.height,
      { threshold: 0.15 }
    );

    if (diff < best.score) {
      best.matchedName = name;
      best.score = diff;
    }
  }

  return best;
}