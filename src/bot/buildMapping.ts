import { PNG } from 'pngjs';
import { matchSlot } from './matchSlot';

export function buildIndexMapping(
  slotImages: PNG[],
  templates: Record<string, PNG>,
  labelOrder: string[]
): number[] {
  const results = slotImages.map((img, i) =>
    matchSlot(i, img, templates)
  );

  return labelOrder.map(label => {
    const found = results.find(
      r => r.matchedName === normalize(label)
    );

    if (!found) {
      throw new Error(
        `No match for ${label}. Results: ${JSON.stringify(results)}`
      );
    }

    return found.slotIndex;
  });
}

function normalize(name: string) {
  return name.replace(/\.png$/i, '');
}