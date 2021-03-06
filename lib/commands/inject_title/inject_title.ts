/**
 * Inject the detected title into a "title" key inside the YAML frontmatter.
 * @protected
 * @implements {ICommandModule}
 * @module commands/inject_title/inject_title
 * @see module:commands/inject_title/mod
 */

import { TExitCodes, TStatusCodes } from "../mod.ts";
import { Utilities as $ } from "./deps.ts";
import type * as Types from "./types.ts";
import * as Status from "./ui/status.ts";

export async function run(
  options: Types.TInjectTitleRunOptions,
): Types.TInjectTitleRunResult {
  // Read all files while extending any found YAML frontmatter with a title.
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

  const writeResult = await $.writeQueuedFiles(_write, {
    ...options,
    startWorkMsg: `Injected files:`,
    endWorkMsg: `${fileQueue.length} files injected with a YAML title.`,
  }, fileQueue);

  let status: TStatusCodes;
  if (writeResult.status === $.TWriteStatusCodes.OK) {
    status = TStatusCodes.OK;
  } else {
    status = TStatusCodes.ERROR;
  }

  return { status };
}

/**
 * Extend the YAML object extracted from the file with a Markdown title found in the file contents.
 */
function _yamlTransformation(
  menuOptions: Types.TInjectTitleRunOptions,
  transformOptions: $.TTransformOptions,
): object {
  const hasEmptyTitleKey = $.isEmpty(transformOptions.fileYAML.title);
  if (menuOptions.skip && !hasEmptyTitleKey) {
    return transformOptions.fileYAML;
  }

  const rawContent = $.removeFrontmatter(transformOptions.fileContent);
  const newTitle = $.findTitle(rawContent);
  const foundNoTitle = newTitle.length <= 0;

  let title = newTitle;
  if (foundNoTitle && hasEmptyTitleKey) {
    title = "";
  } else if (foundNoTitle) {
    title = transformOptions.fileYAML.title;
  }

  return {
    ...transformOptions.fileYAML,
    title,
  };
}

async function _confirmChangeWithUser(
  options: Types.TInjectTitleRunOptions,
  fileQueue: $.TReadResult[],
): Promise<void> {
  // Find the first file example with a title in the YAML object.
  const firstExample = $.findFirstExample(fileQueue, (file) => {
    const maybeTitle = file.yaml.title;
    if (maybeTitle?.length > 0) {
      return true;
    } else {
      return false;
    }
  });

  // Confirm change before injecting titles into files.
  const noTitleFound = $.isEmpty(firstExample);
  if (noTitleFound) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.NO_TITLE_FOUND,
    });
    Deno.exit();
  }

  const userResponse = await Status.confirmChange({
    fileName: firstExample?.fileName || "",
    title: firstExample?.yaml.title || "",
    willSkip: options.skip,
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();
}

async function _write(
  options: Types.TInjectTitleWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const path = file.path;
  const content = $.prependFrontmatter(file.fileContent, file.yaml);

  await Deno.writeTextFile(path, content, { create: false });

  if (!options.silent && options.verbose) {
    $.notifyUserOfChange(path, file.yaml.title);
  }
}

export const __private__ = {
  _confirmChangeWithUser,
  _write,
  _yamlTransformation,
};

export default { run };
