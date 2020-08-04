import { CLI, Colors, FS, Utilities as $ } from "../deps.ts";

interface TConfirmChangeOptions {
  oldFileName: string;
  newFileName: string;
  pattern: string;
}

type TUserResponse = string;

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
    Colors.bold("And this is how that file name will change:"),
    Colors.yellow(options.newFileName),
    "",
    `Is this what you want? Enter y or y to confirm. Any other key will exit.`,
  ].join("\n");

  return await CLI.sendToUser(FS.format(message, $.EOL));
}
