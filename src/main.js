import './styles.css';
import { processDirectory } from './folder/folderProcessor.js';
import { formatProgressState } from './ui/progressState.js';

const elements = {
  button: document.querySelector('#select-folder'),
  folderName: document.querySelector('#folder-name'),
  progressTitle: document.querySelector('#progress-title'),
  progressPercent: document.querySelector('#progress-percent'),
  progressFill: document.querySelector('#progress-fill'),
  logList: document.querySelector('#log-list'),
  supportMessage: document.querySelector('#support-message')
};

const isSupported = 'showDirectoryPicker' in window;
elements.button.disabled = !isSupported;
elements.supportMessage.textContent = isSupported
  ? 'Select an image folder. Processed files are saved to a result folder.'
  : 'Open this app in Chrome or Edge to use folder access.';

elements.button.addEventListener('click', async () => {
  elements.button.disabled = true;
  elements.logList.replaceChildren();

  try {
    const directoryHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    const logoImage = await loadLogo(`${import.meta.env.BASE_URL}watermark-logo.svg`);

    elements.folderName.textContent = directoryHandle.name;

    const summary = await processDirectory(directoryHandle, logoImage, {
      watermark: {
        tint: '#eaffaa',
        opacity: 0.22
      },
      onProgress: updateProgress
    });

    if (summary.total === 0) {
      appendLog('No supported image files were found.', 'warning');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      appendLog(error.message, 'error');
      setProgress({ title: 'Processing stopped because an error occurred.', percent: 100 });
    }
  } finally {
    elements.button.disabled = !isSupported;
  }
});

function updateProgress(progress) {
  setProgress(formatProgressState(progress));

  if (progress.type === 'completed') {
    appendLog(`${progress.entry.relativePath} saved`, 'success');
  }

  if (progress.type === 'failed') {
    appendLog(`${progress.entry.relativePath}: ${progress.error.message}`, 'error');
  }
}

function setProgress(state) {
  elements.progressTitle.textContent = state.title;
  elements.progressPercent.textContent = `${state.percent}%`;
  elements.progressFill.style.width = `${state.percent}%`;
}

function appendLog(message, level) {
  const item = document.createElement('li');
  item.className = `log-item ${level}`;
  item.textContent = message;
  elements.logList.prepend(item);
}

async function loadLogo(src) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}
