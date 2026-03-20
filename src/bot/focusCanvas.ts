import { Page } from 'playwright';

export async function focusCanvas(page: Page) {
  const canvas = page.locator('canvas');
  await canvas.waitFor();
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas not found');

  await page.mouse.move(
    box.x + box.width / 2,
    box.y + box.height / 2
  );
  await page.mouse.click(
    box.x + box.width / 2,
    box.y + box.height / 2
  );
}
