export function findTags(fileContent: string): string[] {
  const re = /#\S*[\w\d]+\S*/gi;
  const matches = [...fileContent.matchAll(re)];
  const results = matches.map((match) => {
    return match[0];
  });
  return results;
}

export function stripTagDelimiters(tags: string[], delimiter = "#"): string[] {
  return tags.map((tag) => {
    const startStrip = tag.lastIndexOf(delimiter);
    return tag.substring(startStrip + 1);
  });
}

export function findKeywords(fileContent: string): string[] {
  return stripTagDelimiters(findTags(fileContent));
}
