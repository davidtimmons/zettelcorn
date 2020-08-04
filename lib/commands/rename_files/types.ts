import * as T from "../types.ts";

export interface TRenameFilesCommandOptions extends T.TCommandOptions {
  readonly directory: string;
  readonly pattern: string;
  readonly recursive: boolean;
}

export interface TRenameFilesCommandResult extends T.TCommandResult {}

export interface TRenameFilesReadResult extends T.TCommandResult {
  readonly fileName: string;
  readonly path: string;
  readonly yaml: object;
}

export interface TRenameFilesWriteOptions extends T.TCommandOptions {
  readonly fileName: string;
  readonly path: string;
  readonly transform: (yaml: object) => string;
  readonly yaml: object;
}

export interface TRenameFilesWriteResult extends T.TCommandResult {}
