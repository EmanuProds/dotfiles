/**
 * Registers the resolve hook used by the test runner.
 * Usage: node --import ./tests/register.mjs ./tests/guards.test.ts
 */
import { register } from "node:module";

register("./resolve-hook.mjs", import.meta.url);
