import { Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

type SlotPos = { x: number; y: number };
type Crop = { x: number; y: number; w: number; h: number };

export async function captureSlots(
  page: Page,
  slots: SlotPos[],
  crops: Crop[]
): Promise<PNG[]> {
  const debugDir = path.resolve(__dirname, '..', 'debug');

  if (!fs.existsSync(debugDir)) {
    fs.mkdirSync(debugDir, { recursive: true });
  }

  const results: PNG[] = [];

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const crop = crops[0]; // ใช้ crop เดียวกันทุก slot

    const clip = {
      x: Math.round(slot.x + crop.x),
      y: Math.round(slot.y + crop.y),
      width: Math.round(crop.w),
      height: Math.round(crop.h)
    };

    const buffer = await page.screenshot({ clip });

    // 🔹 save debug png
    const debugPath = path.join(debugDir, `slot_${i}.png`);
    fs.writeFileSync(debugPath, buffer);

    // 🔹 parse to PNG for pixelmatch
    const png = PNG.sync.read(buffer);
    results.push(png);
  }

  return results;
}