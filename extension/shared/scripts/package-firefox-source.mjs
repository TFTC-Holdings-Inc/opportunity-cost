import { execFileSync } from "node:child_process";
import { readdirSync, renameSync, utimesSync } from "node:fs";
import { relative, resolve } from "node:path";

const projectDirectory = resolve(import.meta.dirname, "..");
const extensionDirectory = resolve(projectDirectory, "..");
const sourceDirectory = resolve(extensionDirectory, "firefox-extension-submission");
const artifactPath = resolve(extensionDirectory, "firefox-extension-submission.zip");
const temporaryArtifactPath = resolve(extensionDirectory, ".firefox-extension-submission.tmp.zip");
const excludedNames = new Set(["node_modules", "dist", ".DS_Store"]);

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (excludedNames.has(entry.name)) {
      return [];
    }
    const absolutePath = resolve(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolutePath) : [absolutePath];
  });
}

const files = listFiles(sourceDirectory).sort((a, b) => a.localeCompare(b));
if (files.some((file) => file.endsWith("pnpm-lock.yaml"))) {
  throw new Error("Firefox source package must contain only the authoritative npm lockfile");
}

const normalizedTime = new Date("1980-01-01T00:00:00.000Z");
for (const file of files) {
  utimesSync(file, normalizedTime, normalizedTime);
}

execFileSync("zip", ["-X", "-q", temporaryArtifactPath, ...files.map((file) => relative(extensionDirectory, file))], {
  cwd: extensionDirectory,
});
renameSync(temporaryArtifactPath, artifactPath);
console.log("Packaged deterministic Firefox source submission with " + files.length + " files");
