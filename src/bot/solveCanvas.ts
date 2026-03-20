import { Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

import { debugDot, getHorizontalSlots } from './canvas';
import { focusCanvas } from './focusCanvas';
import { captureSlots } from './captureSlots';
import { captureSlotsAns } from './captureSlotAns';
import { buildIndexMapping } from './buildMapping';
import { buildLabelOrder } from './buildLabelOrder';

export async function solveCanvas(page: Page) {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('Viewport not set');

  const { width, height } = viewport;

  await focusCanvas(page);

  // 🔹 slot positions
  const { labels: labelPos, drops: dropPos } = getHorizontalSlots(
    width,
    height * 0.22,
    height * 0.35
  );

  // 🔹 known labels (template names)
  const labelNames = ['UnA', 'UnC', 'ACC', 'NM'];

  // 🔹 load templates
  // 🔹 load LABEL templates (ACC_l.png)
  const labelTemplates: Record<string, PNG> = {};
  for (const name of labelNames) {
    const p = path.resolve(__dirname, '..', 'templates', `${name}_l.png`);
    labelTemplates[name] = PNG.sync.read(fs.readFileSync(p));
  }

  // 🔹 load SLOT templates (ACC.png)
  const slotTemplates: Record<string, PNG> = {};
  for (const name of labelNames) {
    const p = path.resolve(__dirname, '..', 'templates', `${name}.png`);
    slotTemplates[name] = PNG.sync.read(fs.readFileSync(p));
  }

  // 🔹 crop area (relative to drop slot)
  const cropslabel = [{ x: -75, y: -15, w: 190, h: 30 }];
  const crops = [{ x: -110, y: -40, w: 200, h: 400 }];

  // 🔹 capture slot images
  await page.waitForTimeout(150);
  
  const slotImagesAnswer = await captureSlotsAns(page, labelPos, cropslabel);
  const slotImages = await captureSlots(page, dropPos, crops);

  if (slotImagesAnswer.length !== labelNames.length) {
    throw new Error('Answer image count mismatch');
  }

  if (slotImages.length !== labelNames.length) {
    throw new Error('Slot image count mismatch');
  }

  // 🔹 detect label order from images (NEW)
  // Stage 1: detect visual order of answer labels (top row)
  const labelOrder = buildLabelOrder(slotImagesAnswer, labelTemplates);

  // Stage 2: detect which drop slot corresponds to each label
  const mapping = buildIndexMapping(slotImages, slotTemplates, labelOrder);

  console.log('Detected labelOrder:', labelOrder);

  console.log('Mapping:', mapping);

  // 🔹 drag according to mapping
  for (let i = 0; i < labelOrder.length; i++) {
    const dropIndex = mapping[i];

    await debugDot(page, labelPos[0], 'red');
    await page.mouse.move(labelPos[0].x, labelPos[0].y);
    await page.mouse.down();

    await debugDot(page, dropPos[dropIndex], 'blue');
    await page.mouse.move(dropPos[dropIndex].x, dropPos[dropIndex].y);

    await page.mouse.up();
    await page.waitForTimeout(110);
  }
}