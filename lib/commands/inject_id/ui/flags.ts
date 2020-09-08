/**
 * Provides menu descriptions for this command to the CLI interface.
 * @protected
 * @module commands/inject_id/ui/flags
 * @see module:commands/inject_id/mod
 */

import { CLITypes } from "../deps.ts";
import { Types } from "../mod.ts";

export function addInjectIdCommand(
  options: CLITypes.TCLIInit,
  flags: CLITypes.TCLIFlags,
): void {
  const injectId = options.injectId;
  if (!injectId) return;

  flags
    .command(
      "inject.id <directory>",
      'Inject the detected ID into an "id" key inside the YAML frontmatter',
    )
    .option(
      "--regex [pattern]",
      "Detect the ID using a regular expression",
      {
        default: String.raw`\d{14}`,
      },
    )
    .option(
      "--skip",
      'Skip files that contain an "id" frontmatter key',
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
    .example(String.raw`inject.id --regex "\d{14}" ./zettelkasten`)
    .example(String.raw`inject.id --recursive --regex "\d{14}" ./zettelkasten`)
    .action(
      async (
        directory: string,
        options: Types.TInjectIdOptions,
      ): Promise<void> => {
        await injectId({
          directory,
          regex: new RegExp(options.regex),
          skip: Boolean(options.skip),
          markdown: Boolean(options.markdown),
          recursive: Boolean(options.recursive),
          silent: Boolean(options.silent),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
