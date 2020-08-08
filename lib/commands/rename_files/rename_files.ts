import { CLI, FS, Path, Utilities as $ } from "./deps.ts";
import * as T from "../types.ts";
import * as Text from "./parsers/text.ts";
import * as TokenExp from "./parsers/token_expression.ts";
import * as YAMLFrontmatter from "./parsers/yaml_frontmatter.ts";
import * as UI from "./ui/ui.ts";

/// TYPES ///

interface TRenameFilesRunOptions
  extends T.TRunOptions, CLI.TCLIRenameFilesOptions {
  readonly directory: string;
  readonly pattern: string;
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
  let fileQueue: TRenameFilesReadResult[] = [];
  try {
    fileQueue = await _buildFileFrontmatterQueue(options);
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

  const userResponse = await UI.confirmChange({
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

async function _buildFileFrontmatterQueue(
  options: TRenameFilesRunOptions,
): Promise<TRenameFilesReadResult[]> {
  // TODO: Use a generator to avoid walking all files until user confirms intent.
  const walkDirectory: string = Deno.realPathSync(options.directory);
  const walkResults: TRenameFilesReadResult[] = [];

  for await (const entity of FS.walk(walkDirectory)) {
    const { path, name, isDirectory } = entity;

    if (isDirectory) continue;
    const thisPath = Deno.realPathSync(path);
    const inStartingDirectory = walkDirectory === Path.dirname(thisPath);

    if (options.recursive || inStartingDirectory) {
      const fileYAML = YAMLFrontmatter.parseFrontmatter(await _read(thisPath));
      const hasYAML = Object.keys(fileYAML).length > 0;

      if (hasYAML) {
        walkResults.push({
          fileName: name,
          path: thisPath,
          yaml: YAMLFrontmatter.proxyPrintOnAccess(fileYAML),
        });
      }
    }
  }
  return walkResults;
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
  const promises = fileQueue.map(async (file) => {
    return await _write(options, file);
  });

  Promise
    .all(promises)
    .then(() => {
      UI.log(`${fileQueue.length} files renamed.`, {
        padTop: true,
        padBottom: true,
        style: UI.TUIStyles.BOLD,
      });
    });
}

async function _read(path: string): Promise<string> {
  if (path.length === 0) return "";
  const contents = await Deno.readTextFile(path);
  return contents;
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
  _buildFileFrontmatterQueue,
  _read,
  _renameFiles,
  _write,
};

export default { run };
