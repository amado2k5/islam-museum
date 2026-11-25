// Starts the workspace's Vite server on a free local port for the lifetime of a tool run, so benchmarks and captures
// are one command and do not depend on a dev server someone else started.
import { createServer, type ViteDevServer } from "vite";
import { fileURLToPath } from "node:url";

export async function serveWorkspace(): Promise<{ base: string; close: () => Promise<void> }> {
  const server: ViteDevServer = await createServer({
    configFile: fileURLToPath(new URL("../vite.config.ts", import.meta.url)),
    server: { port: 0, strictPort: false, host: "127.0.0.1", hmr: false, watch: null },
    logLevel: "warn",
  });
  await server.listen();
  const address = server.httpServer?.address();
  if (!address || typeof address === "string") throw new Error("could not read the dev server's port");
  return { base: `http://127.0.0.1:${address.port}`, close: () => server.close() };
}
