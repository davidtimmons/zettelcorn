import { CAC, IO } from "./deps.ts";

/// TYPES ///

export type TCLIInjectTitleOptions = TStandardOptions;

export type TCLIInjectKeywordsOptions = TStandardOptions & {
  u?: boolean;
  heuristic: boolean;
};

export type TCLIRenameFilesOptions = TStandardOptions & {
  d?: boolean;
  dashed: boolean;
};

type TCACObject = any;

interface TInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly injectKeywords?: Function;
  readonly injectTitle?: Function;
  readonly renameFiles?: Function;
}

interface TStandardOptions {
  r?: boolean;
  recursive: boolean;
  m?: boolean;
  markdown: boolean;
  b?: boolean;
  verbose: boolean;
}

/// LOGIC ///

export function init(options: TInit): void {
  const flags: TCACObject = CAC(options.appName);

  _mutateFlagsToAddInjectKeywords(options, flags);
  _mutateFlagsToAddInjectTitle(options, flags);
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
      'Inject topic tags into a "keywords" list inside the YAML frontmatter',
    )
    .option(
      "-u, --heuristic",
      "Attempt to detect all lines dedicated to listing topic tags",
    )
    .option(
      "-r, --recursive",
      "Run command on a directory and all its sub-directories",
    )
    .option(
      "-m, --markdown",
      "Only modify Markdown files by looking for the *.md extension",
    )
    .option(
      "-b, --verbose",
      "List all files where keywords were injected",
    )
    .example("inject.keywords -r ./zettelkasten")
    .example("inject.keywords --recursive ./zettelkasten")
    .example("inject.keywords -urb ./zettelkasten")
    .example("inject.keywords --heuristic --recursive --verbose ./zettelkasten")
    .action(
      async (
        path: string,
        options: TCLIInjectKeywordsOptions,
      ): Promise<void> => {
        await injectKeywords({
          directory: path,
          heuristic: Boolean(options.heuristic),
          recursive: Boolean(options.recursive),
          markdown: Boolean(options.markdown),
          verbose: Boolean(options.verbose),
        });
      },
    );
}

function _mutateFlagsToAddInjectTitle(options: TInit, flags: TCACObject) {
  const injectTitle = options.injectTitle;
  if (!injectTitle) return;

  flags
    .command(
      "inject.title <path>",
      'Inject the detected title into a "title" key inside the YAML frontmatter',
    )
    .option(
      "-r, --recursive",
      "Run command on a directory and all its sub-directories",
    )
    .option(
      "-m, --markdown",
      "Only modify Markdown files by looking for the *.md extension",
    )
    .option(
      "-b, --verbose",
      "List all files where titles were injected",
    )
    .example("inject.title -r ./zettelkasten")
    .example("inject.title --recursive ./zettelkasten")
    .action(
      async (
        path: string,
        options: TCLIInjectTitleOptions,
      ): Promise<void> => {
        await injectTitle({
          directory: path,
          recursive: Boolean(options.recursive),
          markdown: Boolean(options.markdown),
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
      "-m, --markdown",
      "Only modify Markdown files by looking for the *.md extension",
    )
    .option(
      "-b, --verbose",
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
          markdown: Boolean(options.markdown),
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
