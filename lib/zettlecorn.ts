/**
 * Zettelcorn CLI entry point that exposes all public commands to the user.
 * @module zettelcorn
 */

import Env from "../env.ts";
import { CLI } from "./cli/mod.ts";
import Commands from "./commands/mod.ts";
import Init from "./commands/init/mod.ts";
import InjectId from "./commands/inject_id/mod.ts";
import InjectKeywords from "./commands/inject_keywords/mod.ts";
import InjectTitle from "./commands/inject_title/mod.ts";
import RenameFiles from "./commands/rename_files/mod.ts";

// Required Deno flags: --unstable --allow-read --allow-write

CLI.init({
  appVersion: Env.ZETTELCORN_VERSION,
  appName: Env.ZETTELCORN_APP_NAME,
  init: Commands(Init),
  injectId: Commands(InjectId),
  injectKeywords: Commands(InjectKeywords),
  injectTitle: Commands(InjectTitle),
  renameFiles: Commands(RenameFiles),
});
