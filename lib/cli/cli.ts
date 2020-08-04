import { CAC, IO } from "./deps.ts";
import * as CLITypes from "./cli_types.ts";

export function init({
  appName,
  appVersion,
  renameFiles,
}: CLITypes.TCLIInit): void {
  const flags: CLITypes.TCACObject = CAC(appName);

  flags
    .command(
      "rename.files <path> <pattern>",
      "Rename zettel files using their YAML frontmatter, and ignore files without frontmatter",
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

export async function sendToUser(text: string): Promise<string> {
  console.log(text);
  // Listen to stdin for a new line
  for await (const line of IO.readLines(Deno.stdin)) {
    return line;
  }
  return "";
}

export const __private__ = {
  _tryParse,
};

export default init;
