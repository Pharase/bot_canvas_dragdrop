import { Page } from 'playwright';
import { Point } from './types';

/**
 * บังคับ focus ให้ canvas รับ mouse event
 */
export async function focusCanvas(page: Page) {
  const canvas = page.locator('canvas');
  await canvas.click({ force: true });
  await page.waitForTimeout(300);
}

/**
 * วาดจุดแดง debug ดูตำแหน่งจริง
 */
export async function debugDot(
  page: Page,
  point: Point,
  color = 'red'
) {
  await page.evaluate(({ x, y, color }) => {
    const d = document.createElement('div');
    d.style.position = 'fixed';
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.style.width = '10px';
    d.style.height = '10px';
    d.style.background = color;
    d.style.borderRadius = '50%';
    d.style.zIndex = '9999';
    document.body.appendChild(d);
  }, { ...point, color });
}

/**
 * คำนวณตำแหน่ง label และ drop zone (แนวนอน 4 รูป)
 */
export function getHorizontalSlots(
  width: number,
  labelY: number,
  dropY: number
) {

  const xsup = [0.25, 0.407, 0.56, 0.72];
  const xsd = [0.15, 0.39, 0.625, 0.865];

  return {
    labels: xsup.map(x => ({ x: width * x, y: labelY })),
    drops: xsd.map(x => ({ x: width * x, y: dropY })),
  };
}
