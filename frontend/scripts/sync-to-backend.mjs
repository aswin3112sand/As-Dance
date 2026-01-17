import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendRoot = path.resolve(__dirname, "..");
const distDir = path.join(frontendRoot, "dist");
const backendStaticDir = path.resolve(
  frontendRoot,
  "..",
  "backend",
  "src",
  "main",
  "resources",
  "static"
);

async function main() {
  try {
    await fs.access(distDir);
  } catch {
    throw new Error(`dist not found at ${distDir}. Run "npm run build" first.`);
  }

  const shouldClean = process.env.BACKEND_STATIC_CLEAN === "true";
  if (shouldClean) {
    await fs.rm(backendStaticDir, { recursive: true, force: true });
  }
  await fs.mkdir(backendStaticDir, { recursive: true });
  await fs.cp(distDir, backendStaticDir, { recursive: true, force: true });
  console.log(`Synced ${distDir} -> ${backendStaticDir}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
