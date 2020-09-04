/**
 * Communicates the status of this command to the user.
 * @protected
 * @module commands/init/ui/status
 * @see module:commands/init/mod
 */

import { TExitCodes } from "../../types.ts";
import { Colors, Path, Utilities as $ } from "../deps.ts";
import { TInitRunOptions } from "../types.ts";

/// TYPES ///

interface TNotifyUserOfExitOptions extends TInitRunOptions {
  error?: Error;
  exitCode: TExitCodes;
}

/// LOGIC ///

export function notifyUserOfExit(options: TNotifyUserOfExitOptions) {
  if (options.silent) return;
  let message: any[] = [];

  switch (options.exitCode) {
    case TExitCodes.NO_DIRECTORY_FOUND:
      message = [
        Colors.red("The directory you entered does not exist."),
        "This is the directory you entered: " +
        Colors.yellow(options.directory),
        "No files were created.",
      ];
      break;

    case TExitCodes.INVALID_DIRECTORY:
      message = [
        Colors.red(
          "A Zettelcorn configuration directory already exists at this location.",
        ),
        "This is the directory that exists: " +
        Colors.yellow(Path.join(options.directory, ".zettelcorn")),
        "The --force option will replace an existing configuration directory with default values.",
        "No files were created.",
      ];
      break;

    case TExitCodes.WRITE_ERROR:
      message = [
        Colors.red(
          "There was an unexpected error when writing files to the Zettelcorn directory.",
        ),
        "This is the directory where the problem occurred: " +
        Colors.yellow(Path.join(options.directory, ".zettelcorn")),
      ];
      if (options.error) {
        message.push(
          "This is the error: " + Colors.yellow(options.error.message),
        );
      }
      break;

    case TExitCodes.UNKNOWN_ERROR:
    default:
      message = [
        Colors.red(
          "There was an unexpected error when attempting to initialize a Zettelcorn project.",
        ),
      ];
      if (options.error) {
        message.push(
          "This is the error: " + Colors.yellow(options.error.message),
        );
      }
      message.push("No files were created.");
      break;
  }

  $.formatWithEOL(message, true);
}
