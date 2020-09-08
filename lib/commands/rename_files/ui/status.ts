/**
 * Communicates the status of this command to the user.
 * @protected
 * @module commands/rename_files/ui/status
 * @see module:commands/rename_files/mod
 */

import { TExitCodes } from "../../types.ts";
import { Colors, Utilities as $ } from "../deps.ts";
import { TRenameFilesRunOptions } from "../types.ts";

/// TYPES ///

interface TConfirmChangeOptions {
  oldFileName: string;
  newFileName: string;
  pattern: string;
}

interface TNotifyUserOfExitOptions extends TRenameFilesRunOptions {
  error?: Error;
  exitCode: TExitCodes;
}

type TUserResponse = string;

/// LOGIC ///

export async function confirmChange(
  options: TConfirmChangeOptions,
): Promise<TUserResponse> {
  const message = [
    "This is the pattern you entered:",
    Colors.cyan(options.pattern),
    "",
    "Here is an example of an existing file name:",
    Colors.cyan(options.oldFileName),
    "",
    "This is how that file name will change:",
    Colors.yellow(options.newFileName),
    "",
    `Is this what you want? Enter y or Y to confirm. Any other key will exit.`,
  ];

  return await $.promptUser($.formatWithEOL(message));
}

export function notifyUserOfExit(options: TNotifyUserOfExitOptions) {
  if (options.silent) return;
  let message: any[] = [];

  switch (options.exitCode) {
    case TExitCodes.INVALID_PATTERN:
      message = [
        Colors.red(
          "A valid pattern must include a token, e.g. {title}, from the YAML frontmatter.",
        ),
        "This is the pattern you entered: " + Colors.yellow(options.pattern),
        "No files were changed.",
      ];
      break;

    case TExitCodes.NO_FRONTMATTER_FOUND:
      message = [
        Colors.red("No files in this directory contain YAML frontmatter."),
        "This is the directory you entered: " +
        Colors.yellow(options.directory),
        "No files were changed.",
      ];
      break;

    case TExitCodes.UNKNOWN_ERROR:
    default:
      message = [
        Colors.red(
          "There was an unexpected error when attempting to rename the files.",
        ),
      ];
      if (options.error) {
        message.push(
          "This is the error: " + Colors.yellow(options.error.message),
        );
      }
      message.push("No files were changed.");
      break;
  }

  $.formatWithEOL(message, true);
}
