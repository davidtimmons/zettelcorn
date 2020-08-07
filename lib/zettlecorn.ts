import Env from "../env.ts";
import CLI from "./cli/cli.ts";
import Commands from "./commands/commands.ts";
import RenameFiles from "./commands/rename_files/rename_files.ts";

// Required Deno flags: --unstable --allow-read --allow-write

CLI({
  appVersion: Env.ZETTELCORN_VERSION,
  appName: Env.ZETTELCORN_APP_NAME,
  renameFiles: Commands(RenameFiles),
});
