/**
 * Utilities that provide generic supporting functionality.
 * @protected
 * @module utilities/helpers/generic
 * @see module:utilities/helpers/mod
 * @see module:utilities/mod
 */

/// TYPES ///

type TDictionary = { [key: string]: any };

/// LOGIC ///

export function isObjectLiteral(maybeObject: unknown): boolean {
  return typeof maybeObject === "object" && maybeObject !== null &&
    !Array.isArray(maybeObject);
}

export function isEmpty(maybeEmpty: unknown): boolean {
  const isNull = maybeEmpty === null || maybeEmpty === undefined;
  if (isNull) return true;

  const isEmptyString = maybeEmpty === "";
  if (isEmptyString) return true;

  const isEmptyNumber = typeof maybeEmpty === "number" && isNaN(maybeEmpty);
  if (isEmptyNumber) return true;

  const isEmptyArray = Array.isArray(maybeEmpty) && maybeEmpty.length <= 0;
  if (isEmptyArray) return true;

  const isEmptyObject = isObjectLiteral(maybeEmpty) &&
    Object.keys(maybeEmpty as object).length <= 0;
  if (isEmptyObject) return true;

  return false;
}

/**
 * Replace all specific characters in a string with a dash. By default, it replaces all spaces.
 */
export function dasherize(text: string, charToReplace = " "): string {
  return text.replaceAll(charToReplace, "-");
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

/**
 * Find the first example in a list that passes the selection test.
 */
export function findFirstExample<T>(
  list: T[],
  test: (arg: T) => boolean,
): T | null {
  if (list.length <= 0) return null;

  let firstExample: T | null = null;
  let i = 0;
  const len = list.length;
  do {
    const isFirstExample = test(list[i]);
    if (isFirstExample) {
      firstExample = list[i];
    }
    i += 1;
  } while (i < len && isEmpty(firstExample));
  return firstExample;
}
