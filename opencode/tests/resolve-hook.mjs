/**
 * ESM resolve hook that redirects the plugin SDK import to a local stub.
 *
 * Only used by the test runner. Keeps the plugin sources importable under Node
 * without adding a node_modules directory next to them, which would shadow the
 * real @opencode/plugin for OpenCode itself.
 *
 * `bun:sqlite` is stubbed for the same reason. memory-store.ts imports the Bun
 * driver, and Node's ESM loader rejects the `bun:` scheme outright
 * (ERR_UNSUPPORTED_ESM_URL_SCHEME) — the error names the loader, not the
 * database, which makes it look like a Node problem rather than a test-harness
 * gap. Bun is not installed on this machine, so the real driver is unreachable
 * from the tests; the stub throws if anything actually tries to open a
 * connection, so a test that strays into I/O fails loudly instead of touching
 * the real ~/.opencode/memory.db.
 */
const STUBBED = new Map([
  ["@opencode/plugin", "./plugin-stub.mjs"],
  ["@opencode-ai/plugin", "./plugin-stub.mjs"],
  ["bun:sqlite", "./bun-sqlite-stub.mjs"],
]);

export function resolve(specifier, context, nextResolve) {
  const stub = STUBBED.get(specifier);
  if (stub) {
    return {
      url: new URL(stub, import.meta.url).href,
      shortCircuit: true,
    };
  }
  return nextResolve(specifier, context);
}
