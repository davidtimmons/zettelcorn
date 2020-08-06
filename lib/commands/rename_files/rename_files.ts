import { CLI, FS, Path, Utilities as $ } from "./deps.ts";
import * as T from "../types.ts";
import * as Text from "./parsers/text.ts";
import * as TokenExpression from "./parsers/token_expression.ts";
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

type TRenameFilesApplyPattern = TRenameFilesTransform | Function;

type TRenameFilesTransform = (yaml: TRenameFilesYAML) => string;

type TRenameFilesYAML = { [key: string]: any };

/// LOGIC ///

export async function run(
  options: TRenameFilesRunOptions,
): Promise<T.TRunResult> {
  // TODO: Check if the pattern has tokens. If not, notify user and exit.

  // Build a queue of files to rename.
  const fileQueue = await _buildFileQueue(options);
  const applyPattern = $.composeFunctions()
    .apply(
      Function(
        "yaml",
        "return " +
          TokenExpression.generateInterpolatedString("yaml", options.pattern),
      ),
    )
    .applyIf(options.dashed, Text.dasherize)
    .compose;

  // Confirm change before renaming all files.
  const previewFileName = $.composeFunctions(fileQueue[0].yaml || {})
    .apply(applyPattern)
    .result;

  const noFrontmatterFound = !Boolean(fileQueue[0]);
  if (noFrontmatterFound) {
    UI.notifyUserOfExit({ directory: options.directory });
    Deno.exit();
  }

  const userResponse = await UI.confirmChange({
    newFileName: previewFileName,
    oldFileName: fileQueue[0].fileName,
    pattern: options.pattern,
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();
  await _renameFiles(applyPattern, fileQueue);

  // TODO: Report how many files changed.

  return { status: T.TStatus.OK };
}

async function _buildFileQueue(
  options: TRenameFilesRunOptions,
): Promise<TRenameFilesReadResult[]> {
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
          yaml: fileYAML,
        });
      }
    }
  }
  return walkResults;
}

async function _renameFiles(
  applyPattern: TRenameFilesApplyPattern,
  files: TRenameFilesReadResult[],
): Promise<void> {
  files.forEach(async (file) => {
    await _write(applyPattern, file);
  });
}

async function _read(path: string): Promise<string> {
  if (path.length === 0) return "";
  const contents = await Deno.readTextFile(path);
  return contents;
}

async function _write(
  applyPattern: TRenameFilesApplyPattern,
  options: TRenameFilesReadResult,
): Promise<void> {
  const basePath = Path.dirname(options.path);
  const newName = applyPattern(options.yaml);
  const newPath = Path.join.apply(null, [basePath, newName]);
  const oldPath = options.path;

  // TODO: Uncomment rename function, remove empty promise/logs.
  // await Deno.rename(oldPath, newPath);
  console.log(oldPath);
  console.log(newPath);
  console.log("");
  await Promise.resolve();
}

export const __private__ = {
  _buildFileQueue,
  _read,
  _renameFiles,
  _write,
};

export default {
  run,
};

// TEMP: Hide this before running tests to prevent resource leaks.
// run(
//   { directory: "./", recursive: true, dash: true, pattern: "{id}-{title}.md" },
// );
