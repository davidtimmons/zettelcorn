/**
 * Zettelcorn CLI entry point that exposes all public commands to the user.
 * @module zettelcorn
 */

import Env from "../env.ts";
import { CLI } from "CLI";
import Commands from "Commands";
import Init from "CommandInit";
import InjectId from "CommandInjectId";
import InjectKeywords from "CommandInjectKeywords";
import InjectTitle from "CommandInjectTitle";
import NewZettel from "CommandNewZettel";
import RenameFiles from "CommandRenameFiles";

// Required Deno flags: --unstable --allow-read --allow-write

CLI.init({
  appVersion: Env.ZETTELCORN_VERSION,
  appName: Env.ZETTELCORN_APP_NAME,
  init: Commands(Init),
  injectId: Commands(InjectId),
  injectKeywords: Commands(InjectKeywords),
  injectTitle: Commands(InjectTitle),
  newZettel: Commands(NewZettel),
  renameFiles: Commands(RenameFiles),
});
