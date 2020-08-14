import { CLI, Path, Utilities as $ } from "../deps.ts";
import * as T from "../types.ts";
import * as Text from "./parsers/text.ts";
import * as TokenExp from "./parsers/token_expression.ts";
import * as UI from "./ui/ui.ts";

/// TYPES ///

type TRenameFilesRunOptions = T.TRunOptions & CLI.TCLIRenameFilesOptions & {
  readonly pattern: string;
};

interface TRenameFilesReadResult {
  readonly fileName: string;
  readonly path: string;
  readonly yaml: object;
}

type TRenameFilesWriteOptions = TRenameFilesRunOptions & {
  readonly applyPattern: TRenameFilesTransform | Function;
};

type TRenameFilesTransform = (yaml: { [key: string]: any }) => string;

/// LOGIC ///

export async function run(
  options: TRenameFilesRunOptions,
): Promise<T.TRunResult> {
  // The rename files feature is intended to work with YAML frontmatter.
  const hasToken = TokenExp.hasToken(options.pattern);
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
    .apply(
      Function(
        "yaml",
        "return " +
          TokenExp.generateInterpolatedString("yaml", options.pattern),
      ),
    )
    .applyIf(options.dashed, Text.dasherize)
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

  await _renameFiles({ ...options, applyPattern }, fileQueue);

  return { status: T.TStatus.OK };
}

async function _renameFiles(
  options: TRenameFilesWriteOptions,
  fileQueue: TRenameFilesReadResult[],
): Promise<void> {
  if (options.verbose) {
    $.log("Renamed files:", {
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
      $.log(`${fileQueue.length} files renamed.`, {
        padTop: true,
        padBottom: true,
        style: $.TUIStyles.BOLD,
      });
    });
}

async function _write(
  options: TRenameFilesWriteOptions,
  file: TRenameFilesReadResult,
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
  _renameFiles,
  _write,
};

export default { run };
