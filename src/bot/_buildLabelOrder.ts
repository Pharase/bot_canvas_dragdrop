import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { toBlackWhite, whiteRatio } from './imageUtils';

export function buildLabelOrder(
  slotImages: PNG[],
  templates: Record<string, PNG>
): string[] {

  const debugDir = path.resolve(__dirname, '../../debug');
  fs.mkdirSync(debugDir, { recursive: true });

  // 🔹 preprocess templates
  const tplStats = Object.entries(templates).map(([name, tpl]) => {
    const bw = toBlackWhite(tpl);
    const ratio = whiteRatio(bw);

    fs.writeFileSync(
      path.join(debugDir, `tpl-${name}-bw.png`),
      PNG.sync.write(bw)
    );

    return { name, ratio };
  });

  const used = new Set<string>();
  const result: string[] = [];

  // 🔹 match each slot
  slotImages.forEach((slot, index) => {
    const bwSlot = toBlackWhite(slot);
    const slotRatio = whiteRatio(bwSlot);

    fs.writeFileSync(
      path.join(debugDir, `slot-${index}-bw.png`),
      PNG.sync.write(bwSlot)
    );

    let best = { name: '', diff: Infinity };

    for (const tpl of tplStats) {
      if (used.has(tpl.name)) continue; // 🚫 prevent duplicate

      const diff = Math.abs(slotRatio - tpl.ratio);
      if (diff < best.diff) {
        best = { name: tpl.name, diff };
      }
    }

    if (!best.name) {
      throw new Error(`No available label for slot ${index}`);
    }

    used.add(best.name);
    result.push(best.name);

    console.log(
      `Label slot ${index} → ${best.name} (whiteRatio diff=${best.diff.toFixed(4)})`
    );
  });

  return result;
}