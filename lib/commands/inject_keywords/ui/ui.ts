import { Colors, Utilities as $ } from "../deps.ts";

/// TYPES ///

interface TConfirmChangeOptions {
  fileName: string;
  keywords: string;
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
    "Here are the topic tags found in it:",
    Colors.cyan(options.keywords),
    "",
    Colors.yellow(
      "1. YAML frontmatter will be injected into the file if it does not exist.",
    ),
    Colors.yellow(
      '2. A "keywords" key will be added to the frontmatter if it does not exist.',
    ),
    Colors.yellow(
      '3. Found topic tags will be injected into "keywords".',
    ),
    Colors.yellow(
      '4. If "keywords" exists and already contains a list, topic tags are merged into the existing list.',
    ),
    Colors.yellow(
      '5. If "keywords" exists but is not a list, the script will fail.',
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
      "None of the files within this directory contained topic tags. No files were changed.",
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
