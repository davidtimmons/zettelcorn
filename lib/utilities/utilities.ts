import { FS } from "./deps.ts";

export const EOL = Deno.build.os === "windows" ? FS.EOL.CRLF : FS.EOL.LF;

export function identity(x: any): any {
  return x;
}

export function doIf(
  condition: boolean,
  right: Function,
  left: Function,
): Function {
  if (condition) {
    return right;
  } else {
    return left;
  }
}

export function doOnlyIf(condition: boolean, right: Function): Function {
  if (condition) {
    return right;
  } else {
    return identity;
  }
}
