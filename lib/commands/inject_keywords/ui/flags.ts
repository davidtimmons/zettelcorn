import { CLITypes as T } from "../deps.ts";

/// TYPES ///

export type TInjectKeywordsOptions = T.TCLIStandardOptions & {
  u?: boolean;
  heuristic: boolean;
};

/// LOGIC ///

export function addInjectKeywordsCommand(
  options: T.TCLIInit,
  flags: T.TCLIFlags,
): void {
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
        options: TInjectKeywordsOptions,
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
