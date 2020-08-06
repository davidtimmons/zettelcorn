export function dasherize(text: string, charToReplace = " "): string {
  return text.replaceAll(charToReplace, "-");
}
