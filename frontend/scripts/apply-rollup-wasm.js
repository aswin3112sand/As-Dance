import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nativeFile = path.resolve(__dirname, '../node_modules/rollup/dist/native.js');

const marker = "const { platform, arch, report } = require('node:process');\n\nconst isMusl = () => {";
const replacement = `const { platform, arch, report, env } = require('node:process');

const preferWasm = (() => {
\ttry {
\t\tconst value = env?.ROLLUP_USE_WASM;
\t\treturn value === '1' || value?.toLowerCase() === 'true';
\t} catch {
\t\treturn false;
\t}
})();

if (preferWasm) {
\tmodule.exports = require('@rollup/wasm-node/dist/native.js');
\treturn;
}

const isMusl = () => {`;

async function patchNative() {
  const source = await readFile(nativeFile, 'utf-8');
  if (source.includes("module.exports = require('@rollup/wasm-node/dist/native.js')")) {
    return;
  }
  if (!source.includes(marker)) {
    throw new Error('Unable to patch rollup native: marker string not found');
  }
  const patched = source.replace(marker, replacement);
  await writeFile(nativeFile, patched, 'utf-8');
}

patchNative().catch((error) => {
  console.error('apply-rollup-wasm failed:', error);
  process.exitCode = 1;
});
