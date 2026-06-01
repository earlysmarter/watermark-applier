import { applyWatermarkToFile, isSupportedImageFile } from '../watermark/imageProcessor.js';

const RESULT_FOLDER_NAME = 'result';

export async function collectImageEntries(directoryHandle, options = {}) {
  const resultFolderName = options.resultFolderName ?? RESULT_FOLDER_NAME;
  const entries = [];

  await collectFromDirectory(directoryHandle, {
    entries,
    prefix: '',
    resultFolderName
  });

  return entries.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

export async function processDirectory(directoryHandle, logoImage, options = {}) {
  const onProgress = options.onProgress ?? (() => {});
  const imageEntries = await collectImageEntries(directoryHandle);
  const resultDirectory = await directoryHandle.getDirectoryHandle(RESULT_FOLDER_NAME, { create: true });
  const summary = {
    total: imageEntries.length,
    completed: 0,
    failed: 0,
    errors: []
  };

  onProgress({ type: 'ready', ...summary });

  for (const entry of imageEntries) {
    try {
      onProgress({ type: 'processing', entry, ...summary });
      const output = await applyWatermarkToFile(entry.file, logoImage, options.watermark);
      await writeBlobToResult(resultDirectory, entry.relativePath, output.fileName, output.blob);
      summary.completed += 1;
      onProgress({ type: 'completed', entry, output, ...summary });
    } catch (error) {
      summary.failed += 1;
      summary.errors.push({
        path: entry.relativePath,
        message: error.message
      });
      onProgress({ type: 'failed', entry, error, ...summary });
    }
  }

  onProgress({ type: 'done', ...summary });
  return summary;
}

async function collectFromDirectory(directoryHandle, { entries, prefix, resultFolderName }) {
  for await (const [name, handle] of directoryHandle.entries()) {
    if (handle.kind === 'directory') {
      if (name.toLowerCase() === resultFolderName.toLowerCase()) {
        continue;
      }

      await collectFromDirectory(handle, {
        entries,
        prefix: `${prefix}${name}/`,
        resultFolderName
      });
      continue;
    }

    if (handle.kind !== 'file') {
      continue;
    }

    const file = await handle.getFile();

    if (!isSupportedImageFile(file)) {
      continue;
    }

    entries.push({
      file,
      fileHandle: handle,
      relativePath: `${prefix}${file.name}`
    });
  }
}

async function writeBlobToResult(resultDirectoryHandle, relativePath, fileName, blob) {
  const parts = relativePath.split('/');
  parts[parts.length - 1] = fileName;
  let directory = resultDirectoryHandle;

  for (const folderName of parts.slice(0, -1)) {
    directory = await directory.getDirectoryHandle(folderName, { create: true });
  }

  const fileHandle = await directory.getFileHandle(parts.at(-1), { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}
