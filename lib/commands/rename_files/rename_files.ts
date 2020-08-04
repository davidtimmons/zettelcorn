import { FS, Path, Utilities as $ } from "./deps.ts";
import * as CT from "../types.ts";
import * as RFCT from "./types.ts";
import * as TokenExpression from "./parsers/token_expression.ts";
import * as YAMLFrontmatter from "./parsers/yaml_frontmatter.ts";

export default async function run(
  options: RFCT.TRenameFilesCommandOptions,
): Promise<RFCT.TRenameFilesCommandResult> {
  // Build a queue of files to rename.
  const queue = await _buildFileQueue(options);
  const parsedPattern = TokenExpression.generateInterpolatedString(
    "yaml",
    options.pattern,
  );
  const transform = Function("yaml", "return " + parsedPattern);

  // Confirm before renaming all files.
  const hasFile = Boolean(queue[0]);
  const firstTitle = $.doOnlyIf(hasFile, transform)(queue[0].yaml);

  // TODO

  return { status: CT.TStatus.OK };
}

export async function read(path: string): Promise<string> {
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
      const fileYAML = YAMLFrontmatter.parseFrontmatter(await read(thisPath));
      const hasYAML = Object.keys(fileYAML).length > 0;
      $.doOnlyIf(hasYAML, Array.prototype.push.bind(walkResults))({
        fileName: name,
        path: thisPath,
        status: CT.TStatus.OK,
        yaml: fileYAML,
      });
    }
  }
  return walkResults;
}

// _walkFiles({ directory: "./", recursive: true, pattern: "" }).then((x) => console.dir(x));

// async function write(
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

// write({
//   path: '/home/bert/projects/zettelcorn/lib/parser',
//   fileName: 'tmp',
//   yaml: {
//     id: 123,
//     title: 'pasta',
//   },
//   transform: (yaml: object) => `${yaml.id}-${yaml.title}-tmp.xyz`,
// })

export const __private__ = {
  _buildFileQueue,
};
