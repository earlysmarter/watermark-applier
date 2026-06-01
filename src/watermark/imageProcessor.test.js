import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  drawWatermarkLayer,
  getOutputDescriptor,
  isSupportedImageFile
} from './imageProcessor.js';

describe('isSupportedImageFile', () => {
  it('accepts common browser-decodable image files by extension or MIME type', () => {
    expect(isSupportedImageFile({ name: 'photo.JPG', type: '' })).toBe(true);
    expect(isSupportedImageFile({ name: 'poster', type: 'image/png' })).toBe(true);
    expect(isSupportedImageFile({ name: 'card.webp', type: 'image/webp' })).toBe(true);
  });

  it('rejects non-image files and generated result folders', () => {
    expect(isSupportedImageFile({ name: 'notes.txt', type: 'text/plain' })).toBe(false);
    expect(isSupportedImageFile({ name: 'vector.svg', type: 'image/svg+xml' })).toBe(false);
  });
});

describe('getOutputDescriptor', () => {
  it('preserves browser canvas output formats for jpg, png, and webp', () => {
    expect(getOutputDescriptor({ name: 'photo.jpg', type: 'image/jpeg' })).toEqual({
      fileName: 'photo.jpg',
      mimeType: 'image/jpeg',
      quality: 0.92
    });

    expect(getOutputDescriptor({ name: 'card.webp', type: 'image/webp' })).toEqual({
      fileName: 'card.webp',
      mimeType: 'image/webp',
      quality: 0.92
    });
  });

  it('converts formats canvas cannot reliably export back to png', () => {
    expect(getOutputDescriptor({ name: 'animated.gif', type: 'image/gif' })).toEqual({
      fileName: 'animated.png',
      mimeType: 'image/png',
      quality: undefined
    });
  });
});

describe('drawWatermarkLayer', () => {
  const originalDocument = globalThis.document;

  afterEach(() => {
    globalThis.document = originalDocument;
  });

  it('draws the original logo image so illustration details are preserved', () => {
    globalThis.document = {
      createElement: vi.fn(() => {
        throw new Error('offscreen tint canvas should not be created');
      })
    };
    const logoImage = {
      naturalWidth: 535,
      naturalHeight: 223
    };
    const context = createFakeCanvasContext();

    drawWatermarkLayer(context, {
      imageWidth: 320,
      imageHeight: 240,
      logoImage,
      options: {
        tint: '#eaffaa',
        opacity: 0.22
      }
    });

    expect(context.drawImage).toHaveBeenCalled();
    expect(context.drawImage.mock.calls.every((call) => call[0] === logoImage)).toBe(true);
    expect(globalThis.document.createElement).not.toHaveBeenCalled();
  });
});

function createFakeCanvasContext() {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    set globalAlpha(value) {
      this.alpha = value;
    }
  };
}
