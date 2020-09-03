/**
 * Communicates the status of this command to the user.
 * @protected
 * @module commands/inject_keywords/ui/status
 * @see module:commands/inject_keywords/mod
 */

import { Colors, Utilities as $ } from "../deps.ts";
import { TInjectKeywordsRunOptions } from "../types.ts";

/// TYPES ///

interface TConfirmChangeOptions {
  fileName: string;
  keywords: string;
  willMerge: boolean;
  willSkip: boolean;
}

interface TNotifyUserOfExitOptions extends TInjectKeywordsRunOptions {
  error?: Error;
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
  ];

  const mergeMsg = [
    Colors.yellow(
      '4. If "keywords" exists and already contains a list, topic tags will be merged into the existing list.',
    ),
    Colors.yellow(
      '5. If "keywords" exists but is not a list, the script will fail.',
    ),
  ];

  const overwriteMsg = [
    Colors.yellow(
      '4. If topic tags are found but "keywords" already exists, it will be overwritten.',
    ),
  ];

  const skipMsg = [
    "",
    Colors.red(
      'If topic tags are found but "keywords" already exists, that file will be skipped.',
    ),
  ];

  const finalMsg = [
    "",
    `Is this what you want? Enter y or Y to confirm. Any other key will exit.`,
  ];

  const msg = standardMsg.concat(
    options.willMerge ? mergeMsg : overwriteMsg,
    options.willSkip ? skipMsg : [],
    finalMsg,
  );

  return await $.sendToUser($.formatWithEOL(msg));
}

export function notifyUserOfExit(options: TNotifyUserOfExitOptions) {
  if (options.silent) return;
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
