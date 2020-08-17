import { CLITypes as T } from "../deps.ts";

/// TYPES ///

export type TInjectTitleOptions = T.TCLIStandardOptions;

/// LOGIC ///

export function addInjectTitleCommand(
  options: T.TCLIInit,
  flags: T.TCLIFlags,
): void {
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
        options: TInjectTitleOptions,
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
