import { FS, Path } from "./deps.ts";
import * as CT from "../types.ts";
import * as RFCT from "./types.ts";
import * as TokenExpression from "./parsers/token_expression.ts";

export default async function run(
  options: RFCT.TRenameFilesCommandOptions,
): Promise<RFCT.TRenameFilesCommandResult> {
  // TODO
  // path, pattern, recursive
  const parsedPattern = TokenExpression.generateInterpolatedString(
    "yaml",
    options.pattern,
  );
  const transform = Function("yaml", "return " + parsedPattern);

  const walkResults = await _walkFiles(options);
  const firstFileContent = _readFirstFile(walkResults);

  return { status: CT.TStatus.OK };
}

async function _walkFiles(
  options: RFCT.TRenameFilesCommandOptions,
): Promise<RFCT.TRenameFilesReadResult[]> {
  const walkDirectory = Deno.realPathSync(options.directory);
  const walkResults = [];

  for await (const entity of FS.walk(walkDirectory)) {
    const { path, name, isDirectory } = entity;

    if (isDirectory) continue;

    const thisPath = Deno.realPathSync(path);

    if (options.recursive || walkDirectory === Path.dirname(thisPath)) {
      walkResults.push({
        fileName: name,
        path: thisPath,
        status: CT.TStatus.OK,
        yaml: {},
      });
    }
  }

  return walkResults;
}

function _readFirstFile(walkResults: RFCT.TRenameFilesReadResult[]): string {
  if (walkResults.length === 0) return "";
  const contents = Deno.readTextFileSync(walkResults[0].path);
  return contents;
}

// walkFiles({ path: "./", recursive: false }).then((x) => console.dir(x));
// _readFirstFile([{
//   fileName: "test.md",
//   message: "",
//   path: "/home/bert/projects/zettelcorn/test/test_data/test.md",
//   status: 0,
//   yaml: {},
// }]);

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
  _readFirstFile,
  _walkFiles,
};
