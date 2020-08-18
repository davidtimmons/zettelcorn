import * as CT from "../types.ts";
import { CLITypes } from "./deps.ts";

export type TRenameFilesOptions = CLITypes.TCLIStandardOptions & {
  d?: boolean;
  dashed: boolean;
};

export type TRenameFilesRunOptions = CT.TRunOptions & TRenameFilesOptions & {
  readonly pattern: string;
};

export type TRenameFilesRunResult = CT.TRunResult;

export interface TRenameFilesRun {
  (options: TRenameFilesRunOptions): TRenameFilesRunResult;
}

export type TRenameFilesWriteOptions = TRenameFilesRunOptions & {
  readonly applyPattern: TRenameFilesTransform | Function;
};

type TRenameFilesTransform = (yaml: { [key: string]: any }) => string;
