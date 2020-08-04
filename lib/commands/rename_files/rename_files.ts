import { FS, Path, Utilities as $ } from "./deps.ts";
import * as CT from "../types.ts";
import * as RFCT from "./types.ts";
import * as TokenExpression from "./parsers/token_expression.ts";
import * as UI from "./ui/ui.ts";
import * as YAMLFrontmatter from "./parsers/yaml_frontmatter.ts";

export default async function run(
  options: RFCT.TRenameFilesCommandOptions,
): Promise<RFCT.TRenameFilesCommandResult> {
  // Build a queue of files to rename.
  const queue = await _buildFileQueue(options);

  // Confirm change before renaming all files.
  const parsedPattern = TokenExpression.generateInterpolatedString(
    "yaml",
    options.pattern,
  );
  const applyPattern = Function("yaml", "return " + parsedPattern);
  const hasFileWithYAML = Boolean(queue[0]);
  const newFileName = $.doOnlyIf(hasFileWithYAML, applyPattern)(queue[0].yaml);
  const userResponse = await UI.confirmChange({
    newFileName,
    oldFileName: queue[0].fileName,
    pattern: options.pattern,
  });

  // Process user response.
  const changeRejected = userResponse.match(/[yY]/) === null;
  if (changeRejected) Deno.exit();

  // TODO: if change accepted, then rename all the files

  return { status: CT.TStatus.OK };
}

async function _read(path: string): Promise<string> {
  if (path.length === 0) return "";
  const contents = await Deno.readTextFile(path);
  return contents;
}

async function _buildFileQueue(
  options: RFCT.TRenameFilesCommandOptions,
): Promise<RFCT.TRenameFilesReadResult[]> {
  const walkDirectory: string = Deno.realPathSync(options.directory);
  const walkResults: RFCT.TRenameFilesReadResult[] = [];

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
          status: CT.TStatus.OK,
          yaml: fileYAML,
        });
      }
    }
  }
  return walkResults;
}

// async function _write(
//   options: RenameFilesTypes.TRenameFilesWriteOptions,
// ): Promise<RenameFilesTypes.TRenameFilesWriteResult> {
//   const oldPath = Path.join.apply(null, [options.path, options.fileName]);
//   const newPath = Path.join.apply(
//     null,
//     [options.path, options.transform(options.yaml)],
//   );

//   const status = await Deno.rename(oldPath, newPath);
//   console.log(status); // undefined on success (error on failure?)

//   return { message: "", status: CommandsTypes.TCommandStatus.OK };
// }

export const __private__ = {
  _buildFileQueue,
  _read,
};
