/**
 * Module-level codes that add extra information to an expected or unexpected program behavior.
 * @protected
 * @module commands/types_enums
 * @see module:commands/mod
 */

export enum TExitCodes {
  INVALID_DIRECTORY,
  INVALID_NUMBER,
  INVALID_PATTERN,
  NO_DIRECTORY_FOUND,
  NO_FRONTMATTER_FOUND,
  NO_TAGS_FOUND,
  NO_TITLE_FOUND,
  UNKNOWN_ERROR,
  UNMATCHED_PATTERN,
  WRITE_ERROR,
}

export enum TStatusCodes {
  OK,
  ERROR,
}
