/**
 * Types for this command module.
 * @protected
 * @module commands/inject_id/types
 * @see module:commands/inject_id/mod
 */

import * as CT from "../types.ts";
import { CLITypes } from "./deps.ts";

export type TInjectIdOptions = CLITypes.TCLIStandardOptions & {
  x?: RegExp;
  regex: RegExp;
  s?: boolean;
  skip: boolean;
};

export type TInjectIdRunOptions = CT.TRunOptions & TInjectIdOptions;

export type TInjectIdRunResult = CT.TRunResult;

export interface TInjectIdRun {
  (options: TInjectIdRunOptions): TInjectIdRunResult;
}

export type TInjectIdWriteOptions = TInjectIdRunOptions;
