import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, renameSync, statSync, utimesSync } from "node:fs";
import { relative, resolve } from "node:path";

const projectDirectory = resolve(import.meta.dirname, "..");
const buildDirectory = resolve(projectDirectory, "dist/firefox");
const artifactPath = resolve(projectDirectory, "dist/oc-firefox.zip");
const temporaryArtifactPath = resolve(projectDirectory, `dist/.oc-firefox-${process.pid}.tmp.zip`);
const packageJson = JSON.parse(readFileSync(resolve(projectDirectory, "package.json"), "utf8"));
const manifest = JSON.parse(readFileSync(resolve(buildDirectory, "manifest.json"), "utf8"));

if (manifest.version !== packageJson.version) {
  throw new Error("Manifest version " + manifest.version + " does not match package version " + packageJson.version);
}
if (manifest.browser_specific_settings?.gecko?.id !== "support@opportunitycost.app") {
  throw new Error("Firefox release must preserve the existing AMO add-on ID");
}
if (
  JSON.stringify(manifest.browser_specific_settings?.gecko?.data_collection_permissions) !==
  JSON.stringify({ required: ["none"] })
) {
  throw new Error("Firefox release must explicitly declare that it collects no user data");
}
const expectedIcons = { 16: "icons/icon16.png", 48: "icons/icon48.png", 128: "icons/icon128.png" };
if (JSON.stringify(manifest.icons) !== JSON.stringify(expectedIcons)) {
  throw new Error("Firefox release manifest must use correctly sized store icons");
}

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

for (const file of files.filter((candidate) => /\.(?:html|js|css)$/u.test(candidate))) {
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
console.log("Packaged Firefox " + packageJson.version + ": " + statSync(artifactPath).size + " bytes, SHA-256 " + sha256);
