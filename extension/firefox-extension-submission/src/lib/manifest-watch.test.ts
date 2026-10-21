import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";

const requireFromTest = createRequire(import.meta.url);
const requireFromCopyPlugin = createRequire(requireFromTest.resolve("vite-plugin-static-copy"));

it("the copy plugin's patched watcher still detects literal manifest changes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "oc-manifest-watch-"));
  const manifest = join(directory, "manifest.json");
  await writeFile(manifest, '{"version":"0.0.9"}');
  const watcher = requireFromCopyPlugin("chokidar").watch(manifest, { ignoreInitial: true });

  try {
    await once(watcher, "ready", { signal: AbortSignal.timeout(5_000) });
    const changed = once(watcher, "change", { signal: AbortSignal.timeout(5_000) });
    await writeFile(manifest, '{"version":"0.0.10"}');
    const [changedPath] = await changed;
    expect(changedPath).toBe(manifest);
  } finally {
    await watcher.close();
    await rm(directory, { recursive: true, force: true });
  }
});
