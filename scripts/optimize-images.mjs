// One-shot image optimizer for the hero photo.
// Generates responsive WebP + JPG fallbacks and a social (OGP) crop.
// Run: node scripts/optimize-images.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "assets/img/01_05.jpg";
const OUT = "assets/img";
mkdirSync(OUT, { recursive: true });

const base = sharp(SRC).rotate(); // respect EXIF orientation

const meta = await base.metadata();
console.log(`source: ${meta.width}x${meta.height}`);

// Responsive widths (never upscale past source width)
const widths = [1600, 960].filter((w, i) => i === 0 || w < meta.width);

for (const w of widths) {
  await base
    .clone()
    .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
    .webp({ quality: 76, effort: 6 })
    .toFile(`${OUT}/hero-${w}.webp`);
  await base
    .clone()
    .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(`${OUT}/hero-${w}.jpg`);
  console.log(`wrote hero-${w}.{webp,jpg}`);
}

// Social card 1200x630 (centered crop on the driver)
await base
  .clone()
  .resize({ width: 1200, height: 630, fit: "cover", position: "attention" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(`${OUT}/ogp.jpg`);
console.log("wrote ogp.jpg (1200x630)");

// Tiny blurred placeholder (LQIP) as base64 for instant first paint
const lqip = await base
  .clone()
  .resize({ width: 24 })
  .blur()
  .webp({ quality: 30 })
  .toBuffer();
console.log(`LQIP_DATA_URI=data:image/webp;base64,${lqip.toString("base64")}`);
