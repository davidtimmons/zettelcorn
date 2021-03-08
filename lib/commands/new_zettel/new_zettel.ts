/**
 * Initializes a Zettelcorn project directory with configuration files.
 * @protected
 * @implements {ICommandModule}
 * @module commands/new_zettel/new_zettel
 * @see module:commands/new_zettel/mod
 */

import { TExitCodes, TStatusCodes } from "../mod.ts";
import { ConfigFiles, Path, Utilities as $ } from "./deps.ts";
import type * as Types from "./types.ts";
import * as Status from "./ui/status.ts";

const { MetaData, ZcConfig, Zettel } = ConfigFiles;

export async function run(
  options: Types.TNewZettelRunOptions,
): Types.TNewZettelRunResult {
  // Verify CLI input before writing any data.
  await _preflightCheck(options);

  // Get selected zettel template, then confirm it should be written.
  const zettelDir = Deno.realPathSync(options.directory);
  const [fileName, fileData, isLocal] = await _getZettelTemplate(options);

  const defaultExtIndex = fileName.indexOf(Zettel.fileExt);
  const customExtIndex = fileName.indexOf(
    `.${options.template.trim()}${Zettel.fileExt}`,
  );
  const fileExtStart = customExtIndex >= 0 ? customExtIndex : defaultExtIndex;
  const fileNameTemplate = fileName.substring(0, fileExtStart);

  if (!options.silent) {
    const userResponse = await Status.confirmChange({
      fileNameTemplate: fileNameTemplate,
      isLocal,
      zettelDir,
      total: options.total,
      zettelcornDir: MetaData.localDirectory,
    });

    const changeRejected = userResponse.match(/[yY]/) === null;
    if (changeRejected) {
      Deno.exit();
    }
  }

  // Attempt to write the new files.
  const createFileName = $.generateGetterFromTokenExp(fileNameTemplate);
  const createFileData = $.generateGetterFromTokenExp(fileData);
  let writeResults: string[] = [];
  try {
    writeResults = _writeZettelFiles(
      options,
      zettelDir,
      createFileName,
      createFileData,
    );
  } catch (error) {
    Status.notifyUserOfExit({
      ...options,
      error,
      exitCode: TExitCodes.WRITE_ERROR,
    });
    Deno.exit();
  }

  // Report all files written to orient the user as to what was added to their drive.
  if (!options.silent && options.verbose) {
    Status.notifyUserOfCompletion(zettelDir, writeResults);
  }

  return Promise.resolve({ status: TStatusCodes.OK });
}

/**
 * Check all pre-conditions before attempting to write any files. Fail fast rather than
 * guessing what the user may have meant.
 */
async function _preflightCheck(options: Types.TNewZettelRunOptions) {
  const totalIsValid = typeof options.total === "number" && options.total > 0;
  if (!totalIsValid) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.INVALID_NUMBER,
    });
    Deno.exit();
  }

  const directoryExists = await $.doesFileOrDirectoryExist(options.directory);
  if (!directoryExists) {
    Status.notifyUserOfExit({
      ...options,
      exitCode: TExitCodes.NO_DIRECTORY_FOUND,
    });
    Deno.exit();
  }
}

/**
 * Get the local zettel template if it exists or fall back to the pre-defined default saved
 * with this application.
 */
async function _getZettelTemplate(
  options: Types.TNewZettelRunOptions,
): Promise<[string, string, boolean]> {
  let fileName = Zettel.fileName;
  let fileData = Zettel.fileData;
  let isLocal = false;

  if (options.default) {
    return [fileName, fileData, isLocal];
  }

  // First, get the YAML configuration file that contains the list of zettel template.
  const [configName, configData] = await $.getLocalConfigFile(
    ZcConfig.fileName,
    options.zettelcornConfigDirectory,
  );

  // Use the local config file if it exists, or fall back to the template defaults.
  if (configName && configData) {
    const localConfig = configData ? $.parseYAML(configData) : {};
    const localTemplates = localConfig.zettel_templates ?? {};
    const selectedTemplate = localTemplates[options.template];

    // Fail if the local config file does not contain the selected template.
    if (!selectedTemplate) {
      Status.notifyUserOfExit({
        ...options,
        exitCode: TExitCodes.NO_FILE_FOUND,
      });
      Deno.exit();
    }

    // Then, get the selected template.
    const [templateName, templateData] = await $.getLocalConfigFile(
      selectedTemplate,
      options.zettelcornConfigDirectory,
    );

    // Fail if the selected template file does not exist.
    if (!templateName || !templateData) {
      Status.notifyUserOfExit({
        ...options,
        exitCode: TExitCodes.NO_FILE_FOUND,
      });
      Deno.exit();
    }

    fileName = templateName;
    fileData = templateData;
    isLocal = true;
  }

  return [fileName, fileData, isLocal];
}

/**
 * Write the new zettel files.
 */
function _writeZettelFiles(
  options: Types.TNewZettelRunOptions,
  writePath: string,
  createFileName: Function,
  createFileData: Function,
): string[] {
  const writeResults: string[] = [];

  for (let i = 0, len = options.total; i < len; i += 1) {
    // Bump the seconds every iteration to ensure a unique timestamp. This will overwrite some
    // files when creating several huge file batches in succession. However, this is a tradeoff
    // when using a timestamp as a GUID. Modern computer clock speeds are just too fast for
    // unique timestamps in rapid succession without using absurdly long precision formats.
    const date = new Date();
    date.setSeconds(i + date.getSeconds());

    const tokenValues = Object.values(ConfigFiles.MetaData.tokens)
      .reduce((accum, tokenData) => {
        let tokenValue;
        switch (tokenData.id) {
          case "id":
            tokenValue = tokenData.create(date);
            break;
          default:
            tokenValue = tokenData.create();
        }

        return {
          ...accum,
          [tokenData.id]: tokenValue,
        };
      }, {});

    const newFileName = createFileName(tokenValues);
    const newFilePath = Path.join(writePath, newFileName);
    const newFileData = createFileData(tokenValues);
    Deno.writeTextFileSync(newFilePath, newFileData);
    writeResults.push(newFileName);
  }
  return writeResults;
}

export const __private__ = {
  _getZettelTemplate,
  _preflightCheck,
  _writeZettelFiles,
};

export default { run };
