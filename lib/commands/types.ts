/**
 * Module-level types for all implemented CLI features.
 * @protected
 * @module commands/types
 * @see module:commands/mod
 */

import type { TExitCodes, TStatusCodes } from "./types_enums.ts";

export interface TCommandModule {
  run: TCommand;
}

export interface TCommand {
  (options: any): TRunResult;
}

export interface TRunOptions {
  zettelcornConfigDirectory?: string;
}

export type TRunResult = Promise<{
  readonly status: TStatusCodes;
}>;
