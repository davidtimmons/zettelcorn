/**
 * Initializes a Zettelcorn project directory with configuration files.
 * @protected
 * @implements {ICommandModule}
 * @module commands/new_zettel/new_zettel
 * @see module:commands/new_zettel/mod
 */

import { TExitCodes, TStatusCodes } from "../types.ts";
import { ConfigFiles, Path, Utilities as $ } from "./deps.ts";
import { Status, Types } from "./mod.ts";

const { MetaData, Zettel } = ConfigFiles;

export async function run(
  options: Types.TNewZettelRunOptions,
): Types.TNewZettelRunResult {
  // Fail fast rather than guessing what the user meant.
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

  // Gather all the template parts and confirm the write process.
  const rawTemplateExtName = Zettel.fileExt;
  let rawTemplateName = Zettel.fileName;
  let rawTemplateData = Zettel.fileData;
  let foundLocalTemplate = false;

  if (!options.default) {
    const [name, data] = await $.getLocalConfigFile(rawTemplateExtName);
    rawTemplateName = name ?? rawTemplateName;
    rawTemplateData = data ?? rawTemplateData;
    foundLocalTemplate = !$.isEmpty(name);
  }

  const zettelDir = Deno.realPathSync(options.directory);
  const rawTemplateExtIndex = rawTemplateName.indexOf(rawTemplateExtName);
  const templateName = rawTemplateName.substring(0, rawTemplateExtIndex);

  if (!options.silent) {
    const userResponse = await Status.confirmChange({
      foundLocalTemplate,
      templateName,
      zettelDir,
      total: options.total,
      zettelcornDir: MetaData.localDirectory,
    });

    const changeRejected = userResponse.match(/[yY]/) === null;
    if (changeRejected) {
      Deno.exit();
    }
  }

  // TODO:
  // Build the new file name.
  // Build the new file.
  // Up to --total times,
  //   Generate %Y%m%d%H%M%S number ID.
  //   Replace {id} token with ID in file name.
  //   Replace {id} token with ID in file data.
  //   Write zettel to <directory>.
  // Report on all zettel files that were created.
  // Write an integration test.
  // Update README.

  return Promise.resolve({ status: TStatusCodes.OK });
}

// async function _confirmChangeWithUser(
//   options: Status.TConfirmChangeOptions,
// ): Promise<void> {
// }

export const __private__ = {
  // _confirmChangeWithUser,
};

export default { run };
