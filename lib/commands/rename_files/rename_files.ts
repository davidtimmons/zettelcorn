import { CLI, Path, Utilities as $ } from "../deps.ts";
import * as T from "../types.ts";
import * as Text from "./parsers/text.ts";
import * as TokenExp from "./parsers/token_expression.ts";
import * as UI from "./ui/ui.ts";

/// TYPES ///

interface TRenameFilesRunOptions
  extends T.TRunOptions, CLI.TCLIRenameFilesOptions {
  readonly directory: string;
  readonly pattern: string;
  readonly silent?: boolean;
}

interface TRenameFilesReadResult {
  readonly fileName: string;
  readonly path: string;
  readonly yaml: object;
}

interface TRenameFilesWriteOptions extends TRenameFilesRunOptions {
  readonly applyPattern: TRenameFilesApplyPattern;
}

type TRenameFilesApplyPattern = TRenameFilesTransform | Function;

type TRenameFilesTransform = (yaml: TRenameFilesYAML) => string;

type TRenameFilesYAML = { [key: string]: any };

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
      requireYaml: true,
      yamlTransformation: $.proxyPrintOnAccess,
    });
  } catch (err) {
    UI.notifyUserOfExit({ error: err });
    throw err;
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

  // Confirm change before renaming all files.
  const noFrontmatterFound = !Boolean(fileQueue[0]);
  if (noFrontmatterFound) {
    UI.notifyUserOfExit({ directory: options.directory });
    Deno.exit();
  }

  const previewFileName = $.composeFunctions(fileQueue[0]?.yaml || {})
    .apply(applyPattern)
    .result;

  const userResponse = options.silent ? "Y" : await UI.confirmChange({
    newFileName: previewFileName,
    oldFileName: fileQueue[0].fileName,
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
    UI.log("Renamed files:", {
      padTop: true,
      padBottom: false,
      style: UI.TUIStyles.BOLD,
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
      UI.log(`${fileQueue.length} files renamed.`, {
        padTop: true,
        padBottom: true,
        style: UI.TUIStyles.BOLD,
      });
    });
}

async function _write(
  options: TRenameFilesWriteOptions,
  fileQueue: TRenameFilesReadResult,
): Promise<void> {
  const basePath = Path.dirname(fileQueue.path);
  const newName = options.applyPattern(fileQueue.yaml);
  const newPath = Path.join.apply(null, [basePath, newName]);
  const oldPath = fileQueue.path;

  // Overwrites files on path collision rather than failing.
  await Deno.rename(oldPath, newPath);

  if (options.verbose) UI.notifyUserOfChange(oldPath, newPath);
}

export const __private__ = {
  _renameFiles,
  _write,
};

export default { run };
