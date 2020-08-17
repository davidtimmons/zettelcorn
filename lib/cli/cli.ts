import {
  CAC,
  InjectKeywordsFlags,
  InjectTitleFlags,
  RenameFilesFlags,
} from "./deps.ts";
import * as T from "./types.ts";

export function init(options: T.TCLIInit): void {
  const flags: T.TCLIFlags = CAC(options.appName);

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
