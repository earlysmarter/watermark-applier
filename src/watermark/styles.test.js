import { describe, expect, it } from 'vitest';
import {
  DEFAULT_WATERMARK_STYLE_ID,
  getWatermarkStyle,
  listWatermarkStyles
} from './styles.js';

describe('watermark styles', () => {
  it('exposes user-facing styles with stable ids and layout options', () => {
    const styles = listWatermarkStyles();

    expect(styles.map((style) => style.id)).toEqual(['balanced', 'subtle', 'bold', 'compact']);
    expect(styles.every((style) => style.label && style.description)).toBe(true);
    expect(styles.every((style) => typeof style.options.opacity === 'number')).toBe(true);
  });

  it('returns copies so callers cannot mutate shared style definitions', () => {
    const style = getWatermarkStyle('bold');
    style.options.opacity = 0.01;

    expect(getWatermarkStyle('bold').options.opacity).toBeGreaterThan(0.2);
  });

  it('falls back to the default balanced style for unknown style ids', () => {
    expect(DEFAULT_WATERMARK_STYLE_ID).toBe('balanced');
    expect(getWatermarkStyle('missing-style')).toEqual(getWatermarkStyle('balanced'));
  });
});
