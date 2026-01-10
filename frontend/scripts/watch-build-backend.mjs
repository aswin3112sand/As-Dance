import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");

const watchTargets = [
  path.join(frontendRoot, "src"),
  path.join(frontendRoot, "public"),
  path.join(frontendRoot, "index.html"),
  path.join(frontendRoot, "vite.config.js")
];

const isWindows = process.platform === "win32";
const watchedDirs = new Set();
let buildInProgress = false;
let buildQueued = false;
let debounceTimer = null;

function runBuild() {
  if (buildInProgress) {
    buildQueued = true;
    return;
  }

  buildInProgress = true;
  const child = isWindows
    ? spawn("cmd.exe", ["/d", "/s", "/c", "npm run build:backend"], {
        cwd: frontendRoot,
        stdio: "inherit"
      })
    : spawn("npm", ["run", "build:backend"], {
        cwd: frontendRoot,
        stdio: "inherit"
      });

  child.on("error", (error) => {
    console.error("Failed to start build:", error?.message || error);
  });

  child.on("close", () => {
    buildInProgress = false;
    if (buildQueued) {
      buildQueued = false;
      runBuild();
    }
  });
}

function scheduleBuild() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(runBuild, 200);
}

function shouldIgnore(filename) {
  if (!filename) return false;
  const normalized = filename.toString().replace(/\\/g, "/");
  const parts = normalized.split("/");
  return parts.includes("node_modules") || parts.includes(".git") || parts.includes("dist");
}

function watchDirectory(dir) {
  if (watchedDirs.has(dir) || shouldIgnore(dir)) {
    return;
  }

  watchedDirs.add(dir);
  fs.watch(dir, (eventType, filename) => {
    if (!filename) {
      scheduleBuild();
      return;
    }

    const fullPath = path.join(dir, filename.toString());
    if (shouldIgnore(fullPath)) {
      return;
    }

    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        watchDirectory(fullPath);
      }
    } catch {
      // Ignore transient filesystem races.
    }

    scheduleBuild();
  });

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      watchDirectory(path.join(dir, entry.name));
    }
  }
}

function watchTarget(target) {
  if (!fs.existsSync(target)) {
    return;
  }

  const stats = fs.statSync(target);
  if (stats.isDirectory()) {
    watchDirectory(target);
    return;
  }

  fs.watch(target, scheduleBuild);
}

console.log("Watching frontend changes and syncing to backend...");
runBuild();
watchTargets.forEach(watchTarget);
