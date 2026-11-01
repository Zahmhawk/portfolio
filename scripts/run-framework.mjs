import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const [command, ...args] = process.argv.slice(2);
if (command === "build") {
  const buildScript = fileURLToPath(new URL("./build-hostinger.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [buildScript, ...args], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

const cli = new URL("../node_modules/vite/bin/vite.js", import.meta.url);
process.argv = [process.execPath, fileURLToPath(cli), command || "dev", "--config", "vite.hostinger.config.ts", ...args];
await import(cli.href);
