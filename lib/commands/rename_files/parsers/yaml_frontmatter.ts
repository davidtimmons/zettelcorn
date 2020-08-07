import { JSYAML, Utilities as $ } from "../deps.ts";

/// TYPES ///

type TDictionary = { [key: string]: any };

/// LOGIC ///

export function parseFrontmatter(fileContent: string): object {
  const rawYAML = extractFrontmatter(fileContent);
  const parsedYAML = parseYAML(rawYAML);
  return parsedYAML;
}

export function extractFrontmatter(fileContent: string): string {
  const openingDelimiterIndex = fileContent.indexOf("---");
  const closingDelimiterIndex = fileContent.indexOf("---", 3);
  const hasNoFrontmatter = openingDelimiterIndex === -1 ||
    closingDelimiterIndex === -1 ||
    openingDelimiterIndex === closingDelimiterIndex;

  if (hasNoFrontmatter) return "";

  const frontmatter = fileContent.substring(3, closingDelimiterIndex).trim();
  return frontmatter;
}

export function parseYAML(yaml: string): TDictionary {
  const parsed = JSYAML.load(yaml) || {};
  return parsed;
}

export function proxyPrintOnAccess(jsObject: TDictionary): TDictionary {
  const handler = {
    get(map: TDictionary, key: string): any {
      if (!$.isObjectLiteral(map[key])) {
        return `${map[key]}`;
      }

      const getStrings = (obj: TDictionary): string => {
        return Object.entries(obj)
          .map((tuple: [string, any]) => {
            if ($.isObjectLiteral(tuple[1])) {
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
