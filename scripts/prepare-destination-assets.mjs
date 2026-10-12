import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Originals are read only; this command explicitly rebuilds destination WebPs.
const sourceDirectory = process.argv[2];
if (!sourceDirectory) throw new Error('Usage: node scripts/prepare-destination-assets.mjs <original-image-directory>');
const manifest = JSON.parse(await fs.readFile('docs/destination-gallery-assets.json', 'utf8'));
const output = 'public/assets/destinations/v1';
await fs.mkdir(output, { recursive: true });
for (const asset of manifest) {
  for (const width of [600, 960]) {
    const result = await sharp(path.join(sourceDirectory, asset.source))
      .resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 6 })
      .toFile(path.join(output, `${asset.id}-${width}.webp`));
    console.log(`${asset.id}: ${result.width}x${result.height}, ${result.size} bytes`);
  }
}
