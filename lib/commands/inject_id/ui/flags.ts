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
      "inject.id <path>",
      'Inject the detected ID into an "id" key inside the YAML frontmatter',
    )
    .option(
      "-x, --regex [pattern]",
      "Detect the ID using a regular expression",
      {
        default: String.raw`\d{14}`,
      },
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
      "List all files where IDs were injected",
    )
    .example(String.raw`inject.id -x "\d{14}" ./zettelkasten`)
    .example(String.raw`inject.id -regex "\d{14}" ./zettelkasten`)
    .example(String.raw`inject.id -r -x "\d{14}" ./zettelkasten`)
    .example(String.raw`inject.id --recursive --regex "\d{14}" ./zettelkasten`)
    .action(
      async (
        path: string,
        options: Types.TInjectIdOptions,
      ): Promise<void> => {
        await injectId({
          directory: path,
          regex: new RegExp(options.regex),
          recursive: Boolean(options.recursive),
          markdown: Boolean(options.markdown),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
