/**
 * Provides menu descriptions for this command to the CLI interface.
 * @protected
 * @module commands/new_zettel/ui/flags
 * @see module:commands/new_zettel/mod
 */

import { CLITypes } from "../deps.ts";
import { Types } from "../mod.ts";

export function addNewZettelCommand(
  options: CLITypes.TCLIInit,
  flags: CLITypes.TCLIFlags,
): void {
  const newZettel = options.newZettel;
  if (!newZettel) return;

  flags
    .command(
      "new.zettel <directory>",
      "Create a new zettel file",
    )
    .option(
      "--total [n]",
      "Create [n] new zettel files",
      { default: 1 },
    )
    .option(
      "--default",
      "Ignore the local zettel template if it exists",
    )
    // .option(
    //   "--id [pattern]",
    //   "Pattern used to generate the zettel ID",
    //   { default: "%Y%m%d%H%M%S" }, // bash: date +"%Y%m%d%H%M%S""
    // )
    .option(
      "--silent",
      "Run command with no console output and automatic yes to prompts",
    )
    .option(
      "--verbose",
      "List all zettel files that were created",
    )
    .example("new.zettel ./zettelkasten")
    .example("new.zettel --verbose ./zettelkasten")
    .action(
      async (
        directory: string,
        options: Types.TNewZettelOptions,
      ): Promise<void> => {
        await newZettel({
          directory,
          total: options.total,
          default: Boolean(options.default),
          markdown: false,
          recursive: false,
          silent: Boolean(options.silent),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
