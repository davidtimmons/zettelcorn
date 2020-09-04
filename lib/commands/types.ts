/**
 * Module-level types for all implemented CLI features.
 * @protected
 * @module commands/types
 * @see module:commands/mod
 */

export enum TStatusCodes {
  OK,
  ERROR,
}

export enum TExitCodes {
  INVALID_DIRECTORY,
  INVALID_PATTERN,
  NO_DIRECTORY_FOUND,
  NO_FRONTMATTER_FOUND,
  NO_TAGS_FOUND,
  NO_TITLE_FOUND,
  UNKNOWN_ERROR,
  UNMATCHED_PATTERN,
  WRITE_ERROR,
}

export interface TCommandModule {
  run: TCommand;
}

export interface TCommand {
  (options: any): TRunResult;
}

export interface TRunOptions {}

export type TRunResult = Promise<{
  readonly status: TStatusCodes;
}>;
