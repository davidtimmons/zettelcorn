import { TCommandStatus } from "./commands_types.ts";
import {
  TRenameFilesCommandOptions,
  TRenameFilesCommandResult,
  TRenameFilesReadOptions,
  TRenameFilesReadResult,
  TRenameFilesWriteOptions,
  TRenameFilesWriteResult,
} from "./rename_files_types.ts";
import { Path } from "./deps.ts";
import { generateInterpolatedString } from "./token.ts";

export default function run(
  options: TRenameFilesCommandOptions,
): TRenameFilesCommandResult {
  // path, pattern, recursive
  const transform = Function(
    "yaml",
    "return " + generateInterpolatedString("yaml", options.pattern),
  );
  return { message: "", status: TCommandStatus.OK };
}

// function read(options: TRenameFilesReadOptions): TRenameFilesReadResult[] {
// Note: https://deno.land/std/fs#walk
// }

async function write(
  options: TRenameFilesWriteOptions,
): Promise<TRenameFilesWriteResult> {
  const oldPath = Path.posix.join.apply(null, [options.path, options.fileName]);
  const newPath = Path.posix.join.apply(
    null,
    [options.path, options.transform(options.yaml)],
  );

  const status = await Deno.rename(oldPath, newPath);
  console.log(status); // undefined on success (error on failure?)

  return { message: "", status: TCommandStatus.OK };
}

// write({
//   path: '/home/bert/projects/zettelcorn/lib/parser',
//   fileName: 'tmp',
//   yaml: {
//     id: 123,
//     title: 'pasta',
//   },
//   transform: (yaml: object) => `${yaml.id}-${yaml.title}-tmp.xyz`,
// })
