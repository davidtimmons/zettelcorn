import * as CT from "../../types.ts";
import { CLITypes as T } from "../deps.ts";

/// TYPES ///

export type TInjectKeywordsOptions = T.TCLIStandardOptions & {
  u?: boolean;
  heuristic: boolean;
  g?: boolean;
  merge: boolean;
};

export type TInjectKeywordsRunOptions = CT.TRunOptions & TInjectKeywordsOptions;

export type TInjectKeywordsRunResult = CT.TRunResult;

export interface TInjectKeywordsRun {
  (options: TInjectKeywordsRunOptions): TInjectKeywordsRunResult;
}

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
      "Attempt to detect lines dedicated to listing topic tags",
    )
    .option(
      "-g, --merge",
      'Merge found topic tags into frontmatter "keywords" instead of overwriting them',
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
          merge: Boolean(options.merge),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
