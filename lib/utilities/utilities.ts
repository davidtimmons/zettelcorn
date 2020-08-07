import { FS } from "./deps.ts";

export const EOL = Deno.build.os === "windows" ? FS.EOL.CRLF : FS.EOL.LF;

export function composeFunctions(arg?: any) {
  let _arg = arg;
  let _composition = (x: any) => x;

  return {
    get compose() {
      return _composition;
    },

    get result() {
      if (arg === undefined) {
        throw TypeError("You must provide an argument to get a result.");
      } else {
        return _arg;
      }
    },

    apply(fn: Function) {
      const baseFn = _composition;
      _composition = (x: any) => fn(baseFn(x));
      if (arg !== undefined) _arg = fn(_arg);
      return this;
    },

    applyIf(condition: boolean, fn: Function) {
      const baseFn = _composition;
      if (condition) {
        _composition = (x: any) => fn(baseFn(x));
        if (arg !== undefined) _arg = fn(_arg);
      }
      return this;
    },
  };
}

export function identity(x: unknown): unknown {
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

export function isObjectLiteral(maybeObject: unknown): boolean {
  return typeof maybeObject === "object" && maybeObject !== null &&
    !Array.isArray(maybeObject);
}
