/**
 * Inject the detected ID into an "id" key inside the YAML frontmatter.
 * @protected
 * @implements {ICommandModule}
 * @module commands/inject_id/rename_files
 * @see module:commands/inject_id/mod
 */

import { TExitCodes, TStatusCodes } from "../mod.ts";
import { Utilities as $ } from "./deps.ts";
import type * as Types from "./types.ts";
import * as Status from "./ui/status.ts";

export async function run(
  options: Types.TInjectIdRunOptions,
): Types.TInjectIdRunResult {
  // Read all files while extending any found YAML frontmatter with an ID.
  let fileQueue: $.TReadResult[] = [];
  try {
    fileQueue = await $.buildFileQueue({
      ...options,
      getFileContent: true,
      requireMarkdown: options.markdown,
      yamlTransformation: _yamlTransformation.bind(null, options),
    });
  } catch (err) {
    Status.notifyUserOfExit({
      ...options,
      error: err,
      exitCode: TExitCodes.UNKNOWN_ERROR,
    });
    throw err;
  }

  if (!options.silent) {
    await _confirmChangeWithUser(options, fileQueue);
  }

  await $.writeQueuedFiles(_write, {
    ...options,
    startWorkMsg: `Injected files:`,
    endWorkMsg: `${fileQueue.length} files injected with a YAML ID.`,
  }, fileQueue);

  return Promise.resolve({ status: TStatusCodes.OK });
}

/**
 * Extend the YAML object extracted from the file with an ID found in the file contents.
 */
function _yamlTransformation(
  menuOptions: Types.TInjectIdRunOptions,
  transformOptions: $.TTransformOptions,
): object {
  const hasEmptyIdKey = $.isEmpty(transformOptions.fileYAML.id);
  if (menuOptions.skip && !hasEmptyIdKey) {
    return transformOptions.fileYAML;
  }

  const rawContent = $.removeFrontmatter(transformOptions.fileContent);
  const rawId = rawContent.match(menuOptions.regex)?.[0] ?? "";
  const newId = parseInt(rawId) || rawId;
  const foundNoId = $.isEmpty(newId);

  let id: string | number | null = newId;
  if (foundNoId && hasEmptyIdKey) {
    id = null;
  } else if (foundNoId) {
    id = transformOptions.fileYAML.id;
  }

  return {
    ...transformOptions.fileYAML,
    id,
  };
}

async function _confirmChangeWithUser(
  options: Types.TInjectIdRunOptions,
  fileQueue: $.TReadResult[],
): Promise<void> {
  // Find the first file example with a title in the YAML object.
  const firstExample = $.findFirstExample(fileQueue, (file) => {
    const maybeId = file.yaml.id;
    if (!$.isEmpty(maybeId)) {
      return true;
    } else {
      return false;
    }
  });

  // Confirm change before injecting titles into files.
  const noIdMatched = $.isEmpty(firstExample);
  if (noIdMatched) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.UNMATCHED_PATTERN,
    });
    Deno.exit();
  }

  const userResponse = await Status.confirmChange({
    fileName: firstExample?.fileName || "",
    id: firstExample?.yaml.id.toString(),
    willSkip: options.skip,
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();
}

async function _write(
  options: Types.TInjectIdWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const path = file.path;
  const content = $.prependFrontmatter(file.fileContent, file.yaml);

  await Deno.writeTextFile(path, content, { create: false });

  if (!options.silent && options.verbose) {
    $.notifyUserOfChange(path, file.yaml.id);
  }
}

export const __private__ = {
  _confirmChangeWithUser,
  _yamlTransformation,
  _write,
};

export default { run };
