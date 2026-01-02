import path from "node:path";
import { promises as fs } from "node:fs";
import sharp from "sharp";

const imagesDir = path.resolve("src", "assets", "bg");
const maxWidth = 1400;
const INPUT_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function convertImage(file) {
  const inputPath = path.join(imagesDir, file);
  const { name, ext } = path.parse(file);
  const outputPath = path.join(imagesDir, `${name}.webp`);

  try {
    await fs.access(outputPath);
    console.log(`Skipping ${file} (WebP already exists)`);
    return;
  } catch {
    // continue when WebP is missing
  }

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width && metadata.width > maxWidth ? maxWidth : metadata.width;

  await image
    .resize({ width, withoutEnlargement: true })
    .sharpen()
    .modulate({ brightness: 1.02, saturation: 1.05 })
    .webp({ quality: 70, effort: 6 })
    .toFile(outputPath);

  console.log(`Converted ${file} -> ${path.basename(outputPath)} (width: ${width}px)`);
}

async function main() {
  const files = await fs.readdir(imagesDir);
  const targets = files.filter((file) => INPUT_EXTENSIONS.has(path.extname(file).toLowerCase()));

  if (!targets.length) {
    console.log("No JPG/PNG images found to convert.");
    return;
  }

  await Promise.all(targets.map(convertImage));
  console.log(`Processed ${targets.length} images in ${imagesDir}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
