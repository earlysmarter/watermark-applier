export const DEFAULT_WATERMARK_STYLE_ID = 'balanced';

const WATERMARK_STYLES = [
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Default diagonal watermark spacing for everyday exports.',
    options: {
      angleDegrees: -14,
      opacity: 0.22,
      maxTileWidthRatio: 0.22,
      minTileWidth: 96,
      gapXRatio: 0.62,
      gapYRatio: 1.05
    }
  },
  {
    id: 'subtle',
    label: 'Subtle',
    description: 'Lower opacity and wider spacing for lighter brand presence.',
    options: {
      angleDegrees: -14,
      opacity: 0.14,
      maxTileWidthRatio: 0.2,
      minTileWidth: 88,
      gapXRatio: 0.9,
      gapYRatio: 1.3
    }
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Larger, stronger marks for high-visibility protection.',
    options: {
      angleDegrees: -16,
      opacity: 0.3,
      maxTileWidthRatio: 0.28,
      minTileWidth: 120,
      gapXRatio: 0.44,
      gapYRatio: 0.82
    }
  },
  {
    id: 'compact',
    label: 'Compact',
    description: 'Smaller repeated marks for dense image grids and previews.',
    options: {
      angleDegrees: -10,
      opacity: 0.2,
      maxTileWidthRatio: 0.16,
      minTileWidth: 72,
      gapXRatio: 0.48,
      gapYRatio: 0.86
    }
  }
];

export function listWatermarkStyles() {
  return WATERMARK_STYLES.map(copyStyle);
}

export function getWatermarkStyle(styleId) {
  return copyStyle(
    WATERMARK_STYLES.find((style) => style.id === styleId) ??
      WATERMARK_STYLES.find((style) => style.id === DEFAULT_WATERMARK_STYLE_ID)
  );
}

function copyStyle(style) {
  return {
    ...style,
    options: {
      ...style.options
    }
  };
}
