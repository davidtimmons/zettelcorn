import { cac } from "./deps.ts";
import { TCACObject, TCLIInit } from "./cli_types.ts";

function init({
  appName,
  appVersion,
  renameFiles,
}: TCLIInit): void {
  const flags: TCACObject = cac(appName);

  flags
    .command(
      "rename.files <dir> <format>",
      "Rename zettel files using their YAML frontmatter",
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

  if (Deno.args.length > 0) {
    _tryParse(flags);
  } else {
    flags.outputHelp();
  }
}

function _tryParse(flags: TCACObject): void {
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
