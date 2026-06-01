import { describe, expect, it } from 'vitest';
import { createWatermarkLayout } from './layout.js';

describe('createWatermarkLayout', () => {
  it('creates a repeated diagonal layout that covers the image beyond each edge', () => {
    const layout = createWatermarkLayout({
      imageWidth: 1000,
      imageHeight: 1400,
      logoWidth: 520,
      logoHeight: 170
    });

    expect(layout.angleDegrees).toBe(-14);
    expect(layout.opacity).toBeCloseTo(0.22);
    expect(layout.tile.width).toBeGreaterThan(120);
    expect(layout.tile.height).toBeGreaterThan(35);
    expect(layout.positions.length).toBeGreaterThan(20);

    const xs = layout.positions.map((position) => position.x);
    const ys = layout.positions.map((position) => position.y);

    expect(Math.min(...xs)).toBeLessThan(0);
    expect(Math.min(...ys)).toBeLessThan(0);
    expect(Math.max(...xs)).toBeGreaterThan(1000);
    expect(Math.max(...ys)).toBeGreaterThan(1400);
  });

  it('keeps the watermark size proportional on small images', () => {
    const layout = createWatermarkLayout({
      imageWidth: 320,
      imageHeight: 240,
      logoWidth: 520,
      logoHeight: 170
    });

    expect(layout.tile.width).toBeGreaterThanOrEqual(96);
    expect(layout.tile.width).toBeLessThanOrEqual(130);
    expect(layout.tile.height).toBeCloseTo(layout.tile.width * (170 / 520), 4);
  });
});
