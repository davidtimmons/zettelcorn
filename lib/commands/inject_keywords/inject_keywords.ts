/**
 * Inject topic tags into a "keywords" list inside the YAML frontmatter.
 * @protected
 * @implements {ICommandModule}
 * @module commands/inject_keywords/rename_files
 * @see module:commands/inject_keywords/mod
 */

import { TStatus } from "../types.ts";
import { Utilities as $ } from "./deps.ts";
import { Status, Types } from "./mod.ts";

export async function run(
  options: Types.TInjectKeywordsRunOptions,
): Types.TInjectKeywordsRunResult {
  // Read all files while extending any found YAML frontmatter with keywords.
  let fileQueue: $.TReadResult[] = [];
  try {
    fileQueue = await $.buildFileQueue({
      ...options,
      getFileContent: true,
      requireMarkdown: options.markdown,
      yamlTransformation: _yamlTransformation.bind(null, options),
    });
  } catch (err) {
    Status.notifyUserOfExit({ error: err });
    throw err;
  }

  // Find the first file example with keywords in the YAML object.
  let firstExample = $.findFirstExample(fileQueue, (file) => {
    const maybeKeywords = file.yaml.keywords;
    if (maybeKeywords?.length > 0) {
      return true;
    } else {
      return false;
    }
  });

  // Confirm change before injecting keywords into files.
  const noKeywordsFound = $.isEmpty(firstExample);
  if (noKeywordsFound) {
    Status.notifyUserOfExit({ directory: options.directory });
    Deno.exit();
  }

  const userResponse = options.silent ? "Y" : await Status.confirmChange({
    fileName: firstExample?.fileName || "",
    keywords: firstExample?.yaml.keywords.join(", ") || "",
    willMerge: options.merge,
    willSkip: options.skip,
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();

  await $.writeQueuedFiles(_write, {
    ...options,
    startWorkMsg: `Injected files:`,
    endWorkMsg: `${fileQueue.length} files injected with YAML keywords.`,
  }, fileQueue);

  return Promise.resolve({ status: TStatus.OK });
}

/**
 * Extend the YAML object extracted from the file with all keywords found in the file contents.
 * Throws an error when "keywords" exists in the frontmatter but is not a list.
 */
function _yamlTransformation(
  menuOptions: Types.TInjectKeywordsRunOptions,
  transformOptions: $.TTransformOptions,
): object {
  const hasEmptyKeywordsKey = $.isEmpty(transformOptions.fileYAML.keywords);
  if (menuOptions.skip && !hasEmptyKeywordsKey) {
    return transformOptions.fileYAML;
  }

  const rawContent = $.removeFrontmatter(transformOptions.fileContent);
  const newKeywords = $.findKeywords(menuOptions.heuristic, rawContent);
  const foundNoKeywords = newKeywords.length <= 0;
  const hasNoKeywordsKey = !("keywords" in transformOptions.fileYAML);

  let keywords = newKeywords;
  if (foundNoKeywords && hasNoKeywordsKey) {
    keywords = [];
  } else if (foundNoKeywords) {
    keywords = transformOptions.fileYAML.keywords;
  }

  if (!menuOptions.merge || hasEmptyKeywordsKey) {
    return {
      ...transformOptions.fileYAML,
      keywords,
    };
  } else {
    const kwSet = new Set(keywords);

    if (!Array.isArray(transformOptions.fileYAML.keywords)) {
      throw new TypeError(
        'The "keywords" key in the YAML frontmatter must be empty or contain a list.',
      );
    }

    for (let elem of transformOptions.fileYAML.keywords) {
      kwSet.add(elem);
    }

    return {
      ...transformOptions.fileYAML,
      keywords: [...kwSet],
    };
  }
}

async function _write(
  options: Types.TInjectKeywordsWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const path = file.path;
  const content = $.prependFrontmatter(file.fileContent, file.yaml);

  await Deno.writeTextFile(path, content, { create: false });

  if (options.verbose) $.notifyUserOfChange(path, file.yaml.keywords);
}

export const __private__ = {
  _write,
  _yamlTransformation,
};

export default { run };
