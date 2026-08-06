import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, renameSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";

const projectDirectory = resolve(import.meta.dirname, "..");
const buildDirectory = resolve(projectDirectory, "dist/chrome");
const publicDirectory = resolve(projectDirectory, "../../web/public/extension");
const artifactPath = resolve(publicDirectory, "oc-extension.zip");
const temporaryArtifactPath = resolve(publicDirectory, ".oc-extension.tmp.zip");
const packageJson = JSON.parse(readFileSync(resolve(projectDirectory, "package.json"), "utf8"));
const manifest = JSON.parse(readFileSync(resolve(buildDirectory, "manifest.json"), "utf8"));
const sourceCommit =
  process.env.SOURCE_COMMIT ??
  execFileSync("git", ["rev-parse", "HEAD"], { cwd: projectDirectory, encoding: "utf8" }).trim();

if (manifest.version !== packageJson.version) {
  throw new Error("Manifest version " + manifest.version + " does not match package version " + packageJson.version);
}
if (JSON.stringify(manifest.permissions) !== JSON.stringify(["activeTab"])) {
  throw new Error("Chrome release must request only the activeTab API permission");
}
if (JSON.stringify(manifest.host_permissions) !== JSON.stringify(["https://www.opportunitycost.xyz/*"])) {
  throw new Error("Chrome release is missing the exact Bitcoin price API host permission");
}

const releaseRecord = {
  name: packageJson.name,
  version: packageJson.version,
  sourceCommit,
  browser: "chrome",
  manifestVersion: manifest.manifest_version,
};
writeFileSync(resolve(buildDirectory, "RELEASE.json"), JSON.stringify(releaseRecord, null, 2) + "\n");

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolutePath) : [absolutePath];
  });
}

const files = listFiles(buildDirectory).sort((a, b) => a.localeCompare(b));
const normalizedTime = new Date("1980-01-01T00:00:00.000Z");
for (const file of files) {
  utimesSync(file, normalizedTime, normalizedTime);
}

const textFiles = files.filter((file) => /\.(?:html|js|json|css)$/u.test(file));
for (const file of textFiles) {
  const contents = readFileSync(file, "utf8");
  if (contents.includes("opportunitycost.app") || contents.includes("opportunitycost.com")) {
    throw new Error("Obsolete Opportunity Cost domain found in " + relative(buildDirectory, file));
  }
}

execFileSync("zip", ["-X", "-q", temporaryArtifactPath, ...files.map((file) => relative(buildDirectory, file))], {
  cwd: buildDirectory,
});
renameSync(temporaryArtifactPath, artifactPath);

const artifact = readFileSync(artifactPath);
const sha256 = createHash("sha256").update(artifact).digest("hex");
writeFileSync(resolve(publicDirectory, "oc-extension.zip.sha256"), sha256 + "  oc-extension.zip\n");
writeFileSync(resolve(publicDirectory, "release.json"), JSON.stringify({ ...releaseRecord, sha256 }, null, 2) + "\n");

const artifactSize = statSync(artifactPath).size;
console.log("Packaged Opportunity Cost " + packageJson.version + ": " + artifactSize + " bytes, SHA-256 " + sha256);
