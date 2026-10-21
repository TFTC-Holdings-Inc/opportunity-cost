# Security Policy

## Supported version

Security fixes are applied to the current main branch and the latest published website and extension releases.

## Report a vulnerability

Please report suspected vulnerabilities privately by emailing contact@opportunitycost.xyz. Do not include secrets,
personal data, or exploit activity against production systems. Please include:

- The affected URL, extension version, or commit
- A clear description of the issue and its impact
- Reproduction steps or a minimal proof of concept
- Any suggested mitigation

We will acknowledge a report within five business days, investigate it, and coordinate remediation and disclosure with
the reporter. Please do not open a public issue until a fix is available or a disclosure timeline has been agreed.

## Safe research

Use test accounts and systems you own. Do not access other users' data, degrade service availability, perform social
engineering, or retain data obtained accidentally. Stop testing and report the issue if sensitive data becomes
available.

## Dependency security overrides

The website replaces `fast-glob` with maintained `glob` through an npm alias.
The sole consumer, `@next/eslint-plugin-next`, uses `globSync` to discover project
roots and then checks for existing app/pages directories. This removes the
unpatched `braces` dependency without disabling Next.js lint rules. The lint
integration test checks root globs and Next.js rule enforcement. Recheck this
API when upgrading the Next.js plugin.

Both extension source packages override `vite-plugin-static-copy` to use
`chokidar` 4. The plugin copies and watches a literal manifest filename, so it
does not require the glob support removed in chokidar 4. This removes another
unpatched `braces` dependency while retaining the existing build plugin. Verify
both manifests and manifest watching when upgrading this plugin.

CI resolves the latest Node.js 22 patch on each run, rather than pinning an old
patch release. Hosted production runtimes must also receive platform security
updates; npm dependency audits do not check the Node.js runtime.
