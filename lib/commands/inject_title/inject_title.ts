import * as CT from "../types.ts";
import { Utilities as $ } from "./deps.ts";
import { Flags, UI } from "./mod.ts";

/// TYPES ///

type TInjectTitleRunOptions = CT.TRunOptions & Flags.TInjectTitleOptions;

type TInjectTitleWriteOptions = TInjectTitleRunOptions;

/// LOGIC ///

export async function run(
  options: TInjectTitleRunOptions,
): Promise<CT.TRunResult> {
  // Read all files while extending any found YAML frontmatter with a title.
  let fileQueue: $.TReadResult[] = [];
  try {
    fileQueue = await $.buildFileQueue({
      ...options,
      getFileContent: true,
      requireMarkdown: options.markdown,
      yamlTransformation: _yamlTransformation,
    });
  } catch (err) {
    UI.notifyUserOfExit({ error: err });
    throw err;
  }

  // Find the first file example with a title in the YAML object.
  let firstExample = $.findFirstExample(fileQueue, (file) => {
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
    UI.notifyUserOfExit({ directory: options.directory });
    Deno.exit();
  }

  const userResponse = options.silent ? "Y" : await UI.confirmChange({
    fileName: firstExample?.fileName || "",
    title: firstExample?.yaml.title || "",
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();

  await _injectTitle(options, fileQueue);

  return Promise.resolve({ status: CT.TStatus.OK });
}

/**
 * Extend the YAML object extracted from the file with a Markdown title found in the file contents.
 */
function _yamlTransformation(options: $.TTransformationOptions): object {
  const newTitle = $.findTitle(options.fileContent);
  const foundNoTitle = newTitle.length <= 0;
  const hasNoTitleKey = $.isEmpty(options.fileYAML.title);

  let title = newTitle;
  if (foundNoTitle && hasNoTitleKey) {
    title = "";
  } else if (foundNoTitle) {
    title = options.fileYAML.title;
  }

  return {
    ...options.fileYAML,
    title,
  };
}

async function _injectTitle(
  options: TInjectTitleWriteOptions,
  fileQueue: $.TReadResult[],
): Promise<void> {
  if (options.verbose) {
    $.log("Injected files:", {
      padTop: true,
      padBottom: false,
      style: $.TUIStyles.BOLD,
    });
  }

  // Resolve all writes first so UI success message does not appear early.
  const promises = fileQueue.map((file) => {
    return _write(options, file);
  });

  await Promise
    .all(promises)
    .then(() => {
      if (options.silent) return;
      $.log(`${fileQueue.length} files injected with a YAML title.`, {
        padTop: true,
        padBottom: true,
        style: $.TUIStyles.BOLD,
      });
    });
}

async function _write(
  options: TInjectTitleWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const path = file.path;
  const content = $.prependFrontmatter(file.fileContent, file.yaml);

  await Deno.writeTextFile(path, content, { create: false });

  if (options.verbose) $.notifyUserOfChange(path, file.yaml.title);
}

export const __private__ = {
  _injectTitle,
  _yamlTransformation,
};

export default { run };