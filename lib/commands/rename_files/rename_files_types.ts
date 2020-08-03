import {
  TCommandOptions,
  TCommandResult,
  TReadOptions,
  TReadResult,
  TWriteOptions,
  TWriteResult,
} from "./commands_types.ts";

interface TRenameFilesCommandOptions extends TCommandOptions {
  readonly path: string;
  readonly pattern: string;
  readonly recursive: boolean;
}

interface TRenameFilesCommandResult extends TCommandResult {}

interface TRenameFilesReadOptions extends TReadOptions {
  readonly dir: string;
  readonly recursive: boolean;
}

interface TRenameFilesReadResult extends TReadResult {
  readonly fileName: string;
  readonly path: string;
  readonly yaml: object;
}

interface TRenameFilesWriteOptions extends TWriteOptions {
  readonly fileName: string;
  readonly path: string;
  readonly transform: (yaml: object) => string;
  readonly yaml: object;
}

interface TRenameFilesWriteResult extends TWriteResult {}

export {
  TRenameFilesCommandOptions,
  TRenameFilesCommandResult,
  TRenameFilesReadOptions,
  TRenameFilesReadResult,
  TRenameFilesWriteOptions,
  TRenameFilesWriteResult,
};
