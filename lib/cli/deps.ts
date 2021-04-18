/**
 * External dependencies for the CLI module. All code in this module that needs an
 * external dependency will reference this file.
 * @protected
 * @module cli/deps
 */

export { CAC } from "DepsExternal";

export {
  Flags as InitFlags,
  Types as InitTypes,
} from "CommandInit";

export {
  Flags as InjectIdFlags,
  Types as InjectIdTypes,
} from "CommandInjectId";

export {
  Flags as InjectKeywordsFlags,
  Types as InjectKeywordsTypes,
} from "CommandInjectKeywords";

export {
  Flags as InjectTitleFlags,
  Types as InjectTitleTypes,
} from "CommandInjectTitle";

export {
  Flags as NewZettelFlags,
  Types as NewZettelTypes,
} from "CommandNewZettel";

export {
  Flags as RenameFilesFlags,
  Types as RenameFilesTypes,
} from "CommandRenameFiles";
