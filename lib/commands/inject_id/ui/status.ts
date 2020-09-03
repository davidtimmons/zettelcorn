/**
 * Communicates the status of this command to the user.
 * @protected
 * @module commands/inject_id/ui/status
 * @see module:commands/inject_id/mod
 */

import { TExitCodes } from "../../types.ts";
import { Colors, Utilities as $ } from "../deps.ts";
import { TInjectIdRunOptions } from "../types.ts";

/// TYPES ///

interface TConfirmChangeOptions {
  fileName: string;
  id: string;
  willSkip: boolean;
}

interface TNotifyUserOfExitOptions extends TInjectIdRunOptions {
  error?: Error;
  exitCode: TExitCodes;
}

type TUserResponse = string;

/// LOGIC ///

export async function confirmChange(
  options: TConfirmChangeOptions,
): Promise<TUserResponse> {
  const standardMsg = [
    "This is an example file:",
    Colors.cyan(options.fileName),
    "",
    "Here is the ID found within its text:",
    Colors.cyan(options.id),
    "",
    Colors.yellow(
      "1. YAML frontmatter will be injected into the file if it does not exist.",
    ),
    Colors.yellow(
      '2. An "id" key will be added to the frontmatter if it does not exist.',
    ),
    Colors.yellow(
      '3. If an ID is found it will be injected into "id".',
    ),
    Colors.yellow(
      '4. If an ID is found but one already exists in "id", it will be overwritten.',
    ),
  ];

  const skipMsg = [
    "",
    Colors.red(
      'If an ID is found but "id" already exists, that file will be skipped.',
    ),
  ];

  const finalMsg = [
    "",
    `Is this what you want? Enter y or Y to confirm. Any other key will exit.`,
  ];

  const msg = standardMsg.concat(
    options.willSkip ? skipMsg : [],
    finalMsg,
  );

  return await $.sendToUser($.formatWithEOL(msg));
}

export function notifyUserOfExit(options: TNotifyUserOfExitOptions) {
  if (options.silent) return;
  let message: any[] = [];

  switch (options.exitCode) {
    case TExitCodes.UNMATCHED_PATTERN:
      message = [
        Colors.red(
          "No files in this directory contained an ID that matched the given pattern.",
        ),
        "This is the directory you entered: " +
        Colors.yellow(options.directory),
        "This is the pattern you entered: " +
        Colors.yellow(options.regex.toString()),
        "No files were changed.",
      ];
      break;

    case TExitCodes.UNKNOWN_ERROR:
      default:
        message = [
          Colors.red(
            "There was an unexpected error when attempting to inject an ID into file frontmatter.",
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
