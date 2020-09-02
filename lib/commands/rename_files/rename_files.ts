/**
 * Rename files containing YAML frontmatter.
 * @protected
 * @implements {ICommandModule}
 * @module commands/rename_files/rename_files
 * @see module:commands/rename_files/mod
 */

import { TStatus } from "../types.ts";
import { Path, Utilities as $ } from "./deps.ts";
import { Status, Types } from "./mod.ts";

export async function run(
  options: Types.TRenameFilesRunOptions,
): Types.TRenameFilesRunResult {
  // The rename files feature is intended to work with YAML frontmatter.
  const hasToken = $.hasTokenExp(options.pattern);
  if (!hasToken) {
    Status.notifyUserOfExit({ pattern: options.pattern });
    Deno.exit();
  }

  // The file renaming function requires a valid file and YAML object.
  let fileQueue: $.TReadResult[] = [];
  try {
    fileQueue = await $.buildFileQueue({
      ...options,
      requireMarkdown: options.markdown,
      requireYaml: true,
      yamlTransformation: ({ fileYAML }) => $.proxyPrintOnAccess(fileYAML),
    });
  } catch (err) {
    Status.notifyUserOfExit({ error: err });
    throw err;
  }

  // Confirm change before renaming all files.
  const noFrontmatterFound = $.isEmpty(fileQueue);
  if (noFrontmatterFound) {
    Status.notifyUserOfExit({ directory: options.directory });
    Deno.exit();
  }

  const applyPattern = $.composeFunctions()
    .apply($.generateGetterFromTokenExp(options.pattern))
    .applyIf(options.dashed, $.dasherize)
    .compose;

  const firstExample = fileQueue[0];
  const previewFileName = applyPattern(firstExample.yaml || {});
  const userResponse = options.silent ? "Y" : await Status.confirmChange({
    newFileName: previewFileName,
    oldFileName: firstExample.fileName,
    pattern: options.pattern,
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();

  await $.writeQueuedFiles(_write, {
    ...options,
    applyPattern,
    startWorkMsg: `Renamed files:`,
    endWorkMsg: `${fileQueue.length} files renamed.`,
  }, fileQueue);

  return { status: TStatus.OK };
}

async function _write(
  options: Types.TRenameFilesWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const basePath = Path.dirname(file.path);
  const newName = options.applyPattern(file.yaml);
  const newPath = Path.join.apply(null, [basePath, newName]);
  const oldPath = file.path;

  // Overwrites files on path collision rather than failing.
  await Deno.rename(oldPath, newPath);

  if (options.verbose) $.notifyUserOfChange(oldPath, newName);
}

export const __private__ = {
  _write,
};

export default { run };
