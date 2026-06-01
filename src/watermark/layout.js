const DEFAULTS = {
  angleDegrees: -14,
  opacity: 0.22,
  maxTileWidthRatio: 0.22,
  minTileWidth: 96,
  gapXRatio: 0.62,
  gapYRatio: 1.05,
  bleedRatio: 1.25
};

export function createWatermarkLayout({
  imageWidth,
  imageHeight,
  logoWidth,
  logoHeight,
  options = {}
}) {
  const settings = { ...DEFAULTS, ...options };
  const aspectRatio = logoHeight / logoWidth;
  const tileWidth = Math.max(
    settings.minTileWidth,
    Math.round(imageWidth * settings.maxTileWidthRatio)
  );
  const tileHeight = tileWidth * aspectRatio;
  const gapX = tileWidth * settings.gapXRatio;
  const gapY = tileHeight * settings.gapYRatio;
  const bleed = Math.max(tileWidth, tileHeight) * settings.bleedRatio;
  const positions = [];

  for (let y = -bleed; y <= imageHeight + bleed; y += tileHeight + gapY) {
    const rowIndex = Math.round((y + bleed) / (tileHeight + gapY));
    const stagger = rowIndex % 2 === 0 ? 0 : (tileWidth + gapX) / 2;

    for (let x = -bleed - stagger; x <= imageWidth + bleed; x += tileWidth + gapX) {
      positions.push({
        x: Math.round(x),
        y: Math.round(y)
      });
    }
  }

  return {
    angleDegrees: settings.angleDegrees,
    opacity: settings.opacity,
    tile: {
      width: tileWidth,
      height: tileHeight
    },
    positions
  };
}
