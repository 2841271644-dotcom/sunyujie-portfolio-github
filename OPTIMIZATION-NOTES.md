# Portfolio loading optimization

This package is an optimized static deployment bundle for the current portfolio export.

## Changes

- Converted the large opaque page PNGs to JPEGs at a maximum width of 2048px. Transparent catalog artwork remains PNG.
- Reduced image payload from roughly 531MB to roughly 146MB.
- Changed the entry file to preload the hero poster and use a cache-busted `index-optimized.js` name.
- Changed nonessential video loading from `auto` to metadata/none and disabled background audio loading until the visitor enables sound.
- Made the hero video eager-load for immediate interaction; the closing video preloads automatically 1800px before it enters view.
- Reworked hero/closing scrubbing to use mouse movement alone, with `requestAnimationFrame` throttling and `fastSeek` when supported.
- Deferred catalog preview images with native lazy loading.
- Added `sw.js` to cache the shell and successfully requested assets for repeat visits.
- Removed only the now-unreferenced original PNG copies from this optimized bundle. The original project copy remains unchanged.

## Deploy

Upload the contents of this folder as the published site root. For GitHub Pages, keep `index.html` at the root of the published branch or Pages artifact.

If this project is later rebuilt from the original Vite source, carry the same changes into the source components and let Vite generate a fresh build instead of editing the generated JavaScript by hand.
