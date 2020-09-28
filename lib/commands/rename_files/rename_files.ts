/**
 * Rename files containing YAML frontmatter.
 * @protected
 * @implements {ICommandModule}
 * @module commands/rename_files/rename_files
 * @see module:commands/rename_files/mod
 */

import { TExitCodes, TStatusCodes } from "../mod.ts";
import { Path, Utilities as $ } from "./deps.ts";
import type * as Types from "./types.ts";
import * as Status from "./ui/status.ts";

export async function run(
  options: Types.TRenameFilesRunOptions,
): Types.TRenameFilesRunResult {
  // The rename files feature is intended to work with YAML frontmatter.
  const hasToken = $.hasTokenExp(options.pattern);
  if (!hasToken) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.INVALID_PATTERN,
    });
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
    Status.notifyUserOfExit({
      ...options,
      error: err,
      exitCode: TExitCodes.UNKNOWN_ERROR,
    });
    throw err;
  }

  // Compose the function that renames all selected files on the drive.
  const applyPattern = $.composeFunctions()
    .apply($.generateGetterFromTokenExp(options.pattern))
    .applyIf(options.dashed, $.dasherize)
    .compose;

  if (!options.silent) {
    await _confirmChangeWithUser(options, fileQueue, applyPattern);
  }

  await $.writeQueuedFiles(_write, {
    ...options,
    applyPattern,
    startWorkMsg: `Renamed files:`,
    endWorkMsg: `${fileQueue.length} files renamed.`,
  }, fileQueue);

  return { status: TStatusCodes.OK };
}

async function _confirmChangeWithUser(
  options: Types.TRenameFilesRunOptions,
  fileQueue: $.TReadResult[],
  applyPattern: Function,
): Promise<void> {
  // Find the first file example with a YAML object.
  const firstExample = $.findFirstExample(fileQueue, (file) => {
    return !$.isEmpty(file.yaml);
  });

  // Confirm change before renaming all files.
  const noFrontmatterFound = $.isEmpty(firstExample);
  if (noFrontmatterFound) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.NO_FRONTMATTER_FOUND,
    });
    Deno.exit();
  }

  const userResponse = await Status.confirmChange({
    newFileName: applyPattern(firstExample?.yaml || {}),
    oldFileName: firstExample?.fileName || "",
    pattern: options.pattern,
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();
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

  if (!options.silent && options.verbose) {
    $.notifyUserOfChange(oldPath, newName);
  }
}

export const __private__ = {
  _confirmChangeWithUser,
  _write,
};

export default { run };
