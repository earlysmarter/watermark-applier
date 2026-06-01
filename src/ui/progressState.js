export function formatProgressState(progress) {
  const completed = progress.completed ?? 0;
  const failed = progress.failed ?? 0;
  const total = progress.total ?? 0;
  const processed = completed + failed;
  const percent = total > 0 ? Math.round((processed / total) * 100) : 0;

  if (progress.type === 'ready') {
    return {
      title: `Found ${total} image${total === 1 ? '' : 's'}.`,
      percent: 0
    };
  }

  if (progress.type === 'done') {
    return {
      title: `Done: ${completed} saved, ${failed} failed.`,
      percent: 100
    };
  }

  return {
    title: `${processed} / ${total} processed.`,
    percent
  };
}
