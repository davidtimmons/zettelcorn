import { TStatus } from "../types.ts";
import { Utilities as $ } from "./deps.ts";
import { Types, UI } from "./mod.ts";

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

  await $.writeQueuedFiles(_write, {
    ...options,
    startWorkMsg: `Injected files:`,
    endWorkMsg: `${fileQueue.length} files injected with a YAML title.`,
  }, fileQueue);

  return Promise.resolve({ status: TStatus.OK });
}

/**
 * Extend the YAML object extracted from the file with a Markdown title found in the file contents.
 */
function _yamlTransformation(options: $.TTransformOptions): object {
  const rawContent = $.removeFrontmatter(options.fileContent);
  const newTitle = $.findTitle(rawContent);
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

async function _write(
  options: Types.TInjectTitleWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const path = file.path;
  const content = $.prependFrontmatter(file.fileContent, file.yaml);

  await Deno.writeTextFile(path, content, { create: false });

  if (options.verbose) $.notifyUserOfChange(path, file.yaml.title);
}

export const __private__ = {
  _write,
  _yamlTransformation,
};

export default { run };
