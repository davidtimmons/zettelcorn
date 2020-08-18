import * as CT from "../types.ts";
import { CLITypes } from "./deps.ts";

export type TInjectTitleOptions = CLITypes.TCLIStandardOptions & {
  s?: boolean;
  skip: boolean;
};

export type TInjectTitleRunOptions = CT.TRunOptions & TInjectTitleOptions;

export type TInjectTitleRunResult = CT.TRunResult;

export interface TInjectTitleRun {
  (options: TInjectTitleRunOptions): TInjectTitleRunResult;
}

export type TInjectTitleWriteOptions = TInjectTitleRunOptions;
