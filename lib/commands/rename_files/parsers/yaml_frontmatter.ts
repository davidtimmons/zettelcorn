import { JSYAML } from "../deps.ts";

export function parseFrontmatter(fileContent: string): object {
  const yaml = extractFrontmatter(fileContent);
  const parsedYAML = parseYAML(yaml);
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

export function parseYAML(yaml: string): object {
  const parsed = JSYAML.load(yaml) || {};
  return parsed;
}