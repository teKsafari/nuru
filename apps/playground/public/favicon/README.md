# Nuru icons

The mark is the Nuru sun: a jua (`#ffc93c`) disc ringed with eight kanga-border triangles, outlined in ink (`#15120f`). The React version lives in `packages/ui/src/components/app-logo.tsx`.

- `/favicon.svg` and `favicon/icon.svg`: the bare mark.
- `/icons/icon.svg`: the mark on a rounded paper tile. Source of `icon-192.png`, `icon-512.png` and `apple-touch-icon.png`.
- `/icons/maskable.svg`: the mark inside the 60% safe zone on a full paper square. Source of `maskable-512.png`.
- `/icons/og.png`: the OpenGraph card.

Regenerate the PNGs from `apps/playground` with sharp:

```bash
node -e 'const s=require("sharp");s("public/icons/icon.svg",{density:1200}).resize(512,512).png().toFile("public/icons/icon-512.png")'
```
