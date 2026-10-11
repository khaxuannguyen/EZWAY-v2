import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

// Packaging only: crop transparent margins and encode generated independent
// cutouts. No masking, inpainting, compositing or synthesized motion frames.
const source = process.argv[2];
if (!source) throw new Error('Pass the generated-image directory');
const sources = {
  body: 'exec-4049ae65-4378-49d3-8513-b6fce018cb84.png',
  boom: 'exec-6cd4c1f5-583e-4e71-9183-dd4a7d41e1d7.png',
  container: 'exec-2a700678-aae2-430c-892f-64a6eba5732c.png',
  truck: 'exec-8f112cee-a55a-41f4-b3c2-a4eea51c3b46.png',
  spreader: 'exec-f29a0708-2384-4d9f-874e-81815862cc1c.png',
  background: 'exec-6bc70ceb-a483-4134-99a7-0a1e89bf792c.png',
};
const out = 'public/assets/freight-story/sea/rig-v1';
await mkdir(out, { recursive: true });
const manifest = {};
for (const [name, file] of Object.entries(sources)) {
  const input = `${source}/${file}`;
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 20) {
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
  const crop = { left, top, width: right - left + 1, height: bottom - top + 1 };
  const maxWidth = name === 'background' ? 1600 : 1200;
  const pipeline = sharp(input).extract(crop);
  const result = await pipeline.resize({ width: Math.min(maxWidth, crop.width), withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile(`${out}/${name}.webp`);
  manifest[name] = { source: file, sha256: createHash('sha256').update(await readFile(input)).digest('hex'), crop, width: result.width, height: result.height, bytes: result.size };
}
await writeFile('docs/sea-rig-assets.json', JSON.stringify({ generated: '2026-10-12', method: 'Built-in imagegen; separate transparent side-elevation cutouts. No independently generated animation frames.', licensing: 'Generated in this session; no stock purchase or claim of exclusive copyright / third-party trademark clearance.', assets: manifest }, null, 2));
console.log(JSON.stringify(manifest, null, 2));
