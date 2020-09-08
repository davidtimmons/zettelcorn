/**
 * Utilities for detecting and interpreting YAML frontmatter found within text data.
 * @protected
 * @module utilities/parsers/yaml_frontmatter
 * @see module:utilities/parsers/mod
 * @see module:utilities/mod
 */

import { FS, JSYAML } from "../deps.ts";
import * as UI$ from "../ui/mod.ts";

/// TYPES ///

type TYAML = { [key: string]: any };

/// LOGIC ///

export function getDelimiterPositions(fileContent: string): [number, number] {
  const openingDelimiterIndex = fileContent.indexOf("---");
  const closingDelimiterIndex = fileContent.indexOf("---", 3);
  return [openingDelimiterIndex, closingDelimiterIndex];
}

export function hasFrontmatter(
  fileContent: string,
  openingDelimiterIndex?: number,
  closingDelimiterIndex?: number,
): boolean {
  let [idx01, idx02] = [openingDelimiterIndex, closingDelimiterIndex];
  if (!idx01 || !idx02) {
    [idx01, idx02] = getDelimiterPositions(fileContent);
  }

  const hasNoFrontmatter = idx01 === -1 || idx02 === -1 || idx01 === idx02;
  return !hasNoFrontmatter;
}

export function parseFrontmatter(fileContent: string): TYAML {
  const rawYAML = extractFrontmatter(fileContent);
  const parsedYAML = parseYAML(rawYAML);
  return parsedYAML;
}

export function extractFrontmatter(fileContent: string): string {
  const [idx01, idx02] = getDelimiterPositions(fileContent);

  if (!hasFrontmatter(fileContent, idx01, idx02)) {
    return "";
  }

  const frontmatter = fileContent.substring(3, idx02).trim();
  return frontmatter;
}

export function parseYAML(rawYAML: string): TYAML {
  const parsed = JSYAML.load(rawYAML) || {};
  return parsed;
}

export function convertYAMLtoFrontmatter(yaml: TYAML): string {
  const frontmatter = [
    "---",
    convertYAMLtoText(yaml).trim(),
    "---",
  ];

  return UI$.formatWithEOL(frontmatter);
}

export function convertYAMLtoText(yaml: TYAML): string {
  const dumped = JSYAML.dump(yaml);
  return dumped;
}

export function removeFrontmatter(fileContent: string): string {
  const [idx01, idx02] = getDelimiterPositions(fileContent);
  if (!hasFrontmatter(fileContent, idx01, idx02)) {
    return fileContent;
  } else {
    return fileContent.substring(idx02 + 3).trimLeft();
  }
}

export function prependFrontmatter(fileContent: string, yaml: TYAML): string {
  const shavedFile = removeFrontmatter(fileContent);
  const frontmatter = convertYAMLtoFrontmatter(yaml);
  const newFile = [
    frontmatter,
    shavedFile,
  ].join("\n");

  return FS.format(newFile, UI$.EOL);
}
