/**
 * Provides menu descriptions for this command to the CLI interface.
 * @protected
 * @module commands/init/ui/flags
 * @see module:commands/init/mod
 */

import { CLITypes } from "../deps.ts";
import { Types } from "../mod.ts";

export function addInitCommand(
  options: CLITypes.TCLIInit,
  flags: CLITypes.TCLIFlags,
): void {
  const init = options.init;
  if (!init) return;

  flags
    .command(
      "init [directory]",
      "Initializes a Zettelcorn project directory with configuration files",
    )
    .option(
      "--force",
      "Overwrite any existing Zettelcorn configuration files with default values",
    )
    .option(
      "--silent",
      "Run command with no console output and automatic yes to prompts",
    )
    .option(
      "--verbose",
      "List all configuration files that were created",
    )
    .example("init --silent")
    .example('init --verbose "./zettelkasten"')
    .action(
      async (
        directory: string,
        options: Types.TInitOptions,
      ): Promise<void> => {
        await init({
          directory: directory || Deno.cwd(),
          force: Boolean(options.force),
          markdown: false,
          recursive: false,
          silent: Boolean(options.silent),
          verbose: Boolean(options.verbose),
        });
      },
    );
}
