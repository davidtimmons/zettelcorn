/**
 * Communicates the status of this command to the user.
 * @protected
 * @module commands/inject_title/ui/status
 * @see module:commands/inject_title/mod
 */

import { Colors, Utilities as $ } from "../deps.ts";

/// TYPES ///

interface TConfirmChangeOptions {
  fileName: string;
  title: string;
  willSkip: boolean;
}

interface TNotifyUserOfExitOptions {
  error?: Error;
  directory?: string;
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
    "Here is the title found within its text:",
    Colors.cyan(options.title),
    "",
    Colors.yellow(
      "1. YAML frontmatter will be injected into the file if it does not exist.",
    ),
    Colors.yellow(
      '2. A "title" key will be added to the frontmatter if it does not exist.',
    ),
    Colors.yellow(
      '3. If a title is found it will be injected into "title".',
    ),
    Colors.yellow(
      '4. If a title is found but one already exists in "title", it will be overwritten.',
    ),
  ];

  const skipMsg = [
    "",
    Colors.red(
      'If a title is found but "title" already exists, that file will be skipped.',
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
  let message: any[] = [];

  if (options.directory) {
    message = [
      Colors.bold("This is the directory you entered:"),
      Colors.cyan(options.directory),
      "",
      "None of the files within this directory contained a Markdown title. No files were changed.",
    ];
  } else if (options.error) {
    message = [
      "There was an unexpected error when attempting to inject the files.",
      "",
      "No files were changed.",
      "",
    ];
  }

  $.formatWithEOL(message, true);
}