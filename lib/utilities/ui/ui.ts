/**
 * Utilities for working with the user interface.
 * @protected
 * @module utilities/ui/ui
 * @see module:utilities/ui/mod
 * @see module:utilities/mod
 */

import { Colors, FS, IO } from "../deps.ts";

/// TYPES ///

export enum TUIStyles {
  BOLD,
  CYAN,
  GREEN,
  YELLOW,
}

interface TLogOptions {
  padTop?: boolean;
  padBottom?: boolean;
  style?: TUIStyles;
}

/// LOGIC ///

export const EOL = Deno.build.os === "windows" ? FS.EOL.CRLF : FS.EOL.LF;

export function formatWithEOL(
  message: string | any[],
  print?: boolean,
): string {
  let formatted = "";
  if (Array.isArray(message)) {
    formatted = FS.format(message.join("\n"), EOL);
  } else {
    formatted = FS.format(message, EOL);
  }
  if (print) console.log(formatted);
  return formatted;
}

export function notifyUserOfChange(firstValue: any, lastValue?: any) {
  const message = [
    "",
    firstValue,
  ];
  if (lastValue) message.push(lastValue);
  formatWithEOL(message, true);
}

export async function sendToUser(text: string): Promise<string> {
  console.log(text);
  // Listen to stdin for a new line
  for await (const line of IO.readLines(Deno.stdin)) {
    return line;
  }
  return "";
}

export function log(value: any, options: TLogOptions) {
  const message = [_paint(options.style)(value)];

  if (options.padTop) message.unshift("");
  if (options.padBottom) message.push("");

  formatWithEOL(message, true);
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
