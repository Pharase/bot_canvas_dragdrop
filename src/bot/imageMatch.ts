import { Page } from 'playwright';

export async function canvasContainsTemplate(
  page: Page,
  templateBase64: string,
  threshold = 0.7
): Promise<boolean> {

  return await page.evaluate(({ templateBase64, threshold }) => {
    const canvas = document.querySelector('canvas')!;
    const ctx = canvas.getContext('2d')!;

    const tplImg = new Image();
    tplImg.src = templateBase64;

    return new Promise<boolean>((resolve) => {
      tplImg.onload = () => {
        const w = tplImg.width;
        const h = tplImg.height;

        // crop กลาง canvas
        const x = Math.floor(canvas.width / 2 - w / 2);
        const y = Math.floor(canvas.height / 2 - h / 2);

        const canvasData = ctx.getImageData(x, y, w, h).data;

        const off = document.createElement('canvas');
        off.width = w;
        off.height = h;
        const offCtx = off.getContext('2d')!;
        offCtx.drawImage(tplImg, 0, 0);
        const tplData = offCtx.getImageData(0, 0, w, h).data;

        let same = 0;
        let total = w * h;

        for (let i = 0; i < tplData.length; i += 4) {
          const dr = Math.abs(tplData[i] - canvasData[i]);
          const dg = Math.abs(tplData[i + 1] - canvasData[i + 1]);
          const db = Math.abs(tplData[i + 2] - canvasData[i + 2]);

          if (dr + dg + db < 30) same++;
        }

        resolve(same / total >= threshold);
      };
    });
  }, { templateBase64, threshold });
}
