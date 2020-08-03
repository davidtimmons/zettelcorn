import Env from "../env.ts";
import CLI from "./cli/cli.ts";
import Commands from "./commands/commands.ts";
import RenameFiles from "./commands/rename_files/rename_files.ts";

// Deno flags required: --unstable --allow-read

CLI({
  appVersion: Env.ZETTLECORN_VERSION,
  appName: Env.ZETTLECORN_APP_NAME,
  renameFiles: Commands(RenameFiles),
});
