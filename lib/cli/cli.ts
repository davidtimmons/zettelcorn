import { CAC, IO } from "./deps.ts";

/// TYPES ///

type TCACObject = any;

interface TInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly injectKeywords?: Function;
  readonly renameFiles?: Function;
}

export interface TCLIInjectKeywordsOptions {
  r?: boolean;
  recursive: boolean;
  v?: boolean;
  verbose: boolean;
}

export interface TCLIRenameFilesOptions {
  r?: boolean;
  recursive: boolean;
  d?: boolean;
  dashed: boolean;
  v?: boolean;
  verbose: boolean;
}

/// LOGIC ///

export function init(options: TInit): void {
  const flags: TCACObject = CAC(options.appName);

  _mutateFlagsToAddInjectKeywords(options, flags);
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

function _mutateFlagsToAddInjectKeywords(options: TInit, flags: TCACObject) {
  const injectKeywords = options.injectKeywords;
  if (!injectKeywords) return;

  flags
    .command(
      "inject.keywords <path>",
      'Inject topic tags found in the text as a "keywords" list in the YAML frontmatter',
    )
    .option(
      "-r, --recursive",
      "Run command on a directory and all its sub-directories",
    )
    .option(
      "-v, --verbose",
      "List all files where keywords were injected",
    )
    .example("inject.keywords -r ./zettelkasten")
    .example("inject.keywords --recursive ./zettelkasten")
    .example("inject.keywords -rv ./zettelkasten")
    .example("inject.keywords --recursive --verbose ./zettelkasten")
    .action(
      async (
        path: string,
        options: TCLIInjectKeywordsOptions,
      ): Promise<void> => {
        await injectKeywords({
          directory: path,
          recursive: Boolean(options.recursive),
          verbose: Boolean(options.verbose),
        });
      },
    );
}

function _mutateFlagsToAddRenameFiles(options: TInit, flags: TCACObject) {
  const renameFiles = options.renameFiles;
  if (!renameFiles) return;

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
    .option(
      "-v, --verbose",
      "List all paths that changed along with each new value",
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
          verbose: Boolean(options.verbose),
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
  _mutateFlagsToAddInjectKeywords,
  _mutateFlagsToAddRenameFiles,
  _tryParse,
};

export default init;
