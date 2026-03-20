import { Page } from 'playwright';
import { Point } from './types';

export async function drag(
  page: Page,
  from: Point,
  to: Point
) {
  await page.evaluate(({ from, to }) => {
    const canvas = document.querySelector('canvas')!;
    const rect = canvas.getBoundingClientRect();

    const fire = (type: string, x: number, y: number) => {
      canvas.dispatchEvent(
        new PointerEvent(type, {
          clientX: rect.left + x,
          clientY: rect.top + y,
          pointerId: 1,
          pointerType: 'mouse',
          buttons: 1,
          bubbles: true,
          cancelable: true
        })
      );
    };

    fire('pointerdown', from.x, from.y);

    const steps = 25;
    for (let i = 1; i <= steps; i++) {
      fire(
        'pointermove',
        from.x + (to.x - from.x) * (i / steps),
        from.y + (to.y - from.y) * (i / steps)
      );
    }

    fire('pointerup', to.x, to.y);
  }, { from, to });
}
