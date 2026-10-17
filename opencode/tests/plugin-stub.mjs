/**
 * Stub for `@opencode/plugin`, used only when running the tests under Node.
 *
 * The plugin entrypoints import `Plugin.define` at module scope, but the tests
 * only exercise the exported pure functions. Node cannot resolve the real
 * package, so the test loader maps it here. This file lives outside
 * ~/.config/opencode/plugins/ on purpose: that directory is globbed wholesale
 * by the plugin loader ({plugin,plugins}/*.{ts,js}), so anything inside it is
 * treated as a plugin and loaded on every session.
 */
export const Plugin = {
  define: (definition) => definition,
};

export default { Plugin };
