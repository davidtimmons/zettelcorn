/**
 * Find everything in a document that appears to be a topic tag, e.g. "#topic".
 */
export function findAllTags(fileContent: string): string[] {
  const re = /#(?:\S*[\w\d]+\S*)/gi;
  const matches = [...fileContent.matchAll(re)];
  const results = matches.map((match) => {
    return match[0];
  });
  return results;
}

/**
 * Use a heuristic to detect all rows in a document that appear to contain topic tags,
 * e.g. "#this #is #a #topic #tag #row".
 */
export function detectTagRows(fileContent: string): string[] {
  // Find all rows that end with at least two adjacent topic tags.
  const re = /.*#(?:\S*[\w\d]+\S*) +#(?:\S*[\w\d]+\S*) *(?:\r\n|\r|\n)/gi;
  const matches = [...fileContent.matchAll(re)];
  const results = matches.map((match) => {
    return match[0].trim();
  });
  return results;
}

/**
 * Get the set of all unique tags in a document using a heuristic to detect rows that appear
 * to be dedicated to listing topic tags.
 */
export function findHeuristicTags(fileContent: string): string[] {
  const tags = detectTagRows(fileContent)
    .map((row) => {
      return findAllTags(row);
    })
    .reduce((collectedTags, moreTags) => {
      return collectedTags.concat(moreTags);
    }, []);

  const uniqueTags = new Set(tags);

  return uniqueTags.size > 0 ? [...uniqueTags] : findAllTags(fileContent);
}

/**
 * Strip topic tags down to only the keyword text.
 */
export function stripTagDelimiters(tags: string[], delimiter = "#"): string[] {
  return tags.map((tag) => {
    const startStrip = tag.lastIndexOf(delimiter);
    return tag.substring(startStrip + 1);
  });
}

/**
 * Get and format everything in a document that appears to be a topic tag.
 */
export function findKeywords(
  useHeuristic: boolean,
  fileContent: string,
): string[] {
  const getTags = useHeuristic ? findHeuristicTags : findAllTags;
  return stripTagDelimiters(getTags(fileContent));
}
