# Watermark Applier

Batch-apply a repeated watermark to local image folders directly in the browser.

Watermark Applier uses the File System Access API in Chrome and Edge, so images stay on your computer. The app reads a selected folder, skips any existing `result` folder, and writes processed images back to a new `result` folder while preserving nested paths.

## Features

- Process folders recursively without uploading images to a server.
- Save output images into a generated `result` folder.
- Preserve JPEG, PNG, and WebP output formats when supported by canvas.
- Convert GIF and BMP inputs to PNG output.
- Show per-file progress and errors.
- Includes unit tests for layout, file collection, image output descriptors, and progress state.

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
