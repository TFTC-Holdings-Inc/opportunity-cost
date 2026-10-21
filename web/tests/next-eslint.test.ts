import { ESLint } from "eslint";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const websiteDirectory = fileURLToPath(new URL("../", import.meta.url));
const requireFromTest = createRequire(import.meta.url);
const { getRootDirs } = requireFromTest(
  "@next/eslint-plugin-next/dist/utils/get-root-dirs",
);

describe("Next.js lint rules with the safe glob replacement", () => {
  it("discovers the project root through the plugin's directory glob consumer", () => {
    expect(
      getRootDirs({
        cwd: websiteDirectory,
        settings: {
          next: { rootDir: `${websiteDirectory}../{web,missing-app}` },
        },
      }),
    ).toEqual([resolve(websiteDirectory)]);
  });

  it("still reports Next.js lint violations", async () => {
    const eslint = new ESLint({ cwd: websiteDirectory });
    const [result] = await eslint.lintText(
      'export default function Page() { return <img src="/logo.png" alt="Logo" />; }',
      { filePath: "src/app/security-lint-fixture.tsx" },
    );

    expect(
      result.messages.some(
        (message) => message.ruleId === "@next/next/no-img-element",
      ),
    ).toBe(true);
  });
});
