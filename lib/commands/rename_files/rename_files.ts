import { TStatus } from "../types.ts";
import { Path, Utilities as $ } from "./deps.ts";
import { Flags, UI } from "./mod.ts";

/// TYPES ///

type TRenameFilesWriteOptions = Flags.TRenameFilesRunOptions & {
  readonly applyPattern: TRenameFilesTransform | Function;
};

type TRenameFilesTransform = (yaml: { [key: string]: any }) => string;

/// LOGIC ///

export async function run(
  options: Flags.TRenameFilesRunOptions,
): Flags.TRenameFilesRunResult {
  // The rename files feature is intended to work with YAML frontmatter.
  const hasToken = $.hasTokenExp(options.pattern);
  if (!hasToken) {
    UI.notifyUserOfExit({ pattern: options.pattern });
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
    UI.notifyUserOfExit({ error: err });
    throw err;
  }

  // Confirm change before renaming all files.
  const noFrontmatterFound = $.isEmpty(fileQueue);
  if (noFrontmatterFound) {
    UI.notifyUserOfExit({ directory: options.directory });
    Deno.exit();
  }

  const applyPattern = $.composeFunctions()
    .apply($.generateGetterFromTokenExp(options.pattern))
    .applyIf(options.dashed, $.dasherize)
    .compose;

  const firstExample = fileQueue[0];
  const previewFileName = applyPattern(firstExample.yaml || {});
  const userResponse = options.silent ? "Y" : await UI.confirmChange({
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
  options: TRenameFilesWriteOptions,
  file: $.TReadResult,
): Promise<void> {
  const basePath = Path.dirname(file.path);
  const newName = options.applyPattern(file.yaml);
  const newPath = Path.join.apply(null, [basePath, newName]);
  const oldPath = file.path;

  // Overwrites files on path collision rather than failing.
  await Deno.rename(oldPath, newPath);

  if (options.verbose) $.notifyUserOfChange(oldPath, newPath);
}

export const __private__ = {
  _write,
};

export default { run };
