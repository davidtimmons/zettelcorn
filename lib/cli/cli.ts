import { CAC, IO } from "./deps.ts";
import { CommandsTypes } from "./deps.ts";

/// TYPES ///

type TCACObject = any;

interface TCLIInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly renameFiles: Function;
}

export interface TCLIRenameFilesOptions {
  r?: boolean;
  recursive: boolean;
  d?: boolean;
  dashed: boolean;
}

/// LOGIC ///

export function init(options: TCLIInit): void {
  const flags: TCACObject = CAC(options.appName);

  _mutateFlagsToAddRenameFiles(options, flags);

  flags.help();
  flags.version(options.appVersion);

  if (Deno.args.length > 0) {
    _tryParse(flags);
  } else {
    flags.outputHelp();
  }
}

export async function sendToUser(text: string): Promise<string> {
  console.log(text);
  // Listen to stdin for a new line
  for await (const line of IO.readLines(Deno.stdin)) {
    return line;
  }
  return "";
}

function _mutateFlagsToAddRenameFiles(options: TCLIInit, flags: TCACObject) {
  const renameFiles = options.renameFiles;

  flags
    .command(
      "rename.files <path> <pattern>",
      "Rename files containing YAML frontmatter",
    )
    .option(
      "-d, --dashed",
      "Substitute dashes for spaces in the file name",
    )
    .option(
      "-r, --recursive",
      "Run command on a directory and all its sub-directories",
    )
    .example("rename.files -r ./zettelkasten {id}-{title}.md")
    .example("rename.files --recursive ./zettelkasten {id}-{title}.md")
    .example("rename.files -rd ./zettelkasten {id}-{title}.md")
    .example("rename.files --recursive --dashed ./zettelkasten {id}-{title}.md")
    .action(
      async (
        path: string,
        pattern: string,
        options: TCLIRenameFilesOptions,
      ): Promise<void> => {
        await renameFiles({
          pattern,
          directory: path,
          dashed: Boolean(options.dashed),
          recursive: Boolean(options.recursive),
        });
      },
    );
}

function _tryParse(flags: TCACObject): void {
  try {
    flags.parse();
  } catch (err) {
    if (err.name === "CACError") {
      console.error([
        `error: ${err.message}`,
        "",
        "For more information, try --help",
      ].join("\r\n"));
    } else {
      throw err;
    }
  }
}

export const __private__ = {
  _mutateFlagsToAddRenameFiles,
  _tryParse,
};

export default init;
