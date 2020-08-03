import { cac } from "./deps.ts";
import * as CLITypes from "./cli_types.ts";

export default function init({
  appName,
  appVersion,
  renameFiles,
}: CLITypes.TCLIInit): void {
  const flags: CLITypes.TCACObject = cac(appName);

  flags
    .command(
      "rename.files <path> <pattern>",
      "Rename zettel files using their YAML frontmatter",
    )
    .option(
      "-r, --recursive",
      "Run command on a directory and all its sub-directories",
    )
    .example("rename.files ./zettelkasten {id}-{title}.md")
    .action((
      path: string,
      pattern: string,
      options: CLITypes.TCLIRenameFilesOptions,
    ): void => {
      renameFiles({ path, pattern, recursive: Boolean(options.recursive) }); // TODO: Status report
    });

  flags.help();
  flags.version(appVersion);

  if (Deno.args.length > 0) {
    _tryParse(flags);
  } else {
    flags.outputHelp();
  }
}

function _tryParse(flags: CLITypes.TCACObject): void {
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

export {
  init,
};
