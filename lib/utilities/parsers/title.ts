/**
 * Utilities for working with Markdown-style titles, e.g. "# Title", found within text data.
 * @protected
 * @module utilities/parsers/title
 * @see module:utilities/parsers/mod
 * @see module:utilities/mod
 */

/**
 * Find the first line a document that appears to be a Markdown title.
 */
export function findH1Title(fileContent: string): string {
  // Find an H1 line preceded by the beginning of the content or a line break.
  // The title must contain at least one word or digit character.
  const re = /(?<=^|\r\n|\r|\n *)# +\S*[\w\d]+.*/i;
  const firstMatch = fileContent.match(re) || [];
  return firstMatch[0]?.trim() || "";
}

/**
 * Remove the Markdown title delimiter from a string.
 */
export function removeTitleDelimiter(title: string): string {
  const startStrip = title.indexOf("#");
  return title.substring(startStrip + 1).trim();
}

/**
 * Get and format what appears to be the title in a Markdown document.
 */
export function findTitle(fileContent: string): string {
  return removeTitleDelimiter(findH1Title(fileContent));
}
