import { describe, expect, it } from 'vitest';
import { collectImageEntries } from './folderProcessor.js';

describe('collectImageEntries', () => {
  it('collects supported images recursively and ignores the result folder', async () => {
    const root = fakeDirectory({
      'one.jpg': fakeFile('one.jpg', 'image/jpeg'),
      'notes.txt': fakeFile('notes.txt', 'text/plain'),
      nested: fakeDirectory({
        'two.png': fakeFile('two.png', 'image/png')
      }),
      result: fakeDirectory({
        'old.png': fakeFile('old.png', 'image/png')
      })
    });

    const entries = await collectImageEntries(root);

    expect(entries.map((entry) => entry.relativePath)).toEqual([
      'nested/two.png',
      'one.jpg'
    ]);
  });
});

function fakeFile(name, type) {
  return {
    kind: 'file',
    name,
    async getFile() {
      return { name, type };
    }
  };
}

function fakeDirectory(children) {
  return {
    kind: 'directory',
    async *entries() {
      for (const [name, handle] of Object.entries(children)) {
        yield [name, handle];
      }
    }
  };
}
