// Gera versões WebP (640, 1280 e 1920 px) de cada foto de ./imagens em ./imagens/otimizadas,
// e ./imagens/og.jpg (1200x630) a partir da foto "espaco" para a prévia do link no WhatsApp.
// Uso: npm install, depois npm run otimizar
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const pasta = 'imagens';
const destino = join(pasta, 'otimizadas');
const larguras = [640, 1280, 1920];
const ehFoto = (nome) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(nome) && nome !== 'og.jpg';
const limpar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

await mkdir(destino, { recursive: true });

for (const item of await readdir(pasta, { withFileTypes: true })) {
  if (!item.isFile() || !ehFoto(item.name)) continue;
  const nome = limpar(parse(item.name).name);
  const origem = join(pasta, item.name);
  for (const w of larguras) {
    await sharp(origem).rotate().resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82 }).toFile(join(destino, `${nome}-${w}.webp`));
  }
  if (nome === 'espaco') {
    await sharp(origem).rotate().resize(1200, 630, { fit: 'cover', position: 'south' })
      .jpeg({ quality: 85 }).toFile(join(pasta, 'og.jpg'));
  }
  console.log(`${item.name} → ${nome}-{${larguras.join(',')}}.webp`);
}
