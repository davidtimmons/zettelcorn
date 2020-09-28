/**
 * Types for this command module.
 * @protected
 * @module commands/inject_keywords/types
 * @see module:commands/inject_keywords/mod
 */

import type * as CT from "../types.ts";
import type { CLITypes } from "./deps.ts";

export type TInjectKeywordsOptions = CLITypes.TCLIStandardOptions & {
  heuristic: boolean;
  merge: boolean;
  skip: boolean;
};

export type TInjectKeywordsRunOptions = CT.TRunOptions & TInjectKeywordsOptions;

export type TInjectKeywordsRunResult = CT.TRunResult;

export interface TInjectKeywordsRun {
  (options: TInjectKeywordsRunOptions): TInjectKeywordsRunResult;
}

export type TInjectKeywordsWriteOptions = TInjectKeywordsRunOptions;
