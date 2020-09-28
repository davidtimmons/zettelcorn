/**
 * Types for this command module.
 * @protected
 * @module commands/inject_id/types
 * @see module:commands/inject_id/mod
 */

import type * as CT from "../types.ts";
import type { CLITypes } from "./deps.ts";

export type TInjectIdOptions = CLITypes.TCLIStandardOptions & {
  regex: RegExp;
  skip: boolean;
};

export type TInjectIdRunOptions = CT.TRunOptions & TInjectIdOptions;

export type TInjectIdRunResult = CT.TRunResult;

export interface TInjectIdRun {
  (options: TInjectIdRunOptions): TInjectIdRunResult;
}

export type TInjectIdWriteOptions = TInjectIdRunOptions;
