import { CLI, Colors, FS, Utilities as $ } from "../deps.ts";

/// TYPES ///

export enum TUIStyles {
  BOLD,
  CYAN,
  GREEN,
  YELLOW,
}

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

interface TLogOptions {
  padTop?: boolean;
  padBottom?: boolean;
  style?: TUIStyles;
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
  ].join("\n");

  return await CLI.sendToUser(FS.format(message, $.EOL));
}

export function notifyUserOfExit(options: TNotifyUserOfExitOptions) {
  let message = "";

  if (options.directory) {
    message = [
      Colors.bold("This is the directory you entered:"),
      Colors.cyan(options.directory),
      "",
      "None of the files within this directory contained YAML frontmatter. No files were changed.",
    ].join("\n");
  } else if (options.pattern) {
    message = [
      Colors.bold("This is the pattern you entered:"),
      Colors.cyan(options.pattern),
      "",
      "A valid pattern must include a token, e.g. {title}, from the YAML frontmatter. No files were changed.",
    ].join("\n");
  } else if (options.error) {
    message = [
      "There was an unexpected error when attempting to rename the files.",
      "",
      "No files were changed.",
      "",
    ].join("\n");
  }

  console.log(FS.format(message, $.EOL));
}

export function notifyUserOfChange(oldValue: any, newValue: any) {
  const message = [
    "",
    oldValue,
    newValue,
  ].join("\n");

  console.log(FS.format(message, $.EOL));
}

export function log(value: any, options: TLogOptions) {
  const message = [_paint(options.style)(value)];

  if (options.padTop) message.unshift("");
  if (options.padBottom) message.push("");

  console.log(FS.format(message.join("\n"), $.EOL));
}

function _paint(style?: TUIStyles): Function {
  switch (style) {
    case TUIStyles.BOLD:
      return (x: any) => Colors.bold(x);
    case TUIStyles.CYAN:
      return (x: any) => Colors.cyan(x);
    case TUIStyles.GREEN:
      return (x: any) => Colors.green(x);
    case TUIStyles.YELLOW:
      return (x: any) => Colors.yellow(x);
    default:
      return (x: any) => x;
  }
}

export const __private__ = {
  _paint,
};
