import * as CT from "../types.ts";
import { Utilities as $ } from "./deps.ts";
import { Flags, UI } from "./mod.ts";

/// TYPES ///

type TInjectKeywordsRunOptions = CT.TRunOptions & Flags.TInjectKeywordsOptions;

type TInjectKeywordsWriteOptions = TInjectKeywordsRunOptions;

/// LOGIC ///

export async function run(
  options: TInjectKeywordsRunOptions,
): Promise<CT.TRunResult> {
  // Read all files while extending any found YAML frontmatter with keywords.
  let fileQueue: $.TReadResult[] = [];
  try {
    fileQueue = await $.buildFileQueue({
      ...options,
      getFileContent: true,
      requireMarkdown: options.markdown,
      requireMeta: true,
      metaTransformation: _metaTransformation.bind(null, options.heuristic),
      yamlTransformation: _yamlTransformation.bind(null, options.heuristic),
    });
  } catch (err) {
    UI.notifyUserOfExit({ error: err });
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
    UI.notifyUserOfExit({ directory: options.directory });
    Deno.exit();
  }

  const userResponse = options.silent ? "Y" : await UI.confirmChange({
    fileName: firstExample?.fileName || "",
    keywords: firstExample?.yaml.keywords.join(", ") || "",
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();

  await _injectKeywords(options, fileQueue);

  return Promise.resolve({ status: CT.TStatus.OK });
}

/**
 * Use one of two different approaches to detect topic tags in a document. Either look for
 * rows that appear to be dedicated to listing topic tags, or simply find everything in a
 * document that appears to be a topic tag.
 */
function _metaTransformation(
  useHeuristic: boolean,
  options: $.TTransformationOptions,
): string[] {
  return useHeuristic
    ? $.findHeuristicTags(options.fileContent)
    : $.findAllTags(options.fileContent);
}

/**
 * Extend the YAML object extracted from the file with all keywords found in the file contents.
 * Throws an error when "keywords" exists in the frontmatter but is not a list.
 */
function _yamlTransformation(
  useHeuristic: boolean,
  options: $.TTransformationOptions,
): object {
  const newKeywords = $.findKeywords(useHeuristic, options.fileContent);
  const foundNoKeywords = newKeywords.length <= 0;
  const hasNoKeywordsKey = $.isEmpty(options.fileYAML.keywords);

  let keywords = newKeywords;
  if (foundNoKeywords && hasNoKeywordsKey) {
    keywords = [];
  } else if (foundNoKeywords) {
    return options.fileYAML;
  }

  if ($.isEmpty(options.fileYAML.keywords)) {
    return {
      ...options.fileYAML,
      keywords,
    };
  } else {
    const kwSet = new Set(keywords);

    if (!Array.isArray(options.fileYAML.keywords)) {
      throw new TypeError(
        'The "keywords" key in the YAML frontmatter must be empty or contain a list.',
      );
    }

    for (let elem of options.fileYAML.keywords) {
      kwSet.add(elem);
    }

    return {
      ...options.fileYAML,
      keywords: [...kwSet],
    };
  }
}

async function _injectKeywords(
  options: TInjectKeywordsWriteOptions,
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
      $.log(`${fileQueue.length} files injected with YAML keywords.`, {
        padTop: true,
        padBottom: true,
        style: $.TUIStyles.BOLD,
      });
    });
}

async function _write(
  options: TInjectKeywordsWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const path = file.path;
  const content = $.prependFrontmatter(file.fileContent, file.yaml);

  await Deno.writeTextFile(path, content, { create: false });

  if (options.verbose) $.notifyUserOfChange(path, file.yaml.keywords);
}

export const __private__ = {
  _injectKeywords,
  _metaTransformation,
  _yamlTransformation,
};

export default { run };
