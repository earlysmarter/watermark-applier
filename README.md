# Watermark Applier

Batch-apply a repeated watermark to local image folders directly in the browser.

Watermark Applier uses the File System Access API in Chrome and Edge, so images stay on your computer. The app reads a selected folder, skips any existing `result` folder, and writes processed images back to a new `result` folder while preserving nested paths.

Live demo: https://earlysmarter.github.io/watermark-applier/

## Features

- Process folders recursively without uploading images to a server.
- Save output images into a generated `result` folder.
- Choose from multiple watermark styles before processing.
- Preserve JPEG, PNG, and WebP output formats when supported by canvas.
- Convert GIF and BMP inputs to PNG output.
- Show per-file progress and errors.
- Includes unit tests for layout, file collection, image output descriptors, and progress state.

## Watermark Styles

- Balanced: default diagonal spacing for everyday exports.
- Subtle: lower opacity and wider spacing for lighter brand presence.
- Bold: larger, stronger marks for high-visibility protection.
- Compact: smaller repeated marks for dense image grids and previews.

## Browser Support

Folder read/write access requires a browser that supports `window.showDirectoryPicker`, such as current Chrome or Edge. The deployed demo must be opened from a secure origin, such as `https://`.

## Local Development

```bash
npm install
npm run dev
```

Then open the printed local URL in Chrome or Edge.

## Test And Build

```bash
npm test
npm run build
npm run preview
```

## Deployment

This is a static Vite app and can be hosted on GitHub Pages, Vercel, Netlify, or any static host.

For GitHub Pages:

1. Create a public GitHub repository.
2. Push this project to the repository.
3. In GitHub, open `Settings -> Pages`.
4. Set the source to GitHub Actions.
5. The included workflow builds and deploys the app after each push to `main`.

## License

MIT
