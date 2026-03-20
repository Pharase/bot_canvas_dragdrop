import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';

type SlotResult = {
  slotIndex: number;
  matchedName: string;
  score: number;
};

export function matchSlot(
  slotImg: PNG,
  templates: Record<string, PNG>
): SlotResult {
  let best: SlotResult = {
    slotIndex: -1,
    matchedName: '',
    score: Infinity
  };

  for (const [name, tpl] of Object.entries(templates)) {
    if (
      tpl.width !== slotImg.width ||
      tpl.height !== slotImg.height
    ) continue;

    const diff = pixelmatch(
      slotImg.data,
      tpl.data,
      null,
      tpl.width,
      tpl.height,
      { threshold: 0.15 }
    );

    if (diff < best.score) {
      best = {
        slotIndex: -1,
        matchedName: name,
        score: diff
      };
    }
  }

  return best;
}