/**
 * Provides menu descriptions for this command to the CLI interface.
 * @protected
 * @module commands/rename_files/ui/flags
 * @see module:commands/rename_files/mod
 */

import { CLITypes } from "../deps.ts";
import { Types } from "../mod.ts";

export function addRenameFilesCommand(
  options: CLITypes.TCLIInit,
  flags: CLITypes.TCLIFlags,
): void {
  const renameFiles = options.renameFiles;
  if (!renameFiles) return;

  flags
    .command(
      "rename.files <directory> <pattern>",
      "Rename files containing YAML frontmatter",
    )
    .option(
      "--dashed",
      "Substitute dashes for spaces in the file name",
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
    .example('rename.files --recursive ./zettelkasten "{id}-{title}.md"')
    .example(
      'rename.files --recursive --dashed ./zettelkasten "{id}-{title}.md"',
    )
    .action(
      async (
        directory: string,
        pattern: string,
        options: Types.TRenameFilesOptions,
      ): Promise<void> => {
        await renameFiles({
          directory,
          pattern,
          dashed: Boolean(options.dashed),
          markdown: Boolean(options.markdown),
          recursive: Boolean(options.recursive),
          silent: Boolean(options.silent),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
