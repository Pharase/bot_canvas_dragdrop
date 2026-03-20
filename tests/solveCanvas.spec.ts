import { test } from '@playwright/test';
import { clickAt } from '../src/bot/click';
import { solveCanvas } from '../src/bot/solveCanvas';
import { waitForCanvasStable } from '../src/bot/waitForCanvasStable';

test('Solve Wordwall Canvas', async ({ page }) => {

  await page.goto('https://wordwall.net/play/105404/955/240');
  await page.getByRole('textbox', { name: 'Name...' }).fill('grey Hacker (คุณเทา)');
  await page.getByRole('button', { name: 'Start' }).click();

  await page.waitForSelector('canvas');

  // 🔥 รอจน canvas "นิ่งจริง"
  await waitForCanvasStable(page);

  // click เริ่มเกม
  await clickAt(page, 640, 680);

  await page.waitForTimeout(200);

  // ค่อยลาก
  await solveCanvas(page);

  await clickAt(page, 640, 680);

  await page.pause();
});