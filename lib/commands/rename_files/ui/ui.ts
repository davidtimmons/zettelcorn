import { CLI, Colors, FS, Utilities as $ } from "../deps.ts";

/// TYPES ///

interface TConfirmChangeOptions {
  oldFileName: string;
  newFileName: string;
  pattern: string;
}

interface TNotifyUserOfExitOptions {
  directory: string;
}

type TUserResponse = string;

/// LOGIC ///

export async function confirmChange(
  options: TConfirmChangeOptions,
): Promise<TUserResponse> {
  const message = [
    Colors.bold("This is the pattern you entered:"),
    Colors.cyan(options.pattern),
    "",
    Colors.bold("Here is an example of an existing file name:"),
    Colors.cyan(options.oldFileName),
    "",
    Colors.bold("This is how that file name will change:"),
    Colors.yellow(options.newFileName),
    "",
    `Is this what you want? Enter y or Y to confirm. Any other key will exit.`,
  ].join("\n");

  return await CLI.sendToUser(FS.format(message, $.EOL));
}

export function notifyUserOfExit(options: TNotifyUserOfExitOptions) {
  const message = [
    Colors.bold("This is the directory you entered:"),
    Colors.cyan(options.directory),
    "",
    "None of the files within this directory contained YAML frontmatter. No files were changed.",
  ].join("\n");

  console.log(FS.format(message, $.EOL));
}
