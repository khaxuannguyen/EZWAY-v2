import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
sharp.cache(false);

const [configPath, sourceDir] = process.argv.slice(2);
if (!configPath || !sourceDir) throw new Error('Usage: node scripts/prepare-freight-rig-assets.mjs config.json generated-image-directory');
const config = JSON.parse(await readFile(configPath, 'utf8'));
const assets = {};
for (const entry of config.assets) {
  const input = `${sourceDir}/${entry.file}`;
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0, transparent = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const alpha = data[(y * info.width + x) * 4 + 3];
    if (alpha === 0) transparent++;
    if (alpha > 20) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
  }
  if (entry.transparent && transparent / (info.width * info.height) < .12) throw new Error(`${entry.name}: missing genuine transparent cutout`);
  const crop = { left, top, width: right - left + 1, height: bottom - top + 1 };
  const dir = `public/assets/freight-story/${entry.group}`;
  await mkdir(dir, { recursive: true });
  const result = await sharp(input).extract(crop).resize({ width: Math.min(entry.maxWidth || 1600, crop.width), withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile(`${dir}/${entry.name}.webp`);
  assets[`${entry.group}/${entry.name}`] = { ...entry, crop, width: result.width, height: result.height, bytes: result.size, sha256: createHash('sha256').update(await readFile(input)).digest('hex'), transparentFraction: transparent / (info.width * info.height) };
}
await writeFile(config.outputManifest, JSON.stringify({ tool: 'built-in image_gen', method: 'Separate photographic rig layers; alpha-margin trim and WebP encoding only; no synthesized motion frames', assets }, null, 2));
console.log(JSON.stringify(assets, null, 2));
