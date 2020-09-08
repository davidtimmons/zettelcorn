/**
 * Types for this command module.
 * @protected
 * @module commands/init/types
 * @see module:commands/init/mod
 */

import * as CT from "../types.ts";
import { CLITypes } from "./deps.ts";

export type TInitOptions = CLITypes.TCLIStandardOptions & {
  force: boolean;
};

export type TInitRunOptions = CT.TRunOptions & TInitOptions;

export type TInitRunResult = CT.TRunResult;

export interface TInitRun {
  (options: TInitRunOptions): TInitRunResult;
}

export type TInitWriteOptions = TInitRunOptions;
