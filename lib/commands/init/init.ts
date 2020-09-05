/**
 * Initializes a Zettelcorn project directory with configuration files.
 * @protected
 * @implements {ICommandModule}
 * @module commands/init/init
 * @see module:commands/init/mod
 */

import { TExitCodes, TStatusCodes } from "../types.ts";
import { ConfigFiles, Path, Utilities as $ } from "./deps.ts";
import { Status, Types } from "./mod.ts";

const { MetaData, Zettel } = ConfigFiles;

export async function run(
  options: Types.TInitRunOptions,
): Types.TInitRunResult {
  // Paths cannot be generated against a directory that does not exist. It is better to
  // fail fast than create directories and files based on a typo.
  const baseDirExists = await $.doesFileOrDirectoryExist(options.directory);
  if (!baseDirExists) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.NO_DIRECTORY_FOUND,
      configDirectory: MetaData.localDirectory,
    });
    Deno.exit();
  }

  const basePath = Deno.realPathSync(options.directory);
  const writePath = Path.join(basePath, MetaData.localDirectory);
  const configFiles: [string, string][] = [
    // Add .zettelcorn configuration files to be copied here:
    [Path.join(writePath, Zettel.fileName), Zettel.fileData],
  ];

  // Rather than fail on individual files, fail if the directory exists and offer a flag to
  // overwrite files. This makes updating configuration easier for new CLI versions.
  const configDirExists = await $.doesFileOrDirectoryExist(writePath);
  if (!options.force && configDirExists) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.INVALID_DIRECTORY,
      configDirectory: MetaData.localDirectory,
    });
    Deno.exit();
  }

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
    $.notifyUser(
      "Directory written:",
      { padTop: true, style: $.TUIStyles.BOLD },
    );
    $.notifyUser(writePath);
    $.notifyUser(
      "Configuration files written:",
      { padTop: true, style: $.TUIStyles.BOLD },
    );
    configFiles.forEach((configFile) => {
      const [filePath] = configFile;
      $.notifyUser(filePath);
    });
  }

  return Promise.resolve({ status: TStatusCodes.OK });
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
  _undoWriteConfigFiles,
  _writeConfigFiles,
};

export default { run };
