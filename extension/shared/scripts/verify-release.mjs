import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectDirectory = resolve(import.meta.dirname, "..");
const publicDirectory = resolve(projectDirectory, "../../web/public/extension");
const artifactPath = resolve(publicDirectory, "oc-extension.zip");
const firefoxSourcePath = resolve(projectDirectory, "../firefox-extension-submission.zip");
const release = JSON.parse(readFileSync(resolve(publicDirectory, "release.json"), "utf8"));
const checksum = createHash("sha256").update(readFileSync(artifactPath)).digest("hex");

if (checksum !== release.sha256) {
  throw new Error("Published extension checksum does not match release.json");
}

const sidecarChecksum = readFileSync(resolve(publicDirectory, "oc-extension.zip.sha256"), "utf8")
  .trim()
  .split(/\s+/u)[0];
if (checksum !== sidecarChecksum) {
  throw new Error("Published extension checksum does not match its SHA-256 sidecar");
}

const manifest = JSON.parse(execFileSync("unzip", ["-p", artifactPath, "manifest.json"], { encoding: "utf8" }));
const embeddedRelease = JSON.parse(execFileSync("unzip", ["-p", artifactPath, "RELEASE.json"], { encoding: "utf8" }));

if (manifest.version !== release.version || embeddedRelease.version !== release.version) {
  throw new Error("Published extension versions do not agree");
}
if (embeddedRelease.sourceCommit !== release.sourceCommit) {
  throw new Error("Published extension source commit does not agree with release.json");
}
execFileSync("git", ["merge-base", "--is-ancestor", release.sourceCommit, "HEAD"], {
  cwd: projectDirectory,
});
if (JSON.stringify(manifest.permissions) !== JSON.stringify(["activeTab"])) {
  throw new Error("Published extension has unexpected API permissions");
}
if (JSON.stringify(manifest.host_permissions) !== JSON.stringify(["https://www.opportunitycost.xyz/*"])) {
  throw new Error("Published extension has unexpected host permissions");
}

const strings = execFileSync("unzip", ["-p", artifactPath], {
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
});
if (strings.includes("opportunitycost.app") || strings.includes("opportunitycost.com")) {
  throw new Error("Published extension contains an obsolete Opportunity Cost domain");
}

const firefoxEntries = execFileSync("unzip", ["-Z1", firefoxSourcePath], { encoding: "utf8" });
if (/\/(?:node_modules|dist)\//u.test(firefoxEntries) || firefoxEntries.includes("pnpm-lock.yaml")) {
  throw new Error("Firefox source archive contains excluded build output or an ambiguous lockfile");
}
const firefoxManifest = JSON.parse(
  execFileSync("unzip", ["-p", firefoxSourcePath, "firefox-extension-submission/manifest.json"], { encoding: "utf8" }),
);
if (firefoxManifest.version !== release.version) {
  throw new Error("Firefox source archive version does not match the published Chrome release");
}
const firefoxConstants = execFileSync(
  "unzip",
  ["-p", firefoxSourcePath, "firefox-extension-submission/src/lib/constants.ts"],
  { encoding: "utf8" },
);
if (
  !firefoxConstants.includes("https://www.opportunitycost.xyz/api/bitcoin-price") ||
  firefoxConstants.includes("https://www.opportunitycost.app") ||
  firefoxConstants.includes("https://www.opportunitycost.com")
) {
  throw new Error("Firefox source archive contains an invalid Bitcoin price endpoint");
}

console.log("Verified Opportunity Cost " + release.version + ", SHA-256 " + checksum);
