import { CLITypes } from "../deps.ts";
import { Types } from "../mod.ts";

export function addInjectKeywordsCommand(
  options: CLITypes.TCLIInit,
  flags: CLITypes.TCLIFlags,
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
        options: Types.TInjectKeywordsOptions,
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
