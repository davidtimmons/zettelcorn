import { JSYAML } from "../deps.ts";

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

export function parseYAML(yaml: string): { [key: string]: any } {
  const parsed = JSYAML.load(yaml) || {};
  return parsed;
}
