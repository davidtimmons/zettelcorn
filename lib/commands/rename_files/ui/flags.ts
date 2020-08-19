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
    .example('rename.files -r ./zettelkasten "{id}-{title}.md"')
    .example('rename.files --recursive ./zettelkasten "{id}-{title}.md"')
    .example('rename.files -rd ./zettelkasten "{id}-{title}.md"')
    .example('rename.files --recursive --dashed ./zettelkasten "{id}-{title}.md"')
    .action(
      async (
        path: string,
        pattern: string,
        options: Types.TRenameFilesOptions,
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
