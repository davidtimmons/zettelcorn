import { TStatus } from "../types.ts";
import { Utilities as $ } from "./deps.ts";
import { Types, UI } from "./mod.ts";

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
      yamlTransformation: _yamlTransformation.bind(null, options.regex),
    });
  } catch (err) {
    UI.notifyUserOfExit({ error: err });
    throw err;
  }

  // Find the first file example with a title in the YAML object.
  let firstExample = $.findFirstExample(fileQueue, (file) => {
    const maybeId = file.yaml.id;
    if (!$.isEmpty(maybeId)) {
      return true;
    } else {
      return false;
    }
  });

  // Confirm change before injecting titles into files.
  const noIdFound = $.isEmpty(firstExample);
  if (noIdFound) {
    UI.notifyUserOfExit({ directory: options.directory });
    Deno.exit();
  }

  const userResponse = options.silent ? "Y" : await UI.confirmChange({
    fileName: firstExample?.fileName || "",
    id: firstExample?.yaml.id.toString(),
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();

  await $.writeQueuedFiles(_write, {
    ...options,
    startWorkMsg: `Injected files:`,
    endWorkMsg: `${fileQueue.length} files injected with a YAML ID.`,
  }, fileQueue);

  return Promise.resolve({ status: TStatus.OK });
}

/**
 * Extend the YAML object extracted from the file with an ID found in the file contents.
 */
function _yamlTransformation(
  regex: RegExp,
  options: $.TTransformOptions,
): object {
  const rawContent = $.removeFrontmatter(options.fileContent);
  const rawId = rawContent.match(regex)?.[0] ?? "";
  const newId = parseInt(rawId) || rawId;

  const foundNoId = $.isEmpty(newId);
  const hasNoIdKey = $.isEmpty(options.fileYAML.id);

  let id: string | number | null = newId;
  if (foundNoId && hasNoIdKey) {
    id = null;
  } else if (foundNoId) {
    id = options.fileYAML.id;
  }

  return {
    ...options.fileYAML,
    id,
  };
}

async function _write(
  options: Types.TInjectIdWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const path = file.path;
  const content = $.prependFrontmatter(file.fileContent, file.yaml);

  await Deno.writeTextFile(path, content, { create: false });

  if (options.verbose) $.notifyUserOfChange(path, file.yaml.id);
}

export const __private__ = {
  _yamlTransformation,
  _write,
};

export default { run };
