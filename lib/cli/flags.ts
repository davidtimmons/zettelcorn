import { cac } from "../deps.ts";

type CACObject = any;

function init(
  appVersion: string = "0.0.0",
  appName: string = "",
): void {
  const flags: CACObject = cac(appName);

  flags
    .command(
      "rename.files <dir> <format>",
      "Rename zettel file names in this directory",
    )
    .option(
      "-r, --recursive",
      "Run command on a directory and all its sub-directories",
    )
    .example("rename.files ./zettelkasten {id}-{title}.md")
    .action((dir: string, format: string, options: object): void => {
      console.log(dir, format, options); // TODO
    });

  flags.help();
  flags.version(appVersion);

  _tryParse(flags);
}

function _tryParse(flags: CACObject): void {
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
