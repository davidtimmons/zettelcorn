/**
 * Creates the CLI menu displayed to the user. Each command provides its own menu description.
 * @protected
 * @module cli/cli
 * @see module:cli/mod
 * @see module:zettelcorn
 * @see {@link https://github.com/cacjs/cac|Command And Conquer}
 */

import {
  CAC,
  InitFlags,
  InjectIdFlags,
  InjectKeywordsFlags,
  InjectTitleFlags,
  RenameFilesFlags,
} from "./deps.ts";
import * as T from "./types.ts";

export function init(options: T.TCLIInit): void {
  const flags: T.TCLIFlags = CAC(options.appName);

  InitFlags.addInitCommand(options, flags);
  InjectIdFlags.addInjectIdCommand(options, flags);
  InjectKeywordsFlags.addInjectKeywordsCommand(options, flags);
  InjectTitleFlags.addInjectTitleCommand(options, flags);
  RenameFilesFlags.addRenameFilesCommand(options, flags);

  flags.help();
  flags.version(options.appVersion);

  if (Deno.args.length > 0) {
    _tryParse(flags);
  } else {
    flags.outputHelp();
  }
}

function _tryParse(flags: T.TCLIFlags): void {
  try {
    flags.parse();
  } catch (err) {
    if (err.name === "CACError") {
      console.error([
        `error: ${err.message}`,
        "",
        "For more information, try --help",
      ].join("\r\n"));
    } else {
      throw err;
    }
  }
}

export const __private__ = {
  _tryParse,
};
