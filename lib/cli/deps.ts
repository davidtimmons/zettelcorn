/**
 * External dependencies for the CLI module. All code in this module that needs an
 * external dependency will reference this file.
 * @protected
 * @module cli/deps
 */

// @deno-types="https://unpkg.com/cac@6.6.1/mod.d.ts"
export { cac as CAC } from "https://unpkg.com/cac@6.6.1/mod.js";

export {
  Flags as InitFlags,
  Types as InitTypes,
} from "../commands/init/mod.ts";

export {
  Flags as InjectIdFlags,
  Types as InjectIdTypes,
} from "../commands/inject_id/mod.ts";

export {
  Flags as InjectKeywordsFlags,
  Types as InjectKeywordsTypes,
} from "../commands/inject_keywords/mod.ts";

export {
  Flags as InjectTitleFlags,
  Types as InjectTitleTypes,
} from "../commands/inject_title/mod.ts";

export {
  Flags as NewZettelFlags,
  Types as NewZettelTypes,
} from "../commands/new_zettel/mod.ts";

export {
  Flags as RenameFilesFlags,
  Types as RenameFilesTypes,
} from "../commands/rename_files/mod.ts";
