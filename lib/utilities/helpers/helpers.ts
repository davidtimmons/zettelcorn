/// TYPES ///

type TDictionary = { [key: string]: any };

/// LOGIC ///

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

export function isEmpty(maybeEmpty: unknown): boolean {
  const isNull = maybeEmpty === null || maybeEmpty === undefined;
  if (isNull) return true;

  const isEmptyString = maybeEmpty === "";
  if (isEmptyString) return true;

  const isEmptyArray = Array.isArray(maybeEmpty) && maybeEmpty.length <= 0;
  if (isEmptyArray) return true;

  const isEmptyObject = isObjectLiteral(maybeEmpty) &&
    Object.keys(maybeEmpty as object).length <= 0;
  if (isEmptyObject) return true;

  return false;
}

export function proxyPrintOnAccess(jsObject: TDictionary): TDictionary {
  const handler = {
    get(map: TDictionary, key: string): any {
      if (!isObjectLiteral(map[key])) {
        return `${map[key]}`;
      }

      const getStrings = (obj: TDictionary): string => {
        return Object.entries(obj)
          .map((tuple: [string, any]) => {
            if (isObjectLiteral(tuple[1])) {
              // TODO: Decide how best to print deeply nested objects.
              // const deepStrings = getStrings(tuple[1]);
              // return `${tuple[0]}=${deepStrings}`;
              return getStrings(tuple[1]);
            }
            return `${tuple[0]}=${tuple[1]}`;
          })
          .join(",");
      };

      return getStrings(map[key]);
    },
  };

  return new Proxy(jsObject, handler);
}
