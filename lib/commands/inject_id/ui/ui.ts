import { Colors, Utilities as $ } from "../deps.ts";

/// TYPES ///

interface TConfirmChangeOptions {
  fileName: string;
  id: string;
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
  const message = [
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
      "None of the files within this directory contained a matching ID. No files were changed.",
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
