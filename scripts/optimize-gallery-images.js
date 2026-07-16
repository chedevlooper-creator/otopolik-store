// @ts-nocheck
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MUSTERI_DIR = path.join(__dirname, '../public/media/galeri/musteri');
const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 78;

async function main() {
  if (!fs.existsSync(MUSTERI_DIR)) {
    console.error(`Directory not found: ${MUSTERI_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(MUSTERI_DIR)
    .filter((f) => ['.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase()));

  let originalTotal = 0;
  let newTotal = 0;
  let converted = 0;

  for (const file of files) {
    const inputPath = path.join(MUSTERI_DIR, file);
    const outputPath = path.join(MUSTERI_DIR, `${path.parse(file).name}.webp`);

    const originalSize = fs.statSync(inputPath).size;
    originalTotal += originalSize;

    await sharp(inputPath)
      .rotate() // apply EXIF orientation before stripping metadata
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    newTotal += fs.statSync(outputPath).size;
    fs.unlinkSync(inputPath);
    converted++;
  }

  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
  console.log(`Converted ${converted} images to WebP.`);
  console.log(`Size: ${mb(originalTotal)}MB -> ${mb(newTotal)}MB (${(100 - (newTotal / originalTotal) * 100).toFixed(0)}% smaller)`);
}

main();
