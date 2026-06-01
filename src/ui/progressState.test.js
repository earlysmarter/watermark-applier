import { describe, expect, it } from 'vitest';
import { formatProgressState } from './progressState.js';

describe('formatProgressState', () => {
  it('formats ready, progress, and done states for the UI', () => {
    expect(formatProgressState({ type: 'ready', total: 3, completed: 0, failed: 0 })).toEqual({
      title: 'Found 3 images.',
      percent: 0
    });

    expect(formatProgressState({ type: 'completed', total: 4, completed: 2, failed: 1 })).toEqual({
      title: '3 / 4 processed.',
      percent: 75
    });

    expect(formatProgressState({ type: 'done', total: 4, completed: 3, failed: 1 })).toEqual({
      title: 'Done: 3 saved, 1 failed.',
      percent: 100
    });
  });

  it('uses the singular form for one image', () => {
    expect(formatProgressState({ type: 'ready', total: 1, completed: 0, failed: 0 })).toEqual({
      title: 'Found 1 image.',
      percent: 0
    });
  });
});
