/**
 * Types for the CLI module.
 * @protected
 * @module cli/types
 * @see module:cli/mod
 */

import {
  InjectIdTypes,
  InjectKeywordsTypes,
  InjectTitleTypes,
  RenameFilesTypes,
} from "./deps.ts";

export type TCLIFlags = any; // cacjs library object

export interface TCLIInit {
  readonly appVersion: string;
  readonly appName: string;
  readonly injectId?: InjectIdTypes.TInjectIdRun;
  readonly injectKeywords?: InjectKeywordsTypes.TInjectKeywordsRun;
  readonly injectTitle?: InjectTitleTypes.TInjectTitleRun;
  readonly renameFiles?: RenameFilesTypes.TRenameFilesRun;
}

export interface TCLIStandardOptions {
  directory: string;
  markdown: boolean;
  recursive: boolean;
  silent: boolean;
  verbose: boolean;
}
