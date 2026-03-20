import { Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

export async function waitForCanvasStable(
  page: Page,
  {
    diffThreshold = 0.02,
    timeoutMs = 15000,
    pollMs = 200,
    debug = true
  } = {}
) {
  const canvas = page.locator('canvas');
  await canvas.waitFor({ timeout: timeoutMs });

  const debugDir = path.resolve(__dirname, '../../debug');
  if (debug && !fs.existsSync(debugDir)) {
    fs.mkdirSync(debugDir, { recursive: true });
  }

  const templatePath = path.resolve(__dirname, '../templates/start.png');
  const template = PNG.sync.read(fs.readFileSync(templatePath));

  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const buffer = await canvas.screenshot();
    const current = PNG.sync.read(buffer);

    // 🔍 SIZE MISMATCH → save + retry
    if (
      current.width !== template.width ||
      current.height !== template.height
    ) {
      if (debug) {
        fs.writeFileSync(
          path.join(debugDir, `size-mismatch-${Date.now()}.png`),
          buffer
        );
      }
      await page.waitForTimeout(pollMs);
      continue;
    }

    const diffPixels = pixelmatch(
      current.data,
      template.data,
      null,
      current.width,
      current.height,
      { threshold: 0.15 }
    );

    const diffRatio =
      diffPixels / (current.width * current.height);

    if (diffRatio <= diffThreshold) {
      return; // ✅ stable
    }

    await page.waitForTimeout(pollMs);
  }

  throw new Error('Start canvas image not detected within timeout');
}