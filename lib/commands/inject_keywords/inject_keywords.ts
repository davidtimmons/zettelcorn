import { CLI, FS, Path, Utilities as $ } from "../deps.ts";
import * as T from "../types.ts";

/// TYPES ///

interface TInjectKeywordsRunOptions
  extends T.TRunOptions, CLI.TCLIInjectKeywordsOptions {
  readonly directory: string;
}

// interface TRenameFilesReadResult {
//   readonly fileName: string;
//   readonly path: string;
//   readonly yaml: object;
// }

// interface TRenameFilesWriteOptions extends TRenameFilesRunOptions {
//   readonly applyPattern: TRenameFilesApplyPattern;
// }

// type TRenameFilesApplyPattern = TRenameFilesTransform | Function;

// type TRenameFilesTransform = (yaml: TRenameFilesYAML) => string;

// type TRenameFilesYAML = { [key: string]: any };

/// LOGIC ///

export async function run(
  options: TInjectKeywordsRunOptions,
): Promise<T.TRunResult> {
  return Promise.resolve({ status: T.TStatus.OK });
}

export default { run };
