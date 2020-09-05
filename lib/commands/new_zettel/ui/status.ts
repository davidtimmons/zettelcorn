/**
 * Communicates the status of this command to the user.
 * @protected
 * @module commands/new_zettel/ui/status
 * @see module:commands/new_zettel/mod
 */

import { TExitCodes } from "../../types.ts";
import { Colors, Utilities as $ } from "../deps.ts";
import { TNewZettelRunOptions } from "../types.ts";

/// TYPES ///

type TUserResponse = string;

interface TConfirmChangeOptions {
  foundLocalTemplate: boolean;
  templateName: string;
  total: number;
  zettelcornDir: string;
  zettelDir: string;
}

interface TNotifyUserOfExitOptions extends TNewZettelRunOptions {
  error?: Error;
  exitCode: TExitCodes;
}

/// LOGIC ///

export async function confirmChange(
  options: TConfirmChangeOptions,
): Promise<TUserResponse> {
  const startMsg = [
    Colors.cyan(options.total.toString()) +
    ` new zettel ${
      options.total === 1 ? "file" : "files"
    } will be written to this directory:`,
    Colors.cyan(options.zettelDir),
    "",
    `The file ${
      options.total === 1 ? "name" : "names"
    } will match this pattern:`,
    Colors.cyan(options.templateName),
    "",
  ];

  const templateMsg = options.foundLocalTemplate
    ? "All new file content will match your " +
      Colors.cyan("local template file") + "."
    : "All new file content will match the " +
      Colors.cyan("default template") + ".";

  const endMsg = [
    templateMsg,
    `Is this what you want? Enter y or Y to confirm. Any other key will exit.`,
  ];

  const msg = startMsg.concat(endMsg);
  return await $.promptUser($.formatWithEOL(msg));
}

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

    case TExitCodes.INVALID_NUMBER:
      message = [
        Colors.red(
          "The total number of zettel files to create must be an integer greater than 0.",
        ),
        "This is the total you entered: " +
        Colors.yellow(options.total.toString()),
        "No files were created.",
      ];
      break;

    //   case TExitCodes.WRITE_ERROR:
    //     message = [
    //       Colors.red(
    //         "There was an unexpected error when writing files to the Zettelcorn directory.",
    //       ),
    //       "This is the directory where the problem occurred: " +
    //       Colors.yellow(Path.join(options.directory, ".zettelcorn")),
    //     ];
    //     if (options.error) {
    //       message.push(
    //         "This is the error: " + Colors.yellow(options.error.message),
    //       );
    //     }
    //     break;

    case TExitCodes.UNKNOWN_ERROR:
    default:
      message = [
        Colors.red(
          "There was an unexpected error when attempting to create new zettel files.",
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
