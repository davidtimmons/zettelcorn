import { FS, Path } from "./deps.ts";
import * as CommandsTypes from "../commands_types.ts";
import * as RenameFilesTypes from "./rename_files_types.ts";
import * as TokenExpression from "./parsers/token_expression.ts";

export default async function run(
  options: RenameFilesTypes.TRenameFilesCommandOptions,
): Promise<RenameFilesTypes.TRenameFilesCommandResult> {
  // TODO
  // path, pattern, recursive
  const parsedPattern = TokenExpression.generateInterpolatedString(
    "yaml",
    options.pattern,
  );
  const transform = Function("yaml", "return " + parsedPattern);

  const walkResults = await _walkFiles(options);

  return { message: "", status: CommandsTypes.TCommandStatus.OK };
}

async function _walkFiles(
  options: RenameFilesTypes.TRenameFilesCommandOptions,
): Promise<RenameFilesTypes.TRenameFilesReadResult[]> {
  const walkDirectory = Deno.realPathSync(options.path);
  const walkResults = [];

  for await (const entity of FS.walk(walkDirectory)) {
    const { path, name, isDirectory } = entity;

    if (isDirectory) continue;

    const thisPath = Deno.realPathSync(path);

    if (options.recursive || walkDirectory === Path.dirname(thisPath)) {
      walkResults.push({
        fileName: name,
        message: "",
        path: thisPath,
        status: CommandsTypes.TCommandStatus.OK,
        yaml: {},
      });
    }
  }
  return walkResults;
}

async function _readFirst(
  walkResults: RenameFilesTypes.TRenameFilesReadResult[],
) {
  const firstResult = walkResults[0];
}

// walkFiles({ path: "./", recursive: false }).then((x) => console.dir(x));

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

const __private__ = {
  _readFirst,
  _walkFiles,
};

export {
  __private__,
};
