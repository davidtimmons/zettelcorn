/**
 * Initializes a Zettelcorn project directory with configuration files.
 * @protected
 * @implements {ICommandModule}
 * @module commands/init/init
 * @see module:commands/init/mod
 */

import { TExitCodes, TStatusCodes } from "../mod.ts";
import { ConfigFiles, Path, Utilities as $ } from "./deps.ts";
import type * as Types from "./types.ts";
import * as Status from "./ui/status.ts";

const { MetaData, Zettel } = ConfigFiles;

export async function run(
  options: Types.TInitRunOptions,
): Types.TInitRunResult {
  // Verify CLI input before writing any data.
  await _preflightCheck(options);

  const basePath = Deno.realPathSync(options.directory);
  const writePath = Path.join(basePath, MetaData.localDirectory);

  // Add .zettelcorn configuration files to be copied here:
  const configFiles: [string, string][] = [
    [Path.join(writePath, Zettel.fileName), Zettel.fileData],
  ];

  // If something goes wrong when writing files, fail and attempt to remove anything written.
  try {
    await _writeConfigFiles(options, writePath, configFiles);
  } catch (error) {
    Status.notifyUserOfExit({
      ...options,
      error,
      exitCode: TExitCodes.WRITE_ERROR,
      configDirectory: MetaData.localDirectory,
    });
    await _undoWriteConfigFiles(writePath, options.silent);
    Deno.exit();
  }

  // Report all files written to orient the user as to what was added to their drive.
  if (!options.silent && options.verbose) {
    const results = configFiles.map((configFile) => {
      const [filePath] = configFile;
      return filePath;
    });
    Status.notifyUserOfCompletion(writePath, results);
  }

  return Promise.resolve({ status: TStatusCodes.OK });
}

/**
 * Check all pre-conditions before attempting to write any files. Fail fast rather than
 * guessing what the user may have meant.
 */
async function _preflightCheck(options: Types.TInitRunOptions) {
  // Paths cannot be generated against a directory that does not exist. Do not create
  // directories and files based on a typo.
  const baseDirExists = await $.doesFileOrDirectoryExist(options.directory);
  if (!baseDirExists) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.NO_DIRECTORY_FOUND,
      configDirectory: MetaData.localDirectory,
    });
    Deno.exit();
  }

  // Rather than fail on individual files, fail if the directory exists and offer a flag to
  // overwrite files. This makes updating configuration easier for new CLI versions.
  const basePath = Deno.realPathSync(options.directory);
  const writePath = Path.join(basePath, MetaData.localDirectory);
  const configDirExists = await $.doesFileOrDirectoryExist(writePath);
  if (!options.force && configDirExists) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.INVALID_DIRECTORY,
      configDirectory: MetaData.localDirectory,
    });
    Deno.exit();
  }
}

async function _writeConfigFiles(
  options: Types.TInitRunOptions,
  writePath: string,
  configFiles: [string, string][],
): Promise<void[]> {
  if (options.force) {
    await $.removeDirectory(writePath);
  }
  Deno.mkdirSync(writePath);
  return Promise.all(configFiles.map((configFile) => {
    const [filePath, fileData] = configFile;
    return Deno.writeTextFile(filePath, fileData);
  }));
}

async function _undoWriteConfigFiles(writePath: string, silent: boolean) {
  const notify = $.maybeNotifyUser.bind(null, !silent);
  notify("Attempting to remove configuration files...");
  const wasSuccessful = await $.removeDirectory(writePath);
  if (wasSuccessful) {
    notify("Successfully removed all configuration files!", {
      style: $.TUIStyles.GREEN,
    });
  } else {
    notify("Could not read the directory.", {
      style: $.TUIStyles.RED,
    });
  }
}

export const __private__ = {
  _preflightCheck,
  _undoWriteConfigFiles,
  _writeConfigFiles,
};

export default { run };
