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
      "inject.title <directory>",
      'Inject the detected title into a "title" key inside the YAML frontmatter',
    )
    .option(
      "--skip",
      'Skip files that contain a "title" frontmatter key',
    )
    .option(
      "--markdown",
      "Only modify Markdown files by looking for the *.md extension",
    )
    .option(
      "--recursive",
      "Run command on a directory and all its sub-directories",
    )
    .option(
      "--silent",
      "Run command with no console output and automatic yes to prompts",
    )
    .option(
      "--verbose",
      "List all files where IDs were injected",
    )
    .example("inject.title --recursive ./zettelkasten")
    .action(
      async (
        directory: string,
        options: Types.TInjectTitleOptions,
      ): Promise<void> => {
        await injectTitle({
          directory,
          skip: Boolean(options.skip),
          markdown: Boolean(options.markdown),
          recursive: Boolean(options.recursive),
          silent: Boolean(options.silent),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
