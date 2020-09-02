/**
 * Communicates the status of this command to the user.
 * @protected
 * @module commands/rename_files/ui/status
 * @see module:commands/rename_files/mod
 */

import { Colors, Utilities as $ } from "../deps.ts";

/// TYPES ///

interface TConfirmChangeOptions {
  oldFileName: string;
  newFileName: string;
  pattern: string;
}

interface TNotifyUserOfExitOptions {
  error?: Error;
  directory?: string;
  pattern?: string;
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

  return await $.sendToUser($.formatWithEOL(message));
}

export function notifyUserOfExit(options: TNotifyUserOfExitOptions) {
  let message: any[] = [];

  if (options.directory) {
    message = [
      Colors.bold("This is the directory you entered:"),
      Colors.cyan(options.directory),
      "",
      "None of the files within this directory contained YAML frontmatter. No files were changed.",
    ];
  } else if (options.pattern) {
    message = [
      Colors.bold("This is the pattern you entered:"),
      Colors.cyan(options.pattern),
      "",
      "A valid pattern must include a token, e.g. {title}, from the YAML frontmatter. No files were changed.",
    ];
  } else if (options.error) {
    message = [
      "There was an unexpected error when attempting to rename the files.",
      "",
      "No files were changed.",
      "",
    ];
  }

  $.formatWithEOL(message, true);
}
