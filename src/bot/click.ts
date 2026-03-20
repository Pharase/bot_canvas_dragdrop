import { Page } from 'playwright';

export async function clickAt(
  page: Page,
  x: number,
  y: number,
  delay = 50
) {
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.waitForTimeout(delay);
  await page.mouse.up();
}
