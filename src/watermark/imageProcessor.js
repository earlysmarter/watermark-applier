import { createWatermarkLayout } from './layout.js';

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']);
const EXPORTABLE_TYPES = new Map([
  ['.jpg', { mimeType: 'image/jpeg', quality: 0.92 }],
  ['.jpeg', { mimeType: 'image/jpeg', quality: 0.92 }],
  ['.png', { mimeType: 'image/png', quality: undefined }],
  ['.webp', { mimeType: 'image/webp', quality: 0.92 }]
]);

export function isSupportedImageFile(file) {
  const extension = getExtension(file.name);

  if (SUPPORTED_EXTENSIONS.has(extension)) {
    return true;
  }

  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'].includes(file.type);
}

export function getOutputDescriptor(file) {
  const originalExtension = getExtension(file.name);
  const exportInfo = EXPORTABLE_TYPES.get(originalExtension) ?? {
    mimeType: 'image/png',
    quality: undefined
  };
  const fileName = exportInfo.mimeType === 'image/png' && !EXPORTABLE_TYPES.has(originalExtension)
    ? replaceExtension(file.name, '.png')
    : file.name;

  return {
    fileName,
    mimeType: exportInfo.mimeType,
    quality: exportInfo.quality
  };
}

export async function applyWatermarkToFile(file, logoImage, options = {}) {
  const sourceImage = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = sourceImage.naturalWidth;
  canvas.height = sourceImage.naturalHeight;
  context.drawImage(sourceImage, 0, 0);

  drawWatermarkLayer(context, {
    imageWidth: canvas.width,
    imageHeight: canvas.height,
    logoImage,
    options
  });

  const output = getOutputDescriptor(file);
  const blob = await canvasToBlob(canvas, output.mimeType, output.quality);

  return {
    blob,
    fileName: output.fileName,
    width: canvas.width,
    height: canvas.height
  };
}

export function drawWatermarkLayer(context, { imageWidth, imageHeight, logoImage, options = {} }) {
  const layout = createWatermarkLayout({
    imageWidth,
    imageHeight,
    logoWidth: logoImage.naturalWidth || logoImage.width,
    logoHeight: logoImage.naturalHeight || logoImage.height,
    options
  });

  context.save();
  context.globalAlpha = options.opacity ?? layout.opacity;

  for (const position of layout.positions) {
    context.save();
    context.translate(position.x + layout.tile.width / 2, position.y + layout.tile.height / 2);
    context.rotate((layout.angleDegrees * Math.PI) / 180);
    context.drawImage(
      logoImage,
      -layout.tile.width / 2,
      -layout.tile.height / 2,
      layout.tile.width,
      layout.tile.height
    );
    context.restore();
  }

  context.restore();
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error('Could not create an output image blob.'));
    }, mimeType, quality);
  });
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name} as an image.`));
    };
    image.src = url;
  });
}

function getExtension(fileName) {
  const match = fileName.toLowerCase().match(/\.[^.]+$/);
  return match ? match[0] : '';
}

function replaceExtension(fileName, extension) {
  return fileName.replace(/\.[^.]+$/, '') + extension;
}
