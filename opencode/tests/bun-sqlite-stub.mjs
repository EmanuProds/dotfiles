/**
 * Stub for `bun:sqlite`, used only when running the tests under Node.
 *
 * memory-store.ts opens the real database inside `initialize()`, which only
 * runs when the plugin is actually loaded by OpenCode. The tests exercise
 * exported pure functions (buildMatchQuery) and never call setup, so nothing
 * here needs to touch disk.
 *
 * Without this stub, importing memory-store.ts under Node dies at module
 * resolution — `bun:` is not a scheme the Node ESM loader accepts, and the
 * failure is ERR_UNSUPPORTED_ESM_URL_SCHEME rather than anything pointing at
 * the database. The real driver is the one Bun provides at runtime; this file
 * exists so the pure logic is reachable from Node.
 */

class BunSqliteDatabase {
  constructor() {
    throw new Error(
      "bun:sqlite stub: tests must not open the real database. " +
        "Only exported pure functions are covered here.",
    );
  }
}

export const Database = BunSqliteDatabase;
export default { Database: BunSqliteDatabase };
