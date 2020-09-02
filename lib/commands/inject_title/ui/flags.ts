/**
 * Provides menu descriptions for this command to the CLI interface.
 * @protected
 * @module commands/inject_title/ui/flags
 * @see module:commands/inject_title/mod
 */

import { CLITypes } from "../deps.ts";
import { Types } from "../mod.ts";

export function addInjectTitleCommand(
  options: CLITypes.TCLIInit,
  flags: CLITypes.TCLIFlags,
): void {
  const injectTitle = options.injectTitle;
  if (!injectTitle) return;

  flags
    .command(
      "inject.title <path>",
      'Inject the detected title into a "title" key inside the YAML frontmatter',
    )
    .option(
      "--skip",
      'Skip files that contain a "title" frontmatter key',
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
      "List all files where titles were injected",
    )
    .example("inject.title --recursive ./zettelkasten")
    .action(
      async (
        path: string,
        options: Types.TInjectTitleOptions,
      ): Promise<void> => {
        await injectTitle({
          directory: path,
          skip: Boolean(options.skip),
          recursive: Boolean(options.recursive),
          markdown: Boolean(options.markdown),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
