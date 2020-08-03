import * as CommandsTypes from "../commands_types.ts";

export interface TRenameFilesCommandOptions
  extends CommandsTypes.TCommandOptions {
  readonly path: string;
  readonly pattern: string;
  readonly recursive: boolean;
}

export interface TRenameFilesCommandResult
  extends CommandsTypes.TCommandResult {}

export interface TRenameFilesReadResult extends CommandsTypes.TReadResult {
  readonly fileName: string;
  readonly path: string;
  readonly yaml: object;
}

export interface TRenameFilesWriteOptions extends CommandsTypes.TWriteOptions {
  readonly fileName: string;
  readonly path: string;
  readonly transform: (yaml: object) => string;
  readonly yaml: object;
}

export interface TRenameFilesWriteResult extends CommandsTypes.TWriteResult {}
