import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import { dHash, hamming } from './imageHash';
import { toBlackWhite } from './imageUtils';

export function buildLabelOrder(
  slotImages: PNG[],
  templates: Record<string, PNG>
): string[] {

  const debugDir = path.resolve(__dirname, '../../debug');
  fs.mkdirSync(debugDir, { recursive: true });

  // 🔹 preprocess templates → binary + hash
  const tplStats = Object.entries(templates).map(([name, tpl]) => {
    const bw = toBlackWhite(tpl);
    const hash = dHash(bw);

    fs.writeFileSync(
      path.join(debugDir, `tpl-${name}-bw.png`),
      PNG.sync.write(bw)
    );

    return { name, hash };
  });

  const used = new Set<string>();
  const result: string[] = [];

  // 🔹 match each slot
  slotImages.forEach((slot, index) => {
    const bwSlot = toBlackWhite(slot);
    const slotHash = dHash(bwSlot);

    fs.writeFileSync(
      path.join(debugDir, `slot-${index}-bw.png`),
      PNG.sync.write(bwSlot)
    );

    let best = { name: '', dist: Infinity };

    for (const tpl of tplStats) {
      if (used.has(tpl.name)) continue; // 🚫 prevent duplicate

      const dist = hamming(slotHash, tpl.hash);
      if (dist < best.dist) {
        best = { name: tpl.name, dist };
      }
    }

    if (!best.name) {
      throw new Error(`No available label for slot ${index}`);
    }

    used.add(best.name);
    result.push(best.name);

    console.log(
      `Label slot ${index} → ${best.name} (hamming=${best.dist})`
    );
  });

  return result;
}
