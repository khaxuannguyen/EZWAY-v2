// Explicit source paths supplied locally; original generated PNGs never enter public/.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const inputs = process.argv.slice(2);
if (inputs.length !== 2) throw new Error('Supply SEA and AIR generated source PNG paths');
const result = [];
for (const [index, mode] of ['sea', 'air'].entries()) {
  const name = mode === 'sea' ? 'terminal' : 'apron';
  const folder = path.resolve(`public/assets/freight-story/${mode}/posters`);
  await fs.mkdir(folder, { recursive: true });
  const metadata = await sharp(inputs[index]).metadata();
  if (metadata.width !== 1672 || metadata.height !== 941) throw new Error('Update the visual manifest for changed source dimensions');
  for (const width of [1672, 960]) {
    const output = path.join(folder, `${name}-${width}.webp`);
    await sharp(inputs[index]).resize({ width, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toFile(output);
    const info = await sharp(output).metadata();
    result.push({ path: `/assets/freight-story/${mode}/posters/${name}-${width}.webp`, width: info.width, height: info.height, bytes: (await fs.stat(output)).size });
  }
}
console.log(JSON.stringify(result, null, 2));
