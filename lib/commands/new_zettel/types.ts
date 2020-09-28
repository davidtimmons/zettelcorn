/**
 * Types for this command module.
 * @protected
 * @module commands/new_zettel/types
 * @see module:commands/new_zettel/mod
 */

import type * as CT from "../types.ts";
import type { CLITypes } from "./deps.ts";

export type TNewZettelOptions = CLITypes.TCLIStandardOptions & {
  default: boolean;
  total: number;
};

export type TNewZettelRunOptions = CT.TRunOptions & TNewZettelOptions;

export type TNewZettelRunResult = CT.TRunResult;

export interface TNewZettelRun {
  (options: TNewZettelRunOptions): TNewZettelRunResult;
}

export type TNewZettelWriteOptions = TNewZettelRunOptions;
