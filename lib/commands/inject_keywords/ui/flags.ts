/**
 * Provides menu descriptions for this command to the CLI interface.
 * @protected
 * @module commands/inject_keywords/ui/flags
 * @see module:commands/inject_keywords/mod
 */

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
      "--heuristic",
      "Attempt to detect lines dedicated to listing topic tags",
    )
    .option(
      "--merge",
      'Merge found topic tags into frontmatter "keywords" instead of overwriting them',
    )
    .option(
      "--skip",
      'Skip files that contain a "keywords" frontmatter key',
    )
    .option(
      "--recursive",
      "Run command on a directory and all its sub-directories",
    )
    .option(
      "--markdown",
      "Only modify Markdown files by looking for the *.md extension",
    )
    .option(
      "--verbose",
      "List all files where keywords were injected",
    )
    .example("inject.keywords --recursive ./zettelkasten")
    .example("inject.keywords --heuristic --recursive --verbose ./zettelkasten")
    .action(
      async (
        path: string,
        options: Types.TInjectKeywordsOptions,
      ): Promise<void> => {
        await injectKeywords({
          directory: path,
          heuristic: Boolean(options.heuristic),
          skip: Boolean(options.skip),
          recursive: Boolean(options.recursive),
          markdown: Boolean(options.markdown),
          merge: Boolean(options.merge),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
